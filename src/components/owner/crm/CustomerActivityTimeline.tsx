import React from 'react';
import { ShoppingBag, MessageSquare, Star, Clock, FileText } from 'lucide-react';
import { formatPriceINR } from '../../../types';

export interface CustomerActivityEvent {
  id: string;
  type: 'order' | 'support' | 'review' | 'note';
  title: string;
  description?: string;
  timestamp: string;
  meta?: string;
}

interface CustomerActivityTimelineProps {
  events: CustomerActivityEvent[];
}

export const CustomerActivityTimeline: React.FC<CustomerActivityTimelineProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return <div className="py-8 text-center text-xs text-stone-400">No recorded activities for this customer yet.</div>;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />;
      case 'support':
        return <MessageSquare className="w-3.5 h-3.5 text-blue-700" />;
      case 'review':
        return <Star className="w-3.5 h-3.5 text-amber-600" />;
      case 'note':
        return <FileText className="w-3.5 h-3.5 text-purple-700" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-stone-500" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-emerald-50 border-emerald-200';
      case 'support':
        return 'bg-blue-50 border-blue-200';
      case 'review':
        return 'bg-amber-50 border-amber-200';
      case 'note':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-stone-50 border-stone-200';
    }
  };

  return (
    <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
      {events.map((evt) => (
        <div key={evt.id} className="relative flex items-start gap-3">
          <div
            className={`absolute -left-6 top-1 w-5 h-5 rounded-full border flex items-center justify-center bg-white shadow-xs ${getBadgeColor(
              evt.type
            )}`}
          >
            {getIcon(evt.type)}
          </div>

          <div className="flex-1 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/60 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-900">{evt.title}</span>
              <span className="text-[10px] text-stone-400 font-mono">
                {new Date(evt.timestamp).toLocaleString()}
              </span>
            </div>
            {evt.description && <p className="text-stone-600 mt-1">{evt.description}</p>}
            {evt.meta && (
              <div className="text-[11px] font-bold text-[#244635] mt-1">{evt.meta}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
