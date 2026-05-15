import React, { useState } from 'react';
import { useBusiness } from "@/context/BusinessContext";
import { reportService } from "../services/reportService";
import { toast } from "react-toastify";
import { 
  FileText, 
  Download, 
  Calendar, 
  FileSpreadsheet, 
  FileEdit,
  Clock,
  Filter,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const BillReports = () => {
  const { businessId } = useBusiness();
  const [loading, setLoading] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);
  const [generatedConfig, setGeneratedConfig] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  
  const [formData, setFormData] = useState({
    format: 'PDF',
    dateFilter: 'TODAY',
    fromDate: '',
    toDate: '',
  });

  const formats = [
    { id: 'PDF', label: 'PDF', icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'EXCEL', label: 'Excel', icon: FileSpreadsheet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'WORD', label: 'Word', icon: FileEdit, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  const dateFilters = [
    { id: 'TODAY', label: 'Today', icon: Clock },
    { id: 'YESTERDAY', label: 'Yesterday', icon: Calendar },
    { id: 'CUSTOM', label: 'Custom', icon: Filter },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setReportUrl(null); // Reset report if inputs change
  };

  const getMimeType = (format) => {
    switch (format) {
      case 'PDF': return 'application/pdf';
      case 'EXCEL': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'WORD': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default: return 'application/octet-stream';
    }
  };

  const handleGenerateReport = async () => {
    if (formData.dateFilter === 'CUSTOM' && (!formData.fromDate || !formData.toDate)) {
      toast.error("Please select a date range");
      return;
    }

    try {
      setLoading(true);
      setReportUrl(null);
      
      const data = {
        format: formData.format,
        dateFilter: formData.dateFilter,
        ...(formData.dateFilter === 'CUSTOM' && {
          fromDate: formData.fromDate,
          toDate: formData.toDate,
        })
      };

      const blob = await reportService.generateReport(businessId, data);
      const url = window.URL.createObjectURL(new Blob([blob], { type: getMimeType(formData.format) }));
      
      setReportUrl(url);
      setGeneratedConfig({ ...formData });
      
      toast.success("Report generated!");
      
      if (formData.format === 'PDF') {
        setShowPdfModal(true);
      }
    } catch (error) {
      console.error("Report generation error:", error);
      toast.error("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!reportUrl || !generatedConfig) return;
    
    const link = document.createElement('a');
    link.href = reportUrl;
    const timestamp = new Date().toISOString().split('T')[0];
    const extension = generatedConfig.format === 'EXCEL' ? 'xlsx' : generatedConfig.format.toLowerCase();
    link.setAttribute('download', `BillReport_${timestamp}.${extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 bg-[#FDFBF7] min-h-screen font-sans pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gold/10 pb-3 sm:pb-4 px-1">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-black-deep tracking-tight">Reports</h1>
          <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bill & Business Analytics</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-5 sm:space-y-6">
            {/* Format Selection */}
            <div>
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 sm:mb-3 block px-1">1. Export Format</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {formats.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { setFormData(prev => ({ ...prev, format: f.id })); setReportUrl(null); }}
                    className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border transition-all
                      ${formData.format === f.id 
                        ? 'border-black-deep bg-black-deep text-white shadow-md' 
                        : 'border-slate-100 hover:border-slate-300 bg-slate-50 text-slate-600'
                      }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${formData.format === f.id ? 'bg-white/10' : f.bg} ${formData.format === f.id ? 'text-white' : f.color}`}>
                      <f.icon size={16} />
                    </div>
                    <span className="font-bold text-xs">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter Selection */}
            <div>
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 sm:mb-3 block px-1">2. Date Range</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {dateFilters.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => { setFormData(prev => ({ ...prev, dateFilter: d.id })); setReportUrl(null); }}
                    className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border transition-all
                      ${formData.dateFilter === d.id 
                        ? 'border-black-deep bg-black-deep text-white shadow-md' 
                        : 'border-slate-100 hover:border-slate-300 bg-slate-50 text-slate-600'
                      }`}
                  >
                    <d.icon size={16} className={`shrink-0 ${formData.dateFilter === d.id ? 'text-gold' : 'text-slate-400'}`} />
                    <span className="font-bold text-xs uppercase tracking-tight">{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Dates */}
            {formData.dateFilter === 'CUSTOM' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1">
                  <label className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-1">From</label>
                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-black-deep focus:ring-2 focus:ring-gold/20 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-1">To</label>
                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-black-deep focus:ring-2 focus:ring-gold/20 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Generate Button */}
            <div className="pt-1">
              <button
                onClick={handleGenerateReport}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-black-deep text-gold rounded-xl font-bold text-sm transition-all shadow-lg active:scale-[0.98]
                  ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black hover:shadow-xl'}
                `}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                ) : (
                  <Download size={18} />
                )}
                <span>{loading ? 'Generating...' : 'Generate Report'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Result/Preview */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 h-full flex flex-col justify-between min-h-[220px] sm:min-h-[300px]">
            <div>
              <h3 className="text-[9px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-3 sm:mb-4 px-1">Report Status</h3>
              
              {!reportUrl ? (
                <div className="flex flex-col items-center justify-center py-6 sm:py-10 text-center space-y-2 sm:space-y-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                    <FileText size={20} />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[140px] sm:max-w-[150px]">Configure and generate to see results</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="p-3 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest leading-none mb-1">Success</p>
                      <p className="text-xs font-bold text-emerald-600 leading-none">Report is ready</p>
                    </div>
                  </div>

                  <div className="space-y-2 px-1">
                    <div className="flex justify-between text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Format:</span>
                      <span className="text-black-deep">{generatedConfig?.format}</span>
                    </div>
                    <div className="flex justify-between text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Range:</span>
                      <span className="text-black-deep truncate ml-4">{generatedConfig?.dateFilter}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {reportUrl && (
              <div className="space-y-2.5 pt-4 sm:pt-6 border-t border-slate-100 mt-4 sm:mt-0">
                {generatedConfig?.format === 'PDF' ? (
                  <button
                    onClick={() => setShowPdfModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 border-2 border-black-deep text-black-deep rounded-xl font-bold text-xs hover:bg-slate-50 transition-all"
                  >
                    <FileText size={16} />
                    View PDF
                  </button>
                ) : null}
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all shadow-md"
                >
                  <Download size={16} />
                  Download {generatedConfig?.format}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF PREVIEW MODAL */}
      {showPdfModal && reportUrl && (
        <div 
          className="fixed inset-0 bg-black-deep/60 backdrop-blur-sm z-[1100] flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setShowPdfModal(false)}
        >
          <div 
            className="bg-white rounded-2xl sm:rounded-[24px] w-full max-w-5xl h-[85vh] sm:h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <FileText size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Preview</p>
                  <p className="text-[10px] sm:text-xs font-bold text-black-deep leading-none truncate">Bill Report - {generatedConfig?.dateFilter}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={handleDownload}
                  className="p-1.5 sm:p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-black-deep hover:border-slate-300 transition-all"
                  title="Download PDF"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="p-1.5 sm:p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-red-500 hover:border-red-200 transition-all"
                  title="Close Preview"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            </div>

            {/* PDF Content */}
            <div className="flex-1 bg-slate-200 relative">
              <iframe 
                src={reportUrl} 
                className="w-full h-full border-none"
                title="PDF Report Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillReports;
