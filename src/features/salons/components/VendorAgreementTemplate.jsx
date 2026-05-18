import { useState, useRef } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const VendorAgreementTemplate = ({ formData, onGenerate, loading }) => {
  const { user } = useAuth();
  const templateRef = useRef(null);

  const [content, setContent] = useState({
    header: {
      subTitle: "Fast Booking Service – Vendor Onboarding Agreement (en/ar)",
      mainTitle: "FAST BOOKING SERVICE",
      agreementTitle: "VENDOR ONBOARDING AGREEMENT"
    },
    sections: [
      {
        id: 1,
        titleAr: "1. رسوم التسجيل والفترة التجريبية",
        textAr: "يتم تطبيق رسوم تسجيل لمرة واحدة بقيمة 499 درهم إماراتي. بعد إتمام التسجيل بنجاح وتفعيل الملف التجاري، يحصل مقدم الخدمة على ثلاثة (3) أشهر استخدام مجاني للمنصة.",
        titleEn: "On-Boarding Fee & Free Trial",
        textEn: "A one-time on-boarding fee of AED 499 applies. After successful onboarding and the Vendor profile going live, the Vendor receives three (3) months of free platform access."
      },
      {
        id: 2,
        titleAr: "2. رسوم المنصة (بعد الفترة المجانية)",
        textAr: "بعد انتهاء الفترة المجانية، يمكن لمقدم الخدمة اختيار أحد الخيارات التالية:\n• عمولة 2٪ على كل خدمة مكتملة، أو\n• حد أقصى للرسوم الشهرية لا يتجاوز 299 درهم + ضريبة القيمة المضافة، أو\n• اشتراك شهري ثابت بقيمة 299 درهم + ضريبة القيمة المضافة.",
        titleEn: "Platform Charges (After Free Period)",
        textEn: "After the free period, the Vendor may choose one of the following:\n• 2% platform service charge per completed service, OR\n• Maximum monthly platform charge capped at AED 299 + VAT, OR\n• Fixed monthly subscription of AED 299 + VAT."
      },
      {
        id: 3,
        titleAr: "3. مسؤوليات مقدم الخدمة",
        textAr: "يكون مقدم الخدمة مسؤولاً بشكل كامل عن تقديم الخدمات بطريقة مهنية وقانونية وضمان جودة الخدمة ورضا العملاء والالتزام بجميع قوانين دولة الإمارات العربية المتحدة.",
        titleEn: "Vendor Responsibilities",
        textEn: "The Vendor is fully responsible for delivering services professionally, ensuring service quality and customer satisfaction, and complying with all applicable UAE laws."
      },
      {
        id: 4,
        titleAr: "4. التحقق من النشاط التجاري",
        textAr: "يجب على مقدم الخدمة تقديم رخصة تجارية سارية المفعول في دولة الإمارات والمستندات المطلوبة. تحتفظ المنصة بالحق في تعليق أو إزالة الحساب في حال عدم الامتثال.",
        titleEn: "Business Verification",
        textEn: "The Vendor must submit a valid UAE business license and other required documents. The Platform reserves the right to suspend or remove the profile if documents are invalid, expired, or non-compliant."
      },
      {
        id: 5,
        titleAr: "5. شروط الدفع",
        textAr: "سيتم تحصيل المدفوعات عبر الإنترنت من العملاء مباشرةً إلى الحساب البنكي الرسمي لخدمة Fast Booking Service، وسيتم تحويل المبلغ النهائي—بعد خصم رسوم الخدمة—إلى الحساب البنكي الموثق لمقدم الخدمة كل 10 أيام.",
        titleEn: "Payment Terms",
        textEn: "Online payments will be collected from customers directly into Fast Booking Service's official bank account, and the final amount—after deducting service charges—will be transferred to the service provider's verified bank account every 10 days."
      },
      {
        id: 6,
        titleAr: "6. الإدراجات الإلكترونية ودقة المعلومات",
        textAr: "يجوز للمنصة إنشاء وإدارة إدراجات النشاط التجاري على مواقع وتطبيقات ومنصات خارجية باستخدام المعلومات المقدمة من مقدم الخدمة. يتحمل مقدم الخدمة المسؤولية الكاملة عن دقة وقانونية المعلومات.",
        titleEn: "Online Listings & Information Accuracy",
        textEn: "The Platform may create and manage business listings on third-party websites and apps using information provided by the service provider. The Vendor is solely responsible for the accuracy and legality of such information."
      },
      {
        id: 7,
        titleAr: "7. دور المنصة وإخلاء المسؤولية",
        textAr: "تعمل خدمة فاست بوكينج كمنصة تقنية فقط لربط العملاء بمقدمي الخدمات، ولا تقدم أو تضمن أي خدمات، ولا تتحمل أي مسؤولية عن النزاعات أو الأضرار بين الأطراف.",
        titleEn: "Platform Role & Liability Disclaimer",
        textEn: "Fast Booking Service acts solely as a technology marketplace and does not provide, supervise, or guarantee services. The Platform is not liable for disputes or damages between customers and Vendors."
      },
      {
        id: 8,
        titleAr: "8. المدفوعات والنزاعات",
        textAr: "جميع المدفوعات تكون بين مقدم الخدمة والعميل مباشرة، ولا تتحمل المنصة أي مسؤولية عن النزاعات المالية أو المبالغ المستردة.",
        titleEn: "Payments & Disputes",
        textEn: "All payments are between the Vendor and the customer. The Platform is not responsible for payment disputes, refunds, or chargebacks."
      },
      {
        id: 9,
        titleAr: "9. الاستخدام المقبول",
        textAr: "يُمنع استخدام المنصة لأي أنشطة غير قانونية أو احتيالية أو مضللة أو غير مصرح بها، ويجوز للمنصة إنهاء الاتفاقية فوراً عند المخالفة.",
        titleEn: "Acceptable Use",
        textEn: "The Platform must not be used for illegal, fraudulent, misleading, or unauthorized activities. Violations may result in immediate termination."
      },
      {
        id: 10,
        titleAr: "10. إنهاء الاتفاقية",
        textAr: "يجوز لأي طرف إنهاء هذه الاتفاقية بإشعار خطي قبل شهر واحد. ويجوز للمنصة الإنهاء الفوري في حالات الاحتيال أو المخالفات القانونية أو انتهاء الرخصة.",
        titleEn: "Termination",
        textEn: "Either party may terminate this Agreement with one (1) month prior written notice. Immediate termination may occur in cases of fraud, illegal activity, or license expiry."
      },
      {
        id: 11,
        titleAr: "11. القانون الواجب التطبيق والاختصاص القضائي",
        textAr: "تخضع هذه الاتفاقية لقوانين دولة الإمارات العربية المتحدة، وتكون محاكم الدولة مختصة حصرياً بالنظر في أي نزاع.",
        titleEn: "Governing Law & Jurisdiction",
        textEn: "This Agreement is governed by the laws of the United Arab Emirates, and UAE courts shall have exclusive jurisdiction."
      },
      {
        id: 12,
        titleAr: "12. رسوم بوابة الدفع ورسائل الواتساب",
        textAr: "سيتم تطبيق رسوم بوابة الدفع () ورسائل واتساب ()، وسيتم تحصيلها بشكل منفصل.",
        titleEn: "Payment Gateway & WhatsApp Charges",
        textEn: "Payment gateway () and WhatsApp messages () charges will be applied and charged separately."
      },
      {
        id: 13,
        titleAr: "13. الإقرار والموافقة",
        textAr: "سيتم تطبيق رسوم بوابة الدفع () ورسائل واتساب ()، وسيتم تحصيلها بشكل منفصل.",
        titleEn: "Acceptance",
        textEn: "By registering on the Platform, the Vendor confirms full acceptance of this Agreement."
      }
    ]
  });

  const [platformFields, setPlatformFields] = useState({
    authorizedRep: user?.fullName || user?.name || "",
    signatureFile: null,
    signaturePreview: "",
    companyStampFile: null,
    companyStampPreview: "",
  });

  const handleHeaderChange = (field, value) => {
    setContent(prev => ({ ...prev, header: { ...prev.header, [field]: value } }));
  };

  const handleSectionChange = (id, field, value) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const handleFileUpload = (field, previewField) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPlatformFields(prev => ({ ...prev, [field]: file, [previewField]: url }));
    }
  };

  const isComplete =
    platformFields.authorizedRep &&
    platformFields.signatureFile &&
    platformFields.companyStampFile &&
    formData.signerName;

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

  // ─── FIX: Replace ALL oklch() computed colors with safe hex values ──────────
  const sanitizeColors = (element) => {
    const allEls = [element, ...element.querySelectorAll("*")];
    const colorProps = ["color", "backgroundColor", "borderColor", "borderTopColor", "borderBottomColor", "borderLeftColor", "borderRightColor"];
    const restoreMap = [];

    allEls.forEach((el) => {
      const computed = window.getComputedStyle(el);
      const saved = {};
      let changed = false;

      colorProps.forEach((prop) => {
        const val = computed[prop];
        if (val && (val.includes("oklch") || val.includes("oklab") || val.includes("color("))) {
          const cssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
          saved[cssProp] = el.style.getPropertyValue(cssProp);

          // Map to safe black/white/gray
          const isBackground = prop === "backgroundColor";
          const safeColor = isBackground ? "#ffffff" : "#000000";
          el.style.setProperty(cssProp, safeColor, "important");
          changed = true;
        }
      });

      if (changed) restoreMap.push({ el, saved });
    });

    return restoreMap;
  };

  const restoreColors = (restoreMap) => {
    restoreMap.forEach(({ el, saved }) => {
      Object.entries(saved).forEach(([prop, val]) => {
        el.style.setProperty(prop, val);
      });
    });
  };

  // ─── FIX: Replace CSS grid with table-based layout for html2canvas ──────────
  // html2canvas has poor support for CSS grid; we swap signature grids to inline-table temporarily
  const fixGridsForPdf = (element) => {
    const grids = element.querySelectorAll("[data-pdf-grid]");
    const originalDisplays = [];

    grids.forEach((grid) => {
      originalDisplays.push({ el: grid, display: grid.style.display });
      grid.style.display = "block";
      // Convert each row's children to block layout
      const rows = grid.children;
      Array.from(rows).forEach((row) => {
        row.style.display = "block";
        row.style.marginBottom = "8px";
      });
    });

    return originalDisplays;
  };

  const handleGeneratePdf = async () => {
    if (!isComplete) return;
    const html2pdf = (await import("html2pdf.js")).default;
    const element = templateRef.current;

    // Step 1: Convert images to base64
    const images = element.querySelectorAll("img");
    const originalSrcs = [];

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

    // Step 2: Sanitize oklch colors
    const colorRestoreMap = sanitizeColors(element);

    // Step 3: Force explicit font/color on template root so html2canvas inherits correctly
    const prevFont = element.style.fontFamily;
    const prevColor = element.style.color;
    const prevBg = element.style.backgroundColor;
    element.style.fontFamily = "'Times New Roman', Times, serif";
    element.style.color = "#000000";
    element.style.backgroundColor = "#ffffff";

    const opt = {
      margin: [8, 8, 8, 8],
      filename: `Vendor_Agreement_${formData.signerName.replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.92 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        // ─── FIX: windowWidth forces the canvas to render at A4 pixel width ───
        windowWidth: 794, // 210mm @ 96dpi
        // ─── FIX: backgroundColor prevents transparent/black canvas ───────────
        backgroundColor: "#ffffff",
        // ─── FIX: ignoreElements skips upload controls outside printable area ─
        ignoreElements: (el) => el.dataset.pdfIgnore === "true",
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    try {
      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");
      const pdfFile = new File(
        [pdfBlob],
        `Vendor_Agreement_${formData.signerName.replace(/\s+/g, "_")}.pdf`,
        { type: "application/pdf" }
      );
      onGenerate(pdfFile);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      // Restore everything
      images.forEach((img, idx) => {
        if (originalSrcs[idx] !== undefined) img.setAttribute("src", originalSrcs[idx]);
      });
      restoreColors(colorRestoreMap);
      element.style.fontFamily = prevFont;
      element.style.color = prevColor;
      element.style.backgroundColor = prevBg;
    }
  };

  const EditableText = ({ value, onChange, className = "", dir: dirProp, ...props }) => (
    <div
      contentEditable
      suppressContentEditableWarning
      dir={dirProp}
      onBlur={(e) => onChange(e.currentTarget.innerText)}
      className={`outline-none hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-200 p-1 rounded transition-all ${className}`}
      style={{
        fontFamily: "'Times New Roman', Times, serif",
        whiteSpace: "pre-wrap",
        minHeight: "1em",
        color: "#000000",
      }}
      {...props}
    >
      {value}
    </div>
  );

  // ─── Signature row: table-based so html2canvas renders it correctly ──────────
  const SigRow = ({ label, children }) => (
    <div style={{ display: "flex", alignItems: "flex-end", marginBottom: "8px", gap: "10px", pageBreakInside: "avoid" }}>
      <div style={{ minWidth: "150px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", fontFamily: "'Times New Roman', Times, serif", color: "#000000", flexShrink: 0 }}>
        {label}
      </div>
      <div style={{ flex: 1, borderBottom: "1px solid #000000", minHeight: "40px", display: "flex", alignItems: "center", padding: "2px 0" }}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full">
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="w-full overflow-x-auto pb-4 flex justify-center">
          {/* ─── Printable area ─────────────────────────────────────────────── */}
          <div
            ref={templateRef}
            style={{
              width: "210mm",
              minHeight: "297mm",
              padding: "20mm",
              boxSizing: "border-box",
              fontFamily: "'Times New Roman', Times, serif",
              color: "#000000",
              lineHeight: "1.6",
              backgroundColor: "#ffffff",
              position: "relative",
            }}
            className="bg-white shadow-sm"
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <EditableText
                value={content.header.subTitle}
                onChange={(v) => handleHeaderChange("subTitle", v)}
                className="text-sm italic mb-4"
              />
              <EditableText
                value={content.header.mainTitle}
                onChange={(v) => handleHeaderChange("mainTitle", v)}
                className="text-3xl font-bold tracking-widest mb-2"
              />
              <EditableText
                value={content.header.agreementTitle}
                onChange={(v) => handleHeaderChange("agreementTitle", v)}
                className="text-xl font-bold uppercase"
              />
              <div style={{ width: "100%", height: "2px", backgroundColor: "#000000", marginTop: "24px" }} />
              <div style={{ fontSize: "11px", marginTop: "8px", fontWeight: "700", fontFamily: "'Times New Roman', Times, serif", color: "#000000" }}>
                النسخة العربية ثم الإنجليزية
              </div>
              <div style={{ width: "100%", height: "2px", backgroundColor: "#000000", marginTop: "8px" }} />
            </div>

            {/* Sections */}
            <div>
              {content.sections.map((section) => (
                <div key={section.id} style={{ marginBottom: "24px", pageBreakInside: "avoid" }}>
                  <EditableText
                    value={section.titleAr}
                    onChange={(v) => handleSectionChange(section.id, "titleAr", v)}
                    className="font-bold text-base mb-1"
                    dir="rtl"
                    style={{ textAlign: "right" }}
                  />
                  <EditableText
                    value={section.textAr}
                    onChange={(v) => handleSectionChange(section.id, "textAr", v)}
                    className="text-[13px] mb-3 leading-relaxed"
                    dir="rtl"
                    style={{ textAlign: "right" }}
                  />
                  <EditableText
                    value={section.titleEn}
                    onChange={(v) => handleSectionChange(section.id, "titleEn", v)}
                    className="font-bold text-base mb-1"
                  />
                  <EditableText
                    value={section.textEn}
                    onChange={(v) => handleSectionChange(section.id, "textEn", v)}
                    className="text-[13px] leading-relaxed"
                  />
                  <div style={{ width: "100%", height: "1px", backgroundColor: "#000000", opacity: 0.25, marginTop: "20px" }} />
                </div>
              ))}

              {/* ─── Signature Blocks ──────────────────────────────────────── */}
              <div style={{ marginTop: "30px", pageBreakBefore: "always" }}>
                <div style={{ fontSize: "16px", fontWeight: "700", textTransform: "uppercase", borderBottom: "2px solid #000000", paddingBottom: "6px", marginBottom: "20px", fontFamily: "'Times New Roman', Times, serif", color: "#000000" }}>
                  Signature Blocks
                </div>

                {/* Vendor Details */}
                <div style={{ border: "1px solid #000000", padding: "16px", marginBottom: "20px" }}>
                  <div style={{ fontWeight: "700", fontSize: "12px", textAlign: "center", borderBottom: "1px solid #000000", paddingBottom: "8px", marginBottom: "16px", fontFamily: "'Times New Roman', Times, serif", color: "#000000" }}>
                    Vendor Details
                  </div>

                  <SigRow label="Vendor Name:">
                    <span style={{ fontSize: "13px", fontFamily: "'Times New Roman', Times, serif", color: "#000000" }}>
                      {formData.signerName || "________________"}
                    </span>
                  </SigRow>

                  <SigRow label="Authorized Signatory:">
                    <span style={{ fontSize: "13px", fontFamily: "'Times New Roman', Times, serif", color: "#000000" }}>
                      {formData.signerName || "________________"}
                    </span>
                  </SigRow>

                  <SigRow label="Date:">
                    <span style={{ fontSize: "13px", fontFamily: "'Times New Roman', Times, serif", color: "#000000" }}>
                      {new Date().toLocaleDateString("en-GB")}
                    </span>
                  </SigRow>

                  <SigRow label="Company Stamp:">
                    {platformFields.companyStampPreview ? (
                      <img src={platformFields.companyStampPreview} alt="Company Stamp" style={{ maxHeight: "65px", objectFit: "contain" }} />
                    ) : (
                      <span style={{ color: "#d1d5db" }}>_________________________________</span>
                    )}
                  </SigRow>

                  <SigRow label="Signature:">
                    {formData.signatureImageUrl ? (
                      <img src={formData.signatureImageUrl} alt="Vendor Signature" style={{ maxHeight: "65px", objectFit: "contain" }} />
                    ) : (
                      <span style={{ color: "#d1d5db" }}>_________________________________</span>
                    )}
                  </SigRow>
                </div>

                {/* Platform Details */}
                <div style={{ border: "1px solid #000000", padding: "16px" }}>
                  <div style={{ fontWeight: "700", fontSize: "12px", textAlign: "center", borderBottom: "1px solid #000000", paddingBottom: "8px", marginBottom: "16px", fontFamily: "'Times New Roman', Times, serif", color: "#000000" }}>
                    Fast Booking Service (Platform)
                  </div>

                  <SigRow label="Authorized Representative:">
                    <span style={{ fontSize: "12px", fontFamily: "'Times New Roman', Times, serif", color: "#000000" }}>
                      {platformFields.authorizedRep || "________________"}
                    </span>
                  </SigRow>

                  <SigRow label="Date:">
                    <span style={{ fontSize: "12px", fontFamily: "'Times New Roman', Times, serif", color: "#000000" }}>
                      {new Date().toLocaleDateString("en-GB")}
                    </span>
                  </SigRow>

                  <SigRow label="Signature:">
                    {platformFields.signaturePreview ? (
                      <img src={platformFields.signaturePreview} alt="Platform Signature" style={{ maxHeight: "65px", objectFit: "contain" }} />
                    ) : (
                      <span style={{ color: "#d1d5db" }}>_________________________________</span>
                    )}
                  </SigRow>

                  <SigRow label="Company Stamp:">
                    {platformFields.companyStampPreview ? (
                      <img src={platformFields.companyStampPreview} alt="Company Stamp" style={{ maxHeight: "65px", objectFit: "contain" }} />
                    ) : (
                      <span style={{ color: "#d1d5db" }}>_________________________________</span>
                    )}
                  </SigRow>
                </div>
              </div>
            </div>
          </div>
          {/* ─── End printable area ─────────────────────────────────────────── */}
        </div>

        {/* Upload Controls — marked data-pdf-ignore so html2canvas skips them */}
        <div
          data-pdf-ignore="true"
          className="w-full max-w-[850px] bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5"
        >
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">
            Admin: Platform Signature & Stamp Uploads
          </h4>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
              Authorized Representative Name
            </label>
            <input
              type="text"
              value={platformFields.authorizedRep}
              onChange={(e) => setPlatformFields(prev => ({ ...prev, authorizedRep: e.target.value }))}
              className="w-full bg-white border border-slate-200 text-slate-900 py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all font-medium"
              placeholder="Enter representative name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { field: "signatureFile", previewField: "signaturePreview", label: "Signature Image", previewAlt: "Signature" },
              { field: "companyStampFile", previewField: "companyStampPreview", label: "Company Stamp Image", previewAlt: "Stamp" },
            ].map(({ field, previewField, label, previewAlt }) => (
              <div key={field}>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">{label}</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload(field, previewField)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`p-4 border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center text-center min-h-[100px] ${platformFields[field] ? "border-green-400 bg-green-50/30" : "border-slate-200 bg-white hover:border-slate-400"}`}>
                    {platformFields[previewField] ? (
                      <>
                        <img src={platformFields[previewField]} alt={previewAlt} className="max-h-12 object-contain mb-1" />
                        <span className="text-[9px] text-green-600 font-bold uppercase tracking-wider">Uploaded ✓</span>
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span className="text-[10px] text-slate-400 font-bold mt-1">Upload {label.split(" ")[0]}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div data-pdf-ignore="true" className="w-full max-w-[850px] flex flex-col sm:flex-row gap-3 sm:gap-4 pb-8">
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </button>
        </div>

        {!isComplete && (
          <p data-pdf-ignore="true" className="text-[10px] text-amber-600 font-bold uppercase tracking-widest text-center -mt-4 pb-4">
            ⚠ Please fill all fields and upload signature & stamp to proceed
          </p>
        )}
      </div>
    </div>
  );
};

export default VendorAgreementTemplate;