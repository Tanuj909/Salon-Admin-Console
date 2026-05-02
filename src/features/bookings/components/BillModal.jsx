import React, { useState } from "react";

const BillModal = ({ isOpen, onClose, billData }) => {
    const [showReceipt, setShowReceipt] = useState(false);

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
                    
                    /* Position invoice properly on page - Half Page Focus */
                    #printable-invoice {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        margin: 0 auto !important;
                        width: 100% !important;
                        max-width: 210mm !important;
                        max-height: 148.5mm !important; /* Half of A4 Height (297mm / 2) */
                        overflow: hidden !important;
                        background: white !important;
                        box-shadow: none !important;
                        padding: 10mm !important;
                        z-index: 999999 !important;
                        display: block !important;
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
                    
                    /* Better spacing for print - Compact Layout */
                    .invoice-content {
                        width: 100%;
                        margin: 0;
                        padding: 0;
                    }
                    
                    /* ===== COMPRESSED SPACING FOR HALF PAGE ===== */
                    
                    /* Header section spacing */
                    #printable-invoice .border-b-2 {
                        margin-bottom: 12px !important;
                        padding-bottom: 12px !important;
                    }
                    
                    /* Customer & Payment Details section */
                    #printable-invoice .grid-cols-2 {
                        margin-bottom: 15px !important;
                        gap: 15px !important;
                    }
                    
                    /* Section dividers */
                    #printable-invoice .grid-cols-2 > div:first-child {
                        padding-right: 15px !important;
                        border-right: 1px solid #e5e5e5 !important;
                    }
                    
                    /* Table section spacing */
                    #printable-invoice .mb-10 {
                        margin-bottom: 15px !important;
                    }
                    
                    /* Table rows spacing - tighter for half page */
                    #printable-invoice th, #printable-invoice td {
                        padding-top: 6px !important;
                        padding-bottom: 6px !important;
                    }
                    
                    /* Summary section - top margin */
                    #printable-invoice .flex.justify-between.items-start {
                        margin-top: 15px !important;
                        padding-top: 10px !important;
                        border-top: 2px solid #000 !important;
                    }
                    
                    /* Total section spacing */
                    #printable-invoice .space-y-3 {
                        padding-left: 15px !important;
                    }
                    
                    #printable-invoice .border-t-2 {
                        padding-top: 8px !important;
                        margin-top: 8px !important;
                    }
                    
                    /* Footer spacing - brought up to stay in half page */
                    #printable-invoice .mt-20 {
                        margin-top: 20px !important;
                        padding-top: 12px !important;
                    }
                    
                    #printable-invoice .text-center p {
                        margin-bottom: 4px !important;
                    }

                    /* Individual section separators */
                    #printable-invoice > * + * {
                        margin-top: 5px;
                    }
                }
                
                /* Screen styles remain the same */
                @media screen {
                    .modal-overlay {
                        background: rgba(0, 0, 0, 0.6);
                        backdrop-filter: blur(12px);
                    }
                    .receipt-zigzag {
                        background: linear-gradient(-45deg, transparent 16px, #ffffff 0), linear-gradient(45deg, transparent 16px, #ffffff 0);
                        background-repeat: repeat-x;
                        background-position: left bottom;
                        background-size: 22px 32px;
                        content: "";
                        display: block;
                        width: 100%;
                        height: 32px;
                    }
                }
                `}
            </style>
            
            {/* Modal Container */}
            <div
                className="bg-transparent sm:bg-white rounded-3xl sm:shadow-2xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 my-auto max-h-[90vh] relative"
                style={{ maxWidth: showReceipt ? '448px' : '210mm' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Tools (Float over content) - Hidden when printing */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 sm:gap-3 no-print z-20">
                    <button
                        className="hidden sm:flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-sm hover:shadow-md transition-all active:scale-95"
                        onClick={() => setShowReceipt(!showReceipt)}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {showReceipt ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            )}
                        </svg>
                        {showReceipt ? "Show Invoice" : "Show Receipt"}
                    </button>
                    <button
                        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gray-900 text-amber-500 rounded-xl font-bold uppercase tracking-widest text-[10px] sm:text-[10px] shadow-lg hover:shadow-xl active:scale-95 transition-all"
                        onClick={() => window.print()}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span className="hidden sm:inline">Print Invoice</span>
                        <span className="sm:hidden">Print</span>
                    </button>
                    <button
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-gray-900 hover:border-gray-900 rounded-xl shadow-lg transition-all active:scale-90"
                        onClick={onClose}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* RECEIPT VIEW (Screen Only) */}
                <div className={`print:hidden w-full h-full overflow-y-auto p-2 sm:p-8 pt-16 sm:pt-24 pb-10 bg-black/10 sm:bg-transparent custom-scrollbar rounded-3xl ${showReceipt ? 'block' : 'block sm:hidden'}`}>
                    <div className="bg-white mx-auto w-full max-w-[360px] rounded-t-xl rounded-b-sm shadow-xl relative overflow-hidden">
                        {/* Zigzag Top */}
                        <div className="h-3 w-full bg-zinc-100 mb-4" style={{
                            backgroundImage: 'radial-gradient(circle at 10px -5px, transparent 12px, white 13px)',
                            backgroundSize: '20px 20px',
                            backgroundRepeat: 'repeat-x'
                        }}></div>

                        <div className="px-6 pb-6 pt-2">
                            {/* Receipt Header */}
                            <div className="text-center mb-6">
                                <h2 className="text-lg font-black uppercase tracking-widest text-black mb-1">{billData.business.name}</h2>
                                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed max-w-[250px] mx-auto">{billData.business.address}</p>
                                <p className="text-[11px] text-zinc-500 font-medium mt-1">Ph: {billData.business.phone}</p>
                                <p className="text-[11px] text-zinc-500 font-medium truncate max-w-[250px] mx-auto">{billData.business.email}</p>
                                {billData.business.gstNumber && <p className="text-[11px] text-zinc-500 font-medium mt-0.5">GSTIN: {billData.business.gstNumber}</p>}
                            </div>

                            <div className="border-t-[1.5px] border-dashed border-zinc-200 my-4"></div>

                            {/* Receipt Meta */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-[11px] font-mono text-zinc-600">
                                    <span>Date: {new Date(billData.generatedAt).toLocaleDateString('en-GB')}</span>
                                    <span>Time: {new Date(billData.generatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex flex-col gap-0.5 text-[11px] font-mono text-zinc-600 mt-1">
                                    <span>Bill No: <span className="font-bold text-black">{billData.billNumber}</span></span>
                                    <span>Ref: <span className="font-bold text-black">{billData.payments[0]?.bookingNumber || 'N/A'}</span></span>
                                </div>
                                <div className="flex justify-between items-start text-[11px] font-mono text-zinc-600 mt-2">
                                    <div className="flex flex-col">
                                        <span>Customer: <span className="font-bold text-black">{billData.customer.name}</span></span>
                                        <span className="text-[9px]">{billData.customer.phone}</span>
                                        <span className="text-[9px] truncate max-w-[150px]">{billData.customer.email}</span>
                                    </div>
                                    <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border border-green-200 mt-1">PAID</span>
                                </div>
                            </div>

                            <div className="border-t-[1.5px] border-dashed border-zinc-200 my-4"></div>

                            {/* Items */}
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between items-center text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">
                                    <span>Description</span>
                                    <span>Amount</span>
                                </div>
                                {billData.payments.map((p, i) => (
                                    <div key={i} className="flex justify-between items-start text-sm">
                                        <div className="flex flex-col max-w-[75%]">
                                            <span className="text-black font-bold text-[13px]">{p.paymentMethod} Payment</span>
                                            <span className="text-[10px] text-zinc-400 font-mono mt-0.5">Txn: {p.transactionId}</span>
                                            {p.notes && <span className="text-[9px] text-zinc-400 italic mt-0.5">{p.notes}</span>}
                                        </div>
                                        <span className="text-black font-bold text-[13px]">AED {p.amount.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t-[1.5px] border-dashed border-zinc-200 my-4"></div>

                            {/* Totals */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center text-xs text-zinc-500">
                                    <span>Subtotal</span>
                                    <span className="font-mono">AED {billData.subtotal.toFixed(2)}</span>
                                </div>
                                {billData.discount > 0 && (
                                    <div className="flex justify-between items-center text-xs text-zinc-500">
                                        <span>Discount</span>
                                        <span className="font-mono text-red-500">- AED {billData.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center font-black text-lg text-black pt-3 border-t-[1.5px] border-black mt-2">
                                    <span>TOTAL</span>
                                    <span>AED {billData.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Notes */}
                            {billData.notes && (
                                <div className="mb-6 p-3 bg-zinc-50 rounded-lg border border-zinc-100 text-center">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Notes</p>
                                    <p className="text-xs text-zinc-600 italic">"{billData.notes}"</p>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="text-center pt-2">
                                {/* <p className="text-sm font-black text-black tracking-widest uppercase mb-1">Thank You</p> */}
                                <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold">Please visit again</p>
                            </div>
                        </div>

                        {/* Zigzag Bottom */}
                        <div className="h-4 w-full bg-transparent" style={{
                            backgroundImage: 'radial-gradient(circle at 10px 15px, transparent 12px, white 13px)',
                            backgroundSize: '20px 20px',
                            backgroundRepeat: 'repeat-x',
                            marginTop: '-2px'
                        }}></div>
                    </div>
                </div>

            {/* ORIGINAL INVOICE - HIDDEN ON SCREEN, VISIBLE ON PRINT */}
            <div 
                id="printable-invoice"
                className={`print:!block invoice-content bg-white text-black p-[15mm] sm:p-[20mm] overflow-y-auto ${showReceipt ? 'hidden' : 'hidden sm:block'}`}
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
                        <div className="flex flex-col items-end gap-1 text-[13px]">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                                <span className="text-zinc-500 font-bold">Bill No:</span>
                                <span className="font-bold text-black">{billData.billNumber}</span>
                            </div>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                                <span className="text-zinc-500 font-bold">Date:</span>
                                <span className="font-bold text-black">{new Date(billData.generatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-1 whitespace-nowrap">
                                <span className="text-zinc-500 font-bold">Ref:</span>
                                <span className="font-bold text-black uppercase">{billData.payments[0]?.bookingNumber || 'N/A'}</span>
                            </div>
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
