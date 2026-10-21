import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShippingAddress, SupportTicket } from '../types';
import {
  User,
  MapPin,
  Package,
  Headphones,
  Bell,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Send,
  MessageSquare,
  Clock,
  ChevronRight,
  ShieldCheck,
  Tag,
  Copy,
  Check,
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const {
    currentUser,
    openCustomerLogin,
    logoutUser,
    updateUserProfile,
    saveCustomerAddress,
    setCurrentView,
    orders,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    supportTickets,
    createSupportTicket,
    replyToTicket,
    coupons,
    showNotification,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'addresses' | 'tickets' | 'notifications' | 'offers'
  >('profile');

  // Edit Profile form state
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Address form modal/inline
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<ShippingAddress>({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  // Ticket creation modal/state
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('Order Inquiry');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketOrderId, setTicketOrderId] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <User className="w-8 h-8 text-amber-700" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#1c2e1d] mb-2">
          Customer Account Required
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-6">
          Sign in to your customer profile to manage saved delivery addresses, track orders, view artisan support conversations, and review past purchases.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => openCustomerLogin('login')}
            className="px-6 py-3 bg-[#8b5a2b] hover:bg-[#6f451f] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Sign In to Account
          </button>
          <button
            onClick={() => openCustomerLogin('register')}
            className="px-6 py-3 bg-[#f0ede1] hover:bg-[#e4decb] text-[#1c2e1d] font-bold text-xs rounded-xl border border-[#d6ceba] transition-colors"
          >
            Create New Account
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateUserProfile({
        name: profileName,
        phone: profilePhone,
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city || !newAddr.pincode) {
      showNotification('Please fill in street, city and pincode', 'alert');
      return;
    }

    await saveCustomerAddress(newAddr);
    setIsAddingAddress(false);
    setNewAddr({
      fullName: currentUser.name,
      phone: currentUser.phone || '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
    showNotification('Saved new delivery address', 'success');
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    await createSupportTicket({
      subject: ticketSubject,
      category: ticketCategory,
      orderId: ticketOrderId || undefined,
      orderNumber: ticketOrderId
        ? orders.find((o) => o.id === ticketOrderId)?.orderNumber
        : undefined,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          senderName: currentUser.name,
          message: ticketMessage,
          createdAt: new Date().toISOString(),
        },
      ],
    });

    setIsCreatingTicket(false);
    setTicketSubject('');
    setTicketMessage('');
    setTicketOrderId('');
  };

  const handleSendTicketReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !ticketReplyText.trim()) return;
    await replyToTicket(selectedTicketId, ticketReplyText.trim());
    setTicketReplyText('');
  };

  const activeTicket = supportTickets.find((t) => t.id === selectedTicketId);

  const copyCouponToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    showNotification(`Copied coupon ${code} to clipboard!`, 'info');
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Top Banner / Account Header */}
      <div className="bg-white border border-[#e5dfd3] rounded-2xl p-6 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1c2e1d] text-amber-300 font-serif text-2xl font-bold flex items-center justify-center border-2 border-amber-400/50">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold text-[#1c2e1d]">{currentUser.name}</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Verified Customer
              </span>
            </div>
            <p className="text-xs text-gray-500">{currentUser.email} • {currentUser.phone || 'No phone added'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('orders')}
            className="px-4 py-2 bg-[#f4f1e6] hover:bg-[#e7e2d2] text-[#1c2e1d] text-xs font-bold rounded-xl border border-[#d8d1be] transition-colors flex items-center gap-1.5"
          >
            <Package className="w-4 h-4 text-[#8b5a2b]" />
            <span>My Orders ({orders.length})</span>
          </button>
          <button
            onClick={logoutUser}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Nav Menu */}
        <div className="space-y-1">
          <button
            onClick={() => {
              setActiveTab('profile');
              setSelectedTicketId(null);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === 'profile'
                ? 'bg-[#1c2e1d] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <User className="w-4 h-4" />
              <span>Personal Profile</span>
            </span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          <button
            onClick={() => {
              setActiveTab('addresses');
              setSelectedTicketId(null);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === 'addresses'
                ? 'bg-[#1c2e1d] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          <button
            onClick={() => {
              setActiveTab('tickets');
              setSelectedTicketId(null);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === 'tickets'
                ? 'bg-[#1c2e1d] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Headphones className="w-4 h-4" />
              <span>Artisan Support Tickets</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {supportTickets.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('notifications');
              setSelectedTicketId(null);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === 'notifications'
                ? 'bg-[#1c2e1d] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </span>
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-600 text-white font-bold">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('offers');
              setSelectedTicketId(null);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === 'offers'
                ? 'bg-[#1c2e1d] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Tag className="w-4 h-4" />
              <span>Coupons & Offers</span>
            </span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Right Tab Content */}
        <div className="md:col-span-3">
          {/* 1. PERSONAL PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-[#e5dfd3] rounded-2xl p-6 shadow-xs">
              <h2 className="text-base font-serif font-bold text-[#1c2e1d] mb-4">
                Personal Information
              </h2>
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-[#1c2e1d] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1c2e1d] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="w-full px-3 py-2 text-xs border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
                  />
                  <span className="text-[11px] text-gray-400">Account login email cannot be changed.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1c2e1d] mb-1">
                    Phone Number (for SMS & Delivery Dispatch)
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-5 py-2.5 bg-[#8b5a2b] hover:bg-[#6f451f] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white border border-[#e5dfd3] rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#1c2e1d]">Delivery Addresses</h2>
                  <p className="text-xs text-gray-500">Manage where your artisan soap orders will be delivered.</p>
                </div>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="px-4 py-2 bg-[#1c2e1d] hover:bg-[#28432a] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form
                  onSubmit={handleSaveNewAddress}
                  className="bg-[#faf8f2] border border-[#ded8c8] rounded-xl p-5 space-y-3"
                >
                  <h3 className="text-xs font-bold text-[#1c2e1d] uppercase tracking-wider">
                    New Pan-India Delivery Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddr.fullName}
                        onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Flat / House No. / Building
                      </label>
                      <input
                        type="text"
                        value={newAddr.apartment}
                        onChange={(e) => setNewAddr({ ...newAddr, apartment: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Street Address / Area / Landmark
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddr.street}
                        onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={newAddr.state}
                        onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={newAddr.pincode}
                        onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#8b5a2b] hover:bg-[#6f451f] text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentUser.address && (
                  <div className="border border-emerald-300 bg-emerald-50/40 rounded-xl p-4 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        Primary Default Address
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#1c2e1d]">{currentUser.address.fullName}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {currentUser.address.apartment ? `${currentUser.address.apartment}, ` : ''}
                      {currentUser.address.street}
                    </p>
                    <p className="text-xs text-gray-600">
                      {currentUser.address.city}, {currentUser.address.state} - {currentUser.address.pincode}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Phone: {currentUser.address.phone}</p>
                  </div>
                )}

                {currentUser.addresses?.map((addr) => (
                  <div key={addr.id} className="border border-gray-200 bg-white rounded-xl p-4 relative">
                    <p className="text-xs font-bold text-[#1c2e1d]">{addr.fullName}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {addr.apartment ? `${addr.apartment}, ` : ''}
                      {addr.street}
                    </p>
                    <p className="text-xs text-gray-600">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. ARTISAN SUPPORT TICKETS */}
          {activeTab === 'tickets' && (
            <div className="bg-white border border-[#e5dfd3] rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#1c2e1d]">
                    Artisan Support Tickets
                  </h2>
                  <p className="text-xs text-gray-500">
                    Direct conversation with sole proprietor Thiru Kailash regarding orders, formulation inquiries, or deliveries.
                  </p>
                </div>
                {!isCreatingTicket && !selectedTicketId && (
                  <button
                    onClick={() => setIsCreatingTicket(true)}
                    className="px-4 py-2 bg-[#8b5a2b] hover:bg-[#6f451f] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Raise New Ticket</span>
                  </button>
                )}
              </div>

              {/* Create Ticket Modal / Inline Form */}
              {isCreatingTicket && (
                <form
                  onSubmit={handleCreateTicket}
                  className="bg-[#faf8f2] border border-[#ded8c8] rounded-xl p-5 space-y-4"
                >
                  <h3 className="text-xs font-bold text-[#1c2e1d] uppercase tracking-wider">
                    Submit Request to Thiru Kailash
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg"
                    >
                      <option value="Order Inquiry">Order Inquiry & Dispatch</option>
                      <option value="Delivery Issue">Delivery / Courier Status</option>
                      <option value="Product Formulation">Soap Ingredients / Skin Suitability</option>
                      <option value="Return / Refund">Return or Replacement Request</option>
                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Related Order (Optional)
                    </label>
                    <select
                      value={ticketOrderId}
                      onChange={(e) => setTicketOrderId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg"
                    >
                      <option value="">None / General Inquiry</option>
                      {orders.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.orderNumber} (₹{o.total} - {o.orderStatus})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Question about Lavender batch cure date"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your inquiry in detail..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#8b5a2b] hover:bg-[#6f451f] text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Submit Ticket
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreatingTicket(false)}
                      className="px-4 py-2.5 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* View Active Ticket Conversation */}
              {selectedTicketId && activeTicket ? (
                <div className="border border-[#ded8c8] rounded-xl overflow-hidden bg-white">
                  <div className="bg-[#faf8f2] p-4 border-b border-[#ded8c8] flex items-center justify-between">
                    <div>
                      <button
                        onClick={() => setSelectedTicketId(null)}
                        className="text-xs text-[#8b5a2b] hover:underline font-semibold flex items-center gap-1 mb-1"
                      >
                        ← Back to Tickets List
                      </button>
                      <h3 className="text-sm font-bold text-[#1c2e1d]">{activeTicket.subject}</h3>
                      <p className="text-[11px] text-gray-500">
                        Ticket: <span className="font-mono">{activeTicket.ticketNumber}</span> • Category: {activeTicket.category}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeTicket.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : activeTicket.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {activeTicket.status}
                    </span>
                  </div>

                  {/* Messages Thread */}
                  <div className="p-4 space-y-3 max-h-80 overflow-y-auto bg-gray-50/50">
                    {activeTicket.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          msg.sender === 'customer' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-2xs ${
                            msg.sender === 'customer'
                              ? 'bg-[#1c2e1d] text-white rounded-br-none'
                              : 'bg-white text-[#1c2e1d] border border-gray-200 rounded-bl-none'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1 text-[10px] font-semibold opacity-80">
                            <span>{msg.senderName}</span>
                            <span>•</span>
                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <form onSubmit={handleSendTicketReply} className="p-3 border-t border-gray-100 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your reply to Thiru Kailash..."
                      value={ticketReplyText}
                      onChange={(e) => setTicketReplyText(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600"
                    />
                    <button
                      type="submit"
                      disabled={!ticketReplyText.trim()}
                      className="px-4 py-2 bg-[#8b5a2b] hover:bg-[#6f451f] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* Tickets List */
                <div className="space-y-3">
                  {supportTickets.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-xs">
                      No support tickets raised yet. Need help with an order or product? Raise a ticket above.
                    </div>
                  ) : (
                    supportTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className="border border-gray-200 hover:border-[#8b5a2b] bg-white rounded-xl p-4 transition-all cursor-pointer shadow-2xs flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-[#8b5a2b]">
                              {ticket.ticketNumber}
                            </span>
                            <span className="text-xs font-bold text-[#1c2e1d]">{ticket.subject}</span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {ticket.messages[ticket.messages.length - 1]?.message}
                          </p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            Last updated: {new Date(ticket.updatedAt || ticket.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              ticket.status === 'RESOLVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ticket.status === 'IN_PROGRESS'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* 4. NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white border border-[#e5dfd3] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#1c2e1d]">Order & Studio Updates</h2>
                  <p className="text-xs text-gray-500">Important alerts regarding your order dispatches and releases.</p>
                </div>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-[#8b5a2b] hover:underline font-semibold"
                >
                  Mark all as read
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">No notifications yet.</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`py-3.5 px-2 flex items-start justify-between gap-3 cursor-pointer rounded-lg transition-colors ${
                        notif.read ? 'opacity-70 hover:bg-gray-50' : 'bg-amber-50/50 hover:bg-amber-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {notif.type === 'order' ? (
                            <Package className="w-4 h-4 text-emerald-600" />
                          ) : notif.type === 'offer' ? (
                            <Tag className="w-4 h-4 text-amber-600" />
                          ) : (
                            <Bell className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1c2e1d]">{notif.title}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{notif.message}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {new Date(notif.createdAt || notif.timestamp || Date.now()).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 5. COUPONS & OFFERS */}
          {activeTab === 'offers' && (
            <div className="bg-white border border-[#e5dfd3] rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-base font-serif font-bold text-[#1c2e1d]">
                Exclusive Lumina Coupons & Promos
              </h2>
              <p className="text-xs text-gray-500">
                Apply these codes during checkout to enjoy special discounts on handcrafted botanical soaps.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {coupons
                  .filter((c) => c.isActive)
                  .map((c) => (
                    <div
                      key={c.id}
                      className="border border-dashed border-[#8b5a2b] bg-[#faf8f2] rounded-xl p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-mono font-bold text-[#8b5a2b] bg-amber-100 px-2 py-0.5 rounded">
                            {c.code}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700">
                            {c.discountType === 'percentage'
                              ? `${c.discountValue}% OFF`
                              : `₹${c.discountValue} OFF`}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700">{c.description}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Min Order: ₹{c.minOrderValue}
                          {c.maxDiscountAmount ? ` • Max Discount: ₹${c.maxDiscountAmount}` : ''}
                        </p>
                      </div>

                      <button
                        onClick={() => copyCouponToClipboard(c.code)}
                        className="mt-3 w-full py-1.5 bg-white border border-[#8b5a2b] hover:bg-[#8b5a2b] hover:text-white text-[#8b5a2b] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        {copiedCoupon === c.code ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Promo Code</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
