import React from 'react';
import { X, Printer } from 'lucide-react';
import { Order, formatPriceINR } from '../types';

interface PackingSlipModalProps {
  order: Order | null;
  onClose: () => void;
}

export const PackingSlipModal: React.FC<PackingSlipModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-300 text-gray-800 my-auto print:m-0 print:p-0 print:border-none print:shadow-none">
        {/* Modal Controls (hidden when printing) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 print:hidden">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Official Sole Proprietorship Packing Slip & Tax Invoice (₹ INR)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-3.5 bg-[#2d4d2b] text-white rounded-lg text-xs font-bold hover:bg-[#20371e] flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Packing Slip */}
        <div className="space-y-6 text-xs text-gray-800 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#2d4d2b] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-[#faf7ef] rounded-full p-1 border border-[#354f35] flex items-center justify-center">
                <img src="/logo.svg" alt="Lumina Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-xl text-[#1e341f] tracking-wide">
                  LUMINA HOMEMADE SOAPS
                </h1>
                <p className="text-[10px] text-gray-600 font-medium">
                  Sole Proprietor: Thiru Kailash • Est. 2024
                </p>
                <p className="text-[10px] text-gray-500">
                  Artisan Soap Workshop, Bengaluru, Karnataka, India • mailmethirukailash@gmail.com
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-gray-100 font-mono font-bold text-xs rounded text-gray-800">
                {order.id}
              </span>
              <p className="text-[11px] text-gray-500 mt-1">
                Date: {new Date(order.date).toLocaleDateString('en-IN')}
              </p>
              <p className="text-[11px] text-gray-500">
                Status: <strong className="text-[#2d4d2b]">{order.orderStatus}</strong>
              </p>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="grid grid-cols-2 gap-6 bg-[#faf8f4] p-4 rounded-xl border border-gray-200">
            <div>
              <h4 className="font-bold text-gray-500 text-[10px] uppercase tracking-wider mb-1">
                Ship To Customer:
              </h4>
              <p className="font-bold text-gray-900 text-sm">{order.shippingAddress.fullName}</p>
              <p className="text-gray-700">{order.shippingAddress.street}</p>
              {order.shippingAddress.apartment && <p className="text-gray-700">{order.shippingAddress.apartment}</p>}
              <p className="text-gray-700">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
              </p>
              <p className="text-gray-600 mt-1">Phone: {order.shippingAddress.phone}</p>
              <p className="text-gray-600">Email: {order.customerEmail}</p>
            </div>

            <div>
              <h4 className="font-bold text-gray-500 text-[10px] uppercase tracking-wider mb-1">
                Packaging & Dispatch Info:
              </h4>
              <p className="text-gray-700">Payment: <span className="font-semibold">{order.paymentMethod}</span></p>
              <p className="text-gray-700">Payment Status: <span className="font-semibold text-emerald-800">{order.paymentStatus}</span></p>
              <p className="text-gray-700">Carrier: <span className="font-semibold">{order.carrier || 'India Post Speed Post'}</span></p>
              {order.trackingNumber && (
                <p className="text-gray-700">Tracking #: <span className="font-mono font-bold">{order.trackingNumber}</span></p>
              )}
              {order.customerNote && (
                <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 italic text-[11px]">
                  <strong>Customer Gift Request:</strong> "{order.customerNote}"
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-[10px] uppercase font-bold text-gray-500">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">Batch Number</th>
                  <th className="py-2">Weight</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="text-xs">
                    <td className="py-2.5 font-bold text-gray-800">{item.productName}</td>
                    <td className="py-2.5 font-mono text-gray-500 text-[11px]">{item.batchNumber}</td>
                    <td className="py-2.5 text-gray-500">{item.weight}</td>
                    <td className="py-2.5 text-center font-bold">{item.quantity}</td>
                    <td className="py-2.5 text-right">{formatPriceINR(item.price)}</td>
                    <td className="py-2.5 text-right font-semibold">
                      {formatPriceINR(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-300 pt-3 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>{formatPriceINR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>{order.shippingFee === 0 ? 'FREE' : formatPriceINR(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%):</span>
                <span>{formatPriceINR(order.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-gray-900 pt-1 border-t border-gray-300">
                <span>Total Amount:</span>
                <span className="text-[#1b351c]">{formatPriceINR(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Maker's Pledge */}
          <div className="border-t border-dashed border-gray-300 pt-4 text-center text-[11px] text-gray-500 italic">
            <p>
              "Every bar is saponified in small wooden molds, infused with pure Ayurvedic botanicals, and cured for 45 days. Thank you for supporting our sole proprietorship handmade soap studio!"
            </p>
            <p className="font-serif font-bold text-gray-700 mt-1 not-italic">
              — Thiru Kailash, Maker & Sole Proprietor (mailmethirukailash@gmail.com)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
