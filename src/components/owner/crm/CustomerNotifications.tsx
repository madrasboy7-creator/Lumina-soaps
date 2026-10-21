import React, { useState } from 'react';
import {
  Bell,
  Send,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { crmApi } from '../ownerApi';

export const CustomerNotifications: React.FC = () => {
  const { showNotification } = useStore();
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [audienceType, setAudienceType] = useState<'all' | 'repeat' | 'open_tickets'>('all');
  const [sending, setSending] = useState(false);

  const [notificationHistory, setNotificationHistory] = useState([
    {
      id: 'notif-1',
      title: 'Workshop Cold Process Batch Curing Completed',
      message: 'Cedar cured batch of Wild Neem & Raw Honey soaps is now available for sale.',
      sentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      recipientCount: 18,
      channel: 'In-App Notification Bar',
      status: 'delivered',
    },
    {
      id: 'notif-2',
      title: 'Festival Free Gift Wooden Dish Promotion',
      message: 'Automatic wooden soap dish added free with orders of 6 or more handcrafted bars.',
      sentAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      recipientCount: 18,
      channel: 'In-App Notification Bar',
      status: 'delivered',
    },
  ]);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      showNotification('Title and message are required', 'alert');
      return;
    }

    setSending(true);
    try {
      await crmApi.sendNotification({
        title: broadcastTitle,
        message: broadcastMessage,
        audience: audienceType,
      });

      const newHistoryItem = {
        id: `notif-${Date.now()}`,
        title: broadcastTitle,
        message: broadcastMessage,
        sentAt: new Date().toISOString(),
        recipientCount: audienceType === 'all' ? 18 : 6,
        channel: 'In-App Notification Bar',
        status: 'delivered',
      };

      setNotificationHistory([newHistoryItem, ...notificationHistory]);
      setBroadcastTitle('');
      setBroadcastMessage('');
      showNotification('Customer announcement broadcasted via In-App channels', 'success');
    } catch (err: any) {
      showNotification(err.message || 'Failed to broadcast notification', 'alert');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-blue-800 uppercase bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
              CRM • Customer Broadcasts
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Customer Notifications</h1>
          <p className="text-xs text-stone-500">
            Publish customer updates on order tracking milestones, batch releases, and service announcements.
          </p>
        </div>
      </div>

      {/* Security & Authenticity Alert */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-stone-600">
        <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-stone-800">Delivery Channel Notice</p>
          <p className="mt-0.5">
            Notifications are delivered in-app directly to customer account dashboards and storefront banner announcements.
            External SMS and WhatsApp delivery requires configuring third-party gateway API keys (e.g. Twilio / Gupshup).
          </p>
        </div>
      </div>

      {/* Broadcast Composer */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-stone-900 text-sm pb-2 border-b border-stone-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#244635]" />
          <span>Broadcast Customer Announcement</span>
        </h3>

        <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Announcement Headline *</label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Fresh Batch of Cedar Cured Castile Soaps Ready"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Target Audience</label>
              <select
                value={audienceType}
                onChange={(e) => setAudienceType(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
              >
                <option value="all">All Registered Customers</option>
                <option value="repeat">Repeat Patrons Only</option>
                <option value="open_tickets">Customers with Open Support Tickets</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Announcement Content *</label>
            <textarea
              rows={3}
              required
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Write customer update..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-[#244635]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="px-6 py-2.5 rounded-xl bg-[#244635] hover:bg-[#1a3326] text-white font-semibold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sending ? 'Broadcasting...' : 'Broadcast Notification'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-stone-900 text-sm pb-2 border-b border-stone-100">
          Broadcast Delivery History
        </h3>

        <div className="divide-y divide-stone-100 text-xs">
          {notificationHistory.map((item) => (
            <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900">{item.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800">
                    {item.status}
                  </span>
                </div>
                <p className="text-stone-600 text-[11px]">{item.message}</p>
                <div className="text-[10px] text-stone-400 font-mono">
                  Channel: {item.channel} • Delivered to {item.recipientCount} clients
                </div>
              </div>

              <span className="text-[10px] text-stone-400 font-mono shrink-0">
                {new Date(item.sentAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
