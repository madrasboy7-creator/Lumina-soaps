import React, { useState } from 'react';
import {
  ArrowLeft,
  Send,
  Lock,
  User,
  ShieldCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { SupportTicket, TicketMessage } from '../../../types';
import { crmApi } from '../ownerApi';

interface SupportConversationProps {
  ticket: SupportTicket;
  onBack: () => void;
  onTicketUpdated: () => void;
}

export const SupportConversation: React.FC<SupportConversationProps> = ({
  ticket,
  onBack,
  onTicketUpdated,
}) => {
  const { showNotification } = useStore();
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<SupportTicket['status']>(ticket.status);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSending(true);
    try {
      await crmApi.replySupportTicket(ticket.id, {
        message: replyText,
        isInternal: isInternalNote,
      });

      setReplyText('');
      showNotification(
        isInternalNote ? 'Internal note added' : 'Reply sent to customer',
        'success'
      );
      onTicketUpdated();
    } catch (err: any) {
      showNotification(err.message || 'Failed to send message', 'alert');
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (newStatus: SupportTicket['status']) => {
    try {
      await crmApi.updateSupportTicket(ticket.id, { status: newStatus });
      setTicketStatus(newStatus);
      showNotification(`Ticket status updated to ${newStatus}`, 'info');
      onTicketUpdated();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update ticket status', 'alert');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-stone-400 font-mono">#{ticket.id}</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                {ticket.category}
              </span>
            </div>
            <h1 className="text-xl font-serif font-bold text-stone-900 mt-0.5">
              {ticket.subject}
            </h1>
            <p className="text-xs text-stone-500">
              Customer: <span className="font-semibold text-stone-800">{ticket.customerName}</span> ({ticket.customerEmail})
            </p>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500">Status:</span>
          <select
            value={ticketStatus}
            onChange={(e) => handleStatusChange(e.target.value as any)}
            className="py-1.5 px-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 shadow-xs focus:ring-1 focus:ring-[#244635]"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="awaiting_customer">Awaiting Customer</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4 max-h-[60vh] overflow-y-auto">
        {ticket.messages.map((msg, idx) => {
          const isCustomer = msg.sender === 'customer';
          const isInternal = msg.isInternal;

          if (isInternal) {
            return (
              <div
                key={idx}
                className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-amber-950">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Internal Owner Note ({msg.senderName})</span>
                  </div>
                  <span className="text-[10px] text-amber-800/60 font-mono font-normal">
                    {new Date(msg.createdAt || msg.timestamp || Date.now()).toLocaleString()}
                  </span>
                </div>
                <p className="text-amber-900 leading-relaxed pt-1">{msg.message}</p>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'} text-xs`}
            >
              <div
                className={`max-w-xl p-4 rounded-2xl space-y-1 ${
                  isCustomer
                    ? 'bg-stone-100 text-stone-900 rounded-tl-xs'
                    : 'bg-[#244635] text-white rounded-tr-xs shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] font-semibold opacity-80 pb-1 border-b border-white/10">
                  <span>{msg.senderName}</span>
                  <span className="font-mono font-normal">
                    {new Date(msg.createdAt || msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Composer */}
      <form onSubmit={handleSend} className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
              <input
                type="radio"
                name="msgType"
                checked={!isInternalNote}
                onChange={() => setIsInternalNote(false)}
                className="text-[#244635] focus:ring-[#244635]"
              />
              <span className="text-stone-800">Reply to Customer</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
              <input
                type="radio"
                name="msgType"
                checked={isInternalNote}
                onChange={() => setIsInternalNote(true)}
                className="text-amber-600 focus:ring-amber-500"
              />
              <span className="text-amber-800 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Internal Owner Note (Private)</span>
              </span>
            </label>
          </div>
        </div>

        <textarea
          rows={3}
          required
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={
            isInternalNote
              ? 'Write an internal note about this support ticket (not visible to customer)...'
              : 'Type reply to the customer...'
          }
          className={`w-full p-3 border rounded-2xl text-xs focus:ring-1 focus:outline-none transition-colors ${
            isInternalNote
              ? 'bg-amber-50/40 border-amber-200 focus:ring-amber-500 text-amber-950'
              : 'bg-stone-50 border-stone-200 focus:ring-[#244635] text-stone-900'
          }`}
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-stone-400">
            {isInternalNote ? 'Saved to internal CRM records only.' : 'Sent to customer ticket portal.'}
          </span>
          <button
            type="submit"
            disabled={isSending || !replyText.trim()}
            className={`px-5 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 transition-colors ${
              isInternalNote ? 'bg-amber-700 hover:bg-amber-800' : 'bg-[#244635] hover:bg-[#1a3326]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? 'Sending...' : isInternalNote ? 'Save Private Note' : 'Send Customer Reply'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
