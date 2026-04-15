import React, { useState } from "react";

const BillModal = ({ isOpen, onClose, billData }) => {
    const [printFormat, setPrintFormat] = useState("a4"); // 'a4' or 'thermal'

    if (!isOpen || !billData) return null;

    const handlePrint = (format) => {
        setPrintFormat(format);
        // Short delay to ensure React state update reflects in classes before print dialog
        setTimeout(() => {
            window.print();
        }, 50);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex justify-center items-start overflow-y-auto p-4 py-8 md:p-10"
            onClick={onClose}
        >
            <style>
                {`
                /* Print Styles - Professional Invoice Printing */
                @media print {
                    /* Basic Reset */
                    * {
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
                    
                    /* Universal Printable Area Show Logic */
                    .print-a4 #printable-invoice,
                    .print-a4 #printable-invoice *,
                    .print-thermal #printable-receipt,
                    .print-thermal #printable-receipt * {
                        visibility: visible;
                        display: block;
                    }

                    /* Ensure they are hidden when not active */
                    .print-a4 #printable-receipt,
                    .print-thermal #printable-invoice {
                        display: none !important;
                    }
                    
                    /* A4 Specific Formatting */
                    .print-a4 #printable-invoice {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        margin: 0 auto !important;
                        width: 100% !important;
                        max-width: 210mm !important;
                        background: white !important;
                        box-shadow: none !important;
                        padding: 20mm !important;
                        z-index: 999999 !important;
                    }

                    /* Thermal Specific Formatting */
                    .print-thermal #printable-receipt {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 80mm !important;
                        margin: 0 auto !important;
                        background: white !important;
                        padding: 5mm !important;
                        z-index: 999999 !important;
                        font-family: 'Courier New', Courier, monospace !important;
                    }
                    
                    /* Hide print button and close button */
                    .no-print {
                        display: none !important;
                    }
                    
                    /* Page size settings */
                    @page {
                        margin: 0;
                    }

                    .print-a4 @page { size: A4; }
                    .print-thermal @page { size: 80mm auto; }
                    
                    /* Avoid page breaks in content */
                    .section-header, .section-details, .section-table, .section-summary, .section-footer {
                        page-break-inside: avoid;
                    }
                    
                    /* Better spacing for print sections (A4 Only) */
                    .print-a4 .section-header { margin-bottom: 50px !important; }
                    .print-a4 .section-details { margin-bottom: 60px !important; }
                    .print-a4 .section-table { margin-bottom: 50px !important; }
                    .print-a4 .section-summary { margin-top: 30px !important; }
                    .print-a4 .section-footer { margin-top: 80px !important; }

                    /* Thermal Layout Overrides */
                    .print-thermal .thermal-divider {
                        border-top: 1px dashed black;
                        margin: 5mm 0;
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
                className={`bg-white rounded-3xl shadow-2xl w-full max-w-[210mm] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 my-auto max-h-[90vh] relative print-${printFormat}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Tools (Float over content) - Hidden when printing */}
                <div className="absolute top-6 right-6 flex items-center gap-2 no-print z-20">
                    <button
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-amber-500 rounded-lg font-bold uppercase tracking-widest text-[9px] hover:shadow-lg active:scale-95 transition-all"
                        onClick={() => handlePrint('a4')}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print A4
                    </button>
                    <button
                        className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 text-gray-950 rounded-lg font-bold uppercase tracking-widest text-[9px] hover:shadow-lg active:scale-95 transition-all"
                        onClick={() => handlePrint('thermal')}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Print Receipt
                    </button>
                    <button
                        className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-gray-900 hover:border-gray-900 rounded-lg transition-all active:scale-90"
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
                    <div className="section-header flex justify-between items-start border-b-2 border-black pb-8 mb-10">
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
                    <div className="section-details grid grid-cols-2 gap-10 mb-12">
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
                    <div className="section-table mb-10">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-zinc-50 border-b-2 border-black">
                                    <th className="py-4 px-3 text-left text-[11px] font-black uppercase tracking-widest text-zinc-600">Transaction ID</th>
                                    <th className="py-4 px-3 text-left text-[11px] font-black uppercase tracking-widest text-zinc-600">Ref No.</th>
                                    <th className="py-4 px-3 text-left text-[11px] font-black uppercase tracking-widest text-zinc-600">Method</th>
                                    <th className="py-4 px-3 text-left text-[11px] font-black uppercase tracking-widest text-zinc-600">Date</th>
                                    <th className="py-4 px-3 text-right text-[11px] font-black uppercase tracking-widest text-zinc-600">Amount (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billData.payments.map((p, i) => (
                                    <tr key={i} className="border-b border-zinc-100">
                                        <td className="py-4 px-3 text-[12px] font-mono text-zinc-800">{p.transactionId}</td>
                                        <td className="py-4 px-3 text-[12px] font-bold text-black uppercase">{p.bookingNumber}</td>
                                        <td className="py-4 px-3 text-[12px] font-bold text-zinc-700 uppercase">{p.paymentMethod}</td>
                                        <td className="py-4 px-3 text-[12px] font-medium text-zinc-500">{new Date(p.paymentDate).toLocaleDateString('en-GB')}</td>
                                        <td className="py-4 px-3 text-right text-[14px] font-bold text-black">₹{p.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary & Notes */}
                    <div className="section-summary flex justify-between items-start">
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
                                    <span className="text-black">₹{billData.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px] font-medium text-zinc-500">
                                    <span>Discount</span>
                                    <span className="text-black">- ₹{billData.discount.toFixed(2)}</span>
                                </div>
                                <div className="border-t-2 border-black pt-4 mt-4 flex justify-between items-center">
                                    <span className="text-[12px] font-black uppercase tracking-widest text-black">Grand Total</span>
                                    <span className="text-2xl font-bold text-black">₹{billData.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Disclaimer */}
                    <div className="section-footer mt-20 pt-10 border-t border-zinc-100 text-center space-y-2">
                        <p className="text-sm font-bold text-black mb-1">Thank you for visiting {billData.business.name}!</p>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">This is a computer-generated invoice and does not require a signature.</p>
                    </div>
                </div>

                {/* Thermal Receipt Content - Hidden on screen, visible during thermal print */}
                <div 
                    id="printable-receipt"
                    className="hidden text-black text-[12px] leading-tight"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                    <div className="text-center mb-4">
                        <h2 className="text-base font-bold uppercase">{billData.business.name}</h2>
                        <p className="text-[10px]">{billData.business.address}</p>
                        <p className="text-[10px]">Tel: {billData.business.phone}</p>
                    </div>

                    <div className="thermal-divider" />

                    <div className="flex justify-between mb-1">
                        <span>Invoice:</span>
                        <span className="font-bold">{billData.billNumber.split('-').pop()}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>Date:</span>
                        <span>{new Date(billData.generatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>Customer:</span>
                        <span className="font-bold">{billData.customer.name}</span>
                    </div>

                    <div className="thermal-divider" />

                    <table className="w-full text-[11px] mb-2">
                        <thead>
                            <tr className="border-b border-black text-left">
                                <th className="pb-1">Item</th>
                                <th className="pb-1 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billData.payments.map((p, i) => (
                                <tr key={i}>
                                    <td className="py-1">Booking Ref x1</td>
                                    <td className="py-1 text-right">₹{p.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="thermal-divider" />

                    <div className="flex justify-between font-bold text-sm">
                        <span>TOTAL:</span>
                        <span>₹{billData.total.toFixed(2)}</span>
                    </div>

                    <div className="thermal-divider" />

                    <div className="text-center mt-4 italic text-[10px]">
                        <p>Thank you for visiting us!</p>
                        <p>Powered by Salon Admin Console</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillModal;