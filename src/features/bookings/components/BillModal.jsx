import React from "react";

const BillModal = ({ isOpen, onClose, billData }) => {
    if (!isOpen || !billData) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex justify-center items-start overflow-y-auto p-4 py-8 md:p-10"
            onClick={onClose}
        >
            <style>
                {`
                /* Print Styles - Professional Invoice Printing */
                @media print {
                    /* Reset all margins and padding */
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    /* Hide everything except modal */
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                    }
                    
                    body * {
                        visibility: hidden;
                    }
                    
                    /* Show only the invoice container */
                    #printable-invoice,
                    #printable-invoice * {
                        visibility: visible;
                    }
                    
                    /* Position invoice properly on page */
                    #printable-invoice {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        margin: 0 auto !important;
                        width: 100% !important;
                        max-width: 210mm !important;
                        background: white !important;
                        box-shadow: none !important;
                        padding: 15mm !important;
                        z-index: 999999 !important;
                    }
                    
                    /* Hide print button and close button */
                    .no-print {
                        display: none !important;
                    }
                    
                    /* Ensure proper page breaks */
                    .print-container {
                        page-break-inside: avoid;
                    }
                    
                    /* Set page size and margins */
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    
                    /* Ensure table doesn't break */
                    table {
                        page-break-inside: avoid;
                    }
                    
                    /* Better spacing for print */
                    .invoice-content {
                        width: 100%;
                        margin: 0;
                        padding: 0;
                    }
                    
                    /* ===== SPACING IMPROVEMENTS ===== */
                    
                    /* Header section spacing */
                    #printable-invoice .border-b-2 {
                        margin-bottom: 20px !important;
                        padding-bottom: 20px !important;
                    }
                    
                    /* Customer & Payment Details section */
                    #printable-invoice .grid-cols-2 {
                        margin-bottom: 30px !important;
                        gap: 30px !important;
                    }
                    
                    /* Section dividers - add visual separation */
                    #printable-invoice .grid-cols-2 > div:first-child {
                        padding-right: 20px !important;
                        border-right: 1px solid #e5e5e5 !important;
                    }
                    
                    /* Section headings spacing */
                    #printable-invoice h3 {
                        margin-bottom: 12px !important;
                        padding-bottom: 6px !important;
                    }
                    
                    /* Table section spacing */
                    #printable-invoice .mb-10 {
                        margin-bottom: 30px !important;
                    }
                    
                    /* Table header spacing */
                    #printable-invoice thead tr {
                        margin-bottom: 8px !important;
                    }
                    
                    #printable-invoice th {
                        padding-top: 12px !important;
                        padding-bottom: 12px !important;
                    }
                    
                    /* Table rows spacing */
                    #printable-invoice td {
                        padding-top: 12px !important;
                        padding-bottom: 12px !important;
                    }
                    
                    /* Summary section - top margin */
                    #printable-invoice .flex.justify-between.items-start {
                        margin-top: 30px !important;
                        padding-top: 20px !important;
                        border-top: 2px solid #000 !important;
                    }
                    
                    /* Notes box spacing */
                    #printable-invoice .bg-zinc-50 {
                        padding: 15px !important;
                        margin-right: 20px !important;
                    }
                    
                    /* Total section spacing */
                    #printable-invoice .space-y-3 {
                        padding-left: 20px !important;
                    }
                    
                    #printable-invoice .border-t-2 {
                        padding-top: 15px !important;
                        margin-top: 15px !important;
                    }
                    
                    /* Footer spacing */
                    #printable-invoice .mt-20 {
                        margin-top: 40px !important;
                        padding-top: 20px !important;
                    }
                    
                    /* Individual section separators */
                    #printable-invoice > * + * {
                        margin-top: 10px;
                    }
                    
                    /* Page break control - keep sections together */
                    #printable-invoice > div {
                        page-break-inside: avoid;
                    }
                    
                    /* Keep header with customer details */
                    #printable-invoice .border-b-2:first-of-type {
                        page-break-after: avoid;
                    }
                    
                    /* Keep table rows together */
                    #printable-invoice tbody tr {
                        page-break-inside: avoid;
                    }
                    
                    /* Extra spacing between major sections */
                    #printable-invoice .border-b-2:first-of-type {
                        margin-bottom: 30px !important;
                        padding-bottom: 25px !important;
                    }
                    
                    /* Ensure proper spacing for customer section */
                    #printable-invoice .grid-cols-2 {
                        margin-bottom: 35px !important;
                        margin-top: 10px !important;
                    }
                    
                    /* Payment status badge spacing */
                    #printable-invoice .text-right .mt-1 {
                        margin-top: 12px !important;
                    }
                    
                    /* Table container spacing */
                    #printable-invoice .mb-10 {
                        margin-bottom: 35px !important;
                    }
                    
                    /* Summary section spacing */
                    #printable-invoice .flex.justify-between.items-start {
                        margin-top: 25px !important;
                    }
                    
                    /* Line item spacing in summary */
                    #printable-invoice .space-y-3 > div {
                        margin-bottom: 8px !important;
                    }
                    
                    /* Grand total styling with spacing */
                    #printable-invoice .border-t-2.border-black {
                        padding-top: 18px !important;
                        margin-top: 18px !important;
                    }
                    
                    /* Footer disclaimer spacing */
                    #printable-invoice .mt-20 {
                        margin-top: 50px !important;
                        padding-top: 25px !important;
                    }
                    
                    /* Footer text spacing */
                    #printable-invoice .text-center p:first-child {
                        margin-bottom: 8px !important;
                    }
                    
                    /* Ensure no content sticks together */
                    #printable-invoice {
                        line-height: 1.5 !important;
                    }
                    
                    /* Section gap helper */
                    .section-gap {
                        margin-bottom: 25px !important;
                    }
                }
                
                /* Screen styles remain the same */
                @media screen {
                    .modal-overlay {
                        background: rgba(0, 0, 0, 0.6);
                        backdrop-filter: blur(12px);
                    }
                }
                `}
            </style>
            
            {/* Modal Container */}
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-[210mm] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 my-auto max-h-[90vh] relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Tools (Float over content) - Hidden when printing */}
                <div className="absolute top-6 right-6 flex items-center gap-3 no-print z-20">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-amber-500 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:shadow-lg active:scale-95 transition-all"
                        onClick={() => window.print()}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Invoice
                    </button>
                    <button
                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-gray-900 hover:border-gray-900 rounded-xl transition-all active:scale-90"
                        onClick={onClose}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Invoice Content - Printable Area */}
                <div 
                    id="printable-invoice"
                    className="invoice-content bg-white text-black p-[15mm] sm:p-[20mm] overflow-y-auto"
                    style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-10">
                        <div className="space-y-1.5">
                            <h1 className="text-3xl font-black uppercase tracking-tight text-black m-0 leading-none mb-2">
                                {billData.business.name}
                            </h1>
                            <p className="text-[13px] text-zinc-600 font-medium m-0">{billData.business.address}</p>
                            <p className="text-[13px] text-zinc-600 font-medium m-0">Phone: {billData.business.phone}</p>
                            <p className="text-[13px] text-zinc-600 font-medium m-0">Email: {billData.business.email}</p>
                            {billData.business.gstNumber && (
                                <p className="text-[13px] text-zinc-700 font-bold m-0 mt-1">GSTIN: {billData.business.gstNumber}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold tracking-tight text-black m-0 mb-4">TAX INVOICE</h2>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[13px]">
                                <span className="text-zinc-500 font-bold text-left">Bill No:</span>
                                <span className="font-bold text-black">{billData.billNumber}</span>
                                
                                <span className="text-zinc-500 font-bold text-left">Date:</span>
                                <span className="font-bold text-black">{new Date(billData.generatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                
                                <span className="text-zinc-500 font-bold text-left">Ref:</span>
                                <span className="font-bold text-black uppercase">{billData.payments[0]?.bookingNumber || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer & Payment Details */}
                    <div className="grid grid-cols-2 gap-10 mb-12">
                        <div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 border-b border-zinc-100 pb-1">Customer Details</h3>
                            <p className="text-sm font-bold m-0 text-black">{billData.customer.name}</p>
                            <p className="text-sm text-zinc-600 font-medium m-0 mt-1">{billData.customer.phone}</p>
                            <p className="text-sm text-zinc-600 font-medium m-0">{billData.customer.email}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 border-b border-zinc-100 pb-1 inline-block">Payment Status</h3>
                            <p className="mt-1">
                                <span className="px-3 py-1 bg-zinc-100 border border-zinc-200 text-black rounded font-bold text-[10px] uppercase tracking-widest">
                                    FULLY SETTLED
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="mb-10">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-zinc-50 border-b-2 border-black">
                                    <th className="py-4 px-3 text-left text-[11px] font-black uppercase tracking-widest text-zinc-600">Transaction ID</th>
                                    <th className="py-4 px-3 text-left text-[11px] font-black uppercase tracking-widest text-zinc-600">Ref No.</th>
                                    <th className="py-4 px-3 text-left text-[11px] font-black uppercase tracking-widest text-zinc-600">Method</th>
                                    <th className="py-4 px-3 text-left text-[11px] font-black uppercase tracking-widest text-zinc-600">Date</th>
                                    <th className="py-4 px-3 text-right text-[11px] font-black uppercase tracking-widest text-zinc-600">Amount (AED )</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billData.payments.map((p, i) => (
                                    <tr key={i} className="border-b border-zinc-100">
                                        <td className="py-4 px-3 text-[12px] font-mono text-zinc-800">{p.transactionId}</td>
                                        <td className="py-4 px-3 text-[12px] font-bold text-black uppercase">{p.bookingNumber}</td>
                                        <td className="py-4 px-3 text-[12px] font-bold text-zinc-700 uppercase">{p.paymentMethod}</td>
                                        <td className="py-4 px-3 text-[12px] font-medium text-zinc-500">{new Date(p.paymentDate).toLocaleDateString('en-GB')}</td>
                                        <td className="py-4 px-3 text-right text-[14px] font-bold text-black">AED {p.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary & Notes */}
                    <div className="flex justify-between items-start">
                        <div className="max-w-[320px]">
                            {billData.notes && (
                                <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-lg">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Notes</h4>
                                    <p className="text-[12px] text-zinc-600 italic leading-relaxed m-0">"{billData.notes}"</p>
                                </div>
                            )}
                        </div>
                        <div className="w-[280px]">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[13px] font-medium text-zinc-500">
                                    <span>Subtotal</span>
                                    <span className="text-black">AED {billData.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px] font-medium text-zinc-500">
                                    <span>Discount</span>
                                    <span className="text-black">- AED {billData.discount.toFixed(2)}</span>
                                </div>
                                <div className="border-t-2 border-black pt-4 mt-4 flex justify-between items-center">
                                    <span className="text-[12px] font-black uppercase tracking-widest text-black">Grand Total</span>
                                    <span className="text-2xl font-bold text-black">AED {billData.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Disclaimer */}
                    <div className="mt-20 pt-10 border-t border-zinc-100 text-center space-y-2">
                        <p className="text-sm font-bold text-black mb-1">Thank you for visiting {billData.business.name}!</p>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">This is a computer-generated invoice and does not require a signature.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillModal;