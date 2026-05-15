import { useState, useRef } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

// PDF-safe colors - Strictly Black & White for the agreement
const PDF_COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  grayMuted: "#E5E7EB",
  grayDark: "#4B5563"
};

const VendorAgreementTemplate = ({ formData, onGenerate, loading }) => {
  const { user } = useAuth();
  const templateRef = useRef(null);

  // Editable template fields
  const [templateFields, setTemplateFields] = useState({
    onboardingFee: "499",
    platformChargePercent: "2",
    maxMonthlyCharge: "299",
    fixedSubscription: "299",
  });

  // Platform side fields
  const [platformFields, setPlatformFields] = useState({
    authorizedRep: user?.fullName || user?.name || "",
    signatureFile: null,
    signaturePreview: "",
    companyStampFile: null,
    companyStampPreview: "",
  });

  const handleTemplateChange = (field, value) => {
    setTemplateFields(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field, previewField) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPlatformFields(prev => ({ ...prev, [field]: file, [previewField]: url }));
    }
  };

  const isComplete = platformFields.authorizedRep &&
    platformFields.signatureFile &&
    platformFields.companyStampFile &&
    formData.signerName;

  // Convert an image URL to a base64 data URL to bypass CORS during PDF generation
  const R2_ORIGIN = "https://pub-217cdd174363465384bf5173ace8200c.r2.dev";

  const toDataUrl = async (url) => {
    try {
      let fetchUrl = url;
      if (url.startsWith(R2_ORIGIN)) {
        fetchUrl = url.replace(R2_ORIGIN, "/r2-proxy");
      }
      const resp = await fetch(fetchUrl);
      if (!resp.ok) return "";
      const blob = await resp.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(blob);
      });
    } catch {
      return "";
    }
  };

  const handleGeneratePdf = async () => {
    if (!isComplete) return;
    const html2pdf = (await import("html2pdf.js")).default;
    const element = templateRef.current;

    // To handle CORS images, we temporarily replace src with base64 on the actual element
    // then revert after generation to avoid flicker or state issues
    const images = element.querySelectorAll("img");
    const originalSrcs = [];

    try {
      // Step 1: Pre-convert all images to base64
      await Promise.all(
        Array.from(images).map(async (img, idx) => {
          const src = img.getAttribute("src");
          originalSrcs[idx] = src;
          if (src && !src.startsWith("data:")) {
            const dataUrl = await toDataUrl(src);
            if (dataUrl) img.setAttribute("src", dataUrl);
          }
        })
      );

      // html2canvas doesn't support oklch() colors (Tailwind v4)
      // Temporarily replace any oklch computed colors with safe hex values
      const allEls = [element, ...element.querySelectorAll("*")];
      const colorProps = [
        "color", "backgroundColor",
        "borderColor", "borderTopColor", "borderRightColor",
        "borderBottomColor", "borderLeftColor", "outlineColor",
        "boxShadow"
      ];
      const savedStyles = allEls.map((el) => {
        const computed = window.getComputedStyle(el);
        const saved = {};
        colorProps.forEach((prop) => {
          const val = computed[prop];
          if (val && val.includes("oklch")) {
            saved[prop] = el.style[prop];
            // Map to nearest safe color
            el.style.setProperty(
              prop.replace(/([A-Z])/g, "-$1").toLowerCase(),
              PDF_COLORS.black,
              "important"
            );
          }
        });
        return saved;
      });

      const opt = {
        margin: [0, 0, 0, 0],
        filename: `Vendor_Agreement_${formData.signerName.replace(/\s+/g, '_')}.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // Generate the PDF from the visible element directly to ensure visibility
      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");
      const pdfFile = new File(
        [pdfBlob],
        `Vendor_Agreement_${formData.signerName.replace(/\s+/g, '_')}.pdf`,
        { type: "application/pdf" }
      );
      onGenerate(pdfFile);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      // Revert image sources to original
      images.forEach((img, idx) => {
        img.setAttribute("src", originalSrcs[idx]);
      });

      // Revert oklch overrides
      if (typeof allEls !== 'undefined' && typeof savedStyles !== 'undefined') {
        allEls.forEach((el, i) => {
          if (savedStyles[i]) {
            Object.entries(savedStyles[i]).forEach(([prop, val]) => {
              el.style[prop] = val;
            });
          }
        });
      }
    }
  };

  const EditableField = ({ value, onChange, suffix = "" }) => (
    <span className="inline-flex items-center gap-1">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-center font-bold outline-none px-1 py-0.5 border-b border-black bg-transparent"
        style={{ 
          width: `${Math.max(value.length * 9, 40)}px`, 
          fontFamily: "inherit",
          color: PDF_COLORS.black,
          fontSize: "inherit"
        }}
      />
      {suffix && <span>{suffix}</span>}
    </span>
  );

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full">
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Printable Template Wrapper */}
        <div className="w-full overflow-x-auto pb-4 flex justify-center">
          <div
            ref={templateRef}
            className="bg-white border border-gray-200"
            style={{ 
              width: "210mm", 
              minHeight: "297mm", 
              padding: "20mm",
              boxSizing: "border-box",
              fontFamily: "'Times New Roman', serif", 
              color: PDF_COLORS.black, 
              lineHeight: "1.5",
              backgroundColor: PDF_COLORS.white,
              position: "relative"
            }}
          >
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold tracking-wider mb-2" style={{ color: PDF_COLORS.black }}>FAST BOOKING SERVICE</h1>
              <h2 className="text-xl font-bold uppercase" style={{ color: PDF_COLORS.black }}>Vendor Onboarding Agreement</h2>
              <div className="w-full h-1 mt-6" style={{ backgroundColor: PDF_COLORS.black }} />
              <p className="text-sm mt-3 italic" style={{ color: PDF_COLORS.black }}>Bilingual Document (Arabic / English)</p>
              <div className="w-full h-0.5 mt-2" style={{ backgroundColor: PDF_COLORS.black }} />
            </div>

            {/* Sections Container */}
            <div className="space-y-8">
              {/* Section 1 */}
              <div style={{ pageBreakInside: "avoid" }}>
                <h3 className="font-bold text-base mb-2 underline">1. رسوم التسجيل والفترة التجريبية (Registration & Trial)</h3>
                <p className="text-sm mb-3 text-right leading-relaxed" dir="rtl">
                  يتم تطبيق رسوم تسجيل لمرة واحدة بقيمة 499 درهم إماراتي. بعد إتمام التسجيل بنجاح وتفعيل الملف التجاري، يحصل مقدم الخدمة على ثلاثة (3) أشهر استخدام مجاني للمنصة.
                </p>
                <p className="text-sm leading-relaxed">
                  A one-time on-boarding fee of AED <EditableField value={templateFields.onboardingFee} onChange={(v) => handleTemplateChange("onboardingFee", v)} /> applies. After successful onboarding and the Vendor profile going live, the Vendor receives three (3) months of free platform access.
                </p>
                <div className="w-full h-px mt-6" style={{ backgroundColor: PDF_COLORS.black }} />
              </div>

              {/* Section 2 */}
              <div style={{ pageBreakInside: "avoid" }}>
                <h3 className="font-bold text-base mb-2 underline">2. رسوم المنصة (Platform Charges)</h3>
                <p className="text-sm mb-2 text-right leading-relaxed" dir="rtl">
                  بعد انتهاء الفترة المجانية، يمكن لمقدم الخدمة اختيار أحد الخيارات التالية:
                </p>
                <ul className="text-sm list-disc mr-8 mb-4 space-y-1 text-right" dir="rtl">
                  <li>عمولة 2٪ على كل خدمة مكتملة، أو</li>
                  <li>حد أقصى للرسوم الشهرية لا يتجاوز 299 درهم + ضريبة القيمة المضافة، أو</li>
                  <li>اشتراك شهري ثابت بقيمة 299 درهم + ضريبة القيمة المضافة.</li>
                </ul>
                <p className="text-sm mb-1 leading-relaxed">After the free period, the Vendor may choose one of the following:</p>
                <ul className="text-sm list-disc ml-8 space-y-1 leading-relaxed">
                  <li><EditableField value={templateFields.platformChargePercent} onChange={(v) => handleTemplateChange("platformChargePercent", v)} suffix="%" /> platform service charge per completed service, OR</li>
                  <li>Maximum monthly platform charge capped at AED <EditableField value={templateFields.maxMonthlyCharge} onChange={(v) => handleTemplateChange("maxMonthlyCharge", v)} /> + VAT, OR</li>
                  <li>Fixed monthly subscription of AED <EditableField value={templateFields.fixedSubscription} onChange={(v) => handleTemplateChange("fixedSubscription", v)} /> + VAT.</li>
                </ul>
                <div className="w-full h-px mt-6" style={{ backgroundColor: PDF_COLORS.black }} />
              </div>

              {/* Section 3 */}
              <div style={{ pageBreakInside: "avoid" }}>
                <h3 className="font-bold text-base mb-2 underline">3. مسؤوليات مقدم الخدمة (Vendor Responsibilities)</h3>
                <p className="text-sm mb-3 text-right leading-relaxed" dir="rtl">يكون مقدم الخدمة مسؤولاً بشكل كامل عن تقديم الخدمات بطريقة مهنية وقانونية وضمان جودة الخدمة ورضا العملاء والالتزام بجميع قوانين دولة الإمارات العربية المتحدة.</p>
                <p className="text-sm leading-relaxed">The Vendor is fully responsible for delivering services professionally, ensuring service quality and customer satisfaction, and complying with all applicable UAE laws.</p>
                <div className="w-full h-px mt-6" style={{ backgroundColor: PDF_COLORS.black }} />
              </div>

              {/* Section 4 */}
              <div style={{ pageBreakInside: "avoid" }}>
                <h3 className="font-bold text-base mb-2 underline">4. التحقق من النشاط التجاري (Verification)</h3>
                <p className="text-sm mb-3 text-right leading-relaxed" dir="rtl">يجب على مقدم الخدمة تقديم رخصة تجارية سارية المفعول في دولة الإمارات والمستندات المطلوبة. تحتفظ المنصة بالحق في تعليق أو إزالة الحساب في حال عدم الامتثال.</p>
                <p className="text-sm leading-relaxed">The Vendor must submit a valid UAE business license and other required documents. The Platform reserves the right to suspend or remove the profile if documents are invalid, expired, or non-compliant.</p>
                <div className="w-full h-px mt-6" style={{ backgroundColor: PDF_COLORS.black }} />
              </div>

              {/* Section 5 - Payment */}
              <div style={{ pageBreakInside: "avoid" }}>
                <h3 className="font-bold text-base mb-2 underline">5. شروط الدفع (Payment Terms)</h3>
                <p className="text-sm mb-3 text-right leading-relaxed" dir="rtl">سيتم تحصيل المدفوعات عبر الإنترنت من العملاء مباشرةً إلى الحساب البنكي الرسمي لخدمة Fast Booking Service، وسيتم تحويل المبلغ النهائي—بعد خصم رسوم الخدمة—إلى الحساب البنكي الموثق لمقدم الخدمة كل 10 أيام.</p>
                <p className="text-sm leading-relaxed">Online payments will be collected from customers directly into Fast Booking Service's official bank account, and the final amount—after deducting service charges—will be transferred to the service provider's verified bank account every 10 days.</p>
                <div className="w-full h-px mt-6" style={{ backgroundColor: PDF_COLORS.black }} />
              </div>

              {/* Section 6 */}
              <div style={{ pageBreakInside: "avoid" }}>
                <h3 className="font-bold text-base mb-2 underline">6. دور المنصة (Platform Role)</h3>
                <p className="text-sm mb-3 text-right leading-relaxed" dir="rtl">تعمل خدمة فاست بوكينج كمنصة تقنية فقط لربط العملاء بمقدمي الخدمات، ولا تقدم أو تضمن أي خدمات، ولا تتحمل أي مسؤولية عن النزاعات أو الأضرار بين الأطراف.</p>
                <p className="text-sm leading-relaxed">Fast Booking Service acts solely as a technology marketplace and does not provide, supervise, or guarantee services. The Platform is not liable for disputes or damages between customers and Vendors.</p>
                <div className="w-full h-px mt-6" style={{ backgroundColor: PDF_COLORS.black }} />
              </div>

              {/* Section 7 - Termination */}
              <div style={{ pageBreakInside: "avoid" }}>
                <h3 className="font-bold text-base mb-2 underline">7. إنهاء الاتفاقية (Termination)</h3>
                <p className="text-sm mb-3 text-right leading-relaxed" dir="rtl">يجوز لأي طرف إنهاء هذه الاتفاقية بإشعار خطي قبل شهر واحد. ويجوز للمنصة الإنهاء الفوري في حالات الاحتيال أو المخالفات القانونية أو انتهاء الرخصة.</p>
                <p className="text-sm leading-relaxed">Either party may terminate this Agreement with one (1) month prior written notice. Immediate termination may occur in cases of fraud, illegal activity, or license expiry.</p>
                <div className="w-full h-px mt-6" style={{ backgroundColor: PDF_COLORS.black }} />
              </div>

              {/* Section 8 - Acceptance */}
              <div style={{ pageBreakInside: "avoid" }}>
                <h3 className="font-bold text-base mb-2 underline">8. الإقرار والموافقة (Acceptance)</h3>
                <p className="text-sm mb-3 text-right leading-relaxed" dir="rtl">باستخدام المنصة، يقر مقدم الخدمة بموافقته الكاملة على هذه الاتفاقية.</p>
                <p className="text-sm leading-relaxed">By registering on the Platform, the Vendor confirms full acceptance of this Agreement.</p>
                <div className="w-full h-1 mt-6" style={{ backgroundColor: PDF_COLORS.black }} />
              </div>

              {/* Signature Blocks */}
              <div style={{ pageBreakInside: "avoid", marginTop: "40px" }}>
                <h2 className="text-xl font-bold mb-8 uppercase" style={{ borderBottom: `2px solid ${PDF_COLORS.black}`, display: "inline-block" }}>Signature Blocks</h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20mm" }}>
                  {/* Vendor Details */}
                  <div style={{ border: `1px solid ${PDF_COLORS.black}`, padding: "15px" }}>
                    <h3 className="font-bold text-base mb-6 text-center" style={{ borderBottom: `1px solid ${PDF_COLORS.black}`, paddingBottom: "5px" }}>Vendor Details</h3>
                    <div className="space-y-5">
                      <div>
                        <span className="text-xs font-bold uppercase block">Vendor Name:</span>
                        <div style={{ borderBottom: `1px solid ${PDF_COLORS.black}`, marginTop: "4px", paddingBottom: "4px", fontSize: "13px", minHeight: "18px" }}>{formData.signerName || "________________"}</div>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase block">Authorized Signatory:</span>
                        <div style={{ borderBottom: `1px solid ${PDF_COLORS.black}`, marginTop: "4px", paddingBottom: "4px", fontSize: "13px", minHeight: "18px" }}>{formData.signerName || "________________"}</div>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase block">Signature:</span>
                        <div style={{ borderBottom: `1px solid ${PDF_COLORS.black}`, marginTop: "4px", paddingBottom: "4px", minHeight: "60px", display: "flex", alignItems: "flex-end" }}>
                          {formData.signatureImageUrl ? (
                            <img src={formData.signatureImageUrl} alt="Vendor Signature" style={{ maxHeight: "50px", objectFit: "contain" }} />
                          ) : (
                            <span style={{ fontSize: "13px", color: PDF_COLORS.grayDark }}>________________</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase block">Date:</span>
                        <div style={{ borderBottom: `1px solid ${PDF_COLORS.black}`, marginTop: "4px", paddingBottom: "4px", fontSize: "13px" }}>{new Date().toLocaleDateString("en-GB")}</div>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase block">Company Stamp:</span>
                        <div style={{ borderBottom: `1px solid ${PDF_COLORS.black}`, marginTop: "4px", paddingBottom: "4px", fontSize: "13px", minHeight: "18px" }}>________________</div>
                      </div>
                    </div>
                  </div>

                  {/* Platform Details */}
                  <div style={{ border: `1px solid ${PDF_COLORS.black}`, padding: "15px" }}>
                    <h3 className="font-bold text-base mb-6 text-center" style={{ borderBottom: `1px solid ${PDF_COLORS.black}`, paddingBottom: "5px" }}>Fast Booking Service</h3>
                    <div className="space-y-5">
                      <div>
                        <span className="text-xs font-bold uppercase block">Authorized Rep:</span>
                        <div style={{ borderBottom: `1px solid ${PDF_COLORS.black}`, marginTop: "4px", paddingBottom: "4px", fontSize: "13px", minHeight: "18px" }}>{platformFields.authorizedRep || "________________"}</div>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase block">Signature:</span>
                        <div style={{ borderBottom: `1px solid ${PDF_COLORS.black}`, marginTop: "4px", paddingBottom: "4px", minHeight: "60px", display: "flex", alignItems: "flex-end" }}>
                          {platformFields.signaturePreview ? (
                            <img src={platformFields.signaturePreview} alt="Platform Signature" style={{ maxHeight: "50px", objectFit: "contain" }} />
                          ) : (
                            <span style={{ fontSize: "13px", color: PDF_COLORS.grayDark }}>________________</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase block">Date:</span>
                        <div style={{ borderBottom: `1px solid ${PDF_COLORS.black}`, marginTop: "4px", paddingBottom: "4px", fontSize: "13px" }}>{new Date().toLocaleDateString("en-GB")}</div>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase block">Company Stamp:</span>
                        <div style={{ borderBottom: `1px solid ${PDF_COLORS.black}`, marginTop: "4px", paddingBottom: "4px", minHeight: "60px", display: "flex", alignItems: "flex-end" }}>
                          {platformFields.companyStampPreview ? (
                            <img src={platformFields.companyStampPreview} alt="Company Stamp" style={{ maxHeight: "50px", objectFit: "contain" }} />
                          ) : (
                            <span style={{ fontSize: "13px", color: PDF_COLORS.grayDark }}>________________</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Controls (outside printable area) */}
        <div className="w-full max-w-[850px] bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">
            Platform Signature & Stamp Uploads
          </h4>

          {/* Authorized Rep */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Authorized Representative Name</label>
            <input
              type="text"
              value={platformFields.authorizedRep}
              onChange={(e) => setPlatformFields(prev => ({ ...prev, authorizedRep: e.target.value }))}
              className="w-full bg-white border border-slate-200 text-slate-900 py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all font-medium"
              placeholder="Enter representative name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Signature Upload */}
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Signature Image</label>
              <div className="relative group">
                <input type="file" accept="image/*" onChange={handleFileUpload("signatureFile", "signaturePreview")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className={`p-4 border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center text-center min-h-[100px] ${platformFields.signatureFile ? "border-green-400 bg-green-50/30" : "border-slate-200 bg-white hover:border-slate-400"}`}>
                  {platformFields.signaturePreview ? (
                    <>
                      <img src={platformFields.signaturePreview} alt="Signature" className="max-h-12 object-contain mb-1" />
                      <span className="text-[9px] text-green-600 font-bold uppercase tracking-wider">Uploaded ✓</span>
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span className="text-[10px] text-slate-400 font-bold mt-1">Upload Signature</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Company Stamp Upload */}
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Company Stamp Image</label>
              <div className="relative group">
                <input type="file" accept="image/*" onChange={handleFileUpload("companyStampFile", "companyStampPreview")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className={`p-4 border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center text-center min-h-[100px] ${platformFields.companyStampFile ? "border-green-400 bg-green-50/30" : "border-slate-200 bg-white hover:border-slate-400"}`}>
                  {platformFields.companyStampPreview ? (
                    <>
                      <img src={platformFields.companyStampPreview} alt="Stamp" className="max-h-12 object-contain mb-1" />
                      <span className="text-[9px] text-green-600 font-bold uppercase tracking-wider">Uploaded ✓</span>
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span className="text-[10px] text-slate-400 font-bold mt-1">Upload Stamp</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-[850px] flex flex-col sm:flex-row gap-3 sm:gap-4 pb-8">
          <button
            onClick={handleGeneratePdf}
            disabled={!isComplete || loading}
            className={`w-full sm:flex-[2] py-3 sm:py-5 rounded-2xl sm:rounded-[24px] font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 sm:gap-3 transition-all ${
              isComplete && !loading
                ? "bg-slate-900 text-white hover:bg-black"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Generating & Uploading..." : "Generate PDF & Submit"}
            {!loading && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
            )}
          </button>
        </div>

        {!isComplete && (
          <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest text-center -mt-4 pb-4">
            ⚠ Please fill all fields and upload signature & stamp to proceed
          </p>
        )}
      </div>
    </div>
  );
};

export default VendorAgreementTemplate;
