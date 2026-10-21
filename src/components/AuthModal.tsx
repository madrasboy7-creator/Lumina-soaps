import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User, Phone, MapPin, ShieldCheck, ShoppingBag, Sparkles, KeyRound } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    authModalRole,
    setAuthModalRole,
    loginCustomer,
    registerCustomer,
    loginOwner,
    showNotification,
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Karnataka');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (authModalRole === 'owner') {
        await loginOwner(email.trim(), password);
      } else {
        if (authModalMode === 'register') {
          await registerCustomer({
            name: name.trim() || email.split('@')[0],
            email: email.trim(),
            phone: phone.trim() || '+91 98765 12345',
            password: password.trim(),
            address: {
              fullName: name.trim() || email.split('@')[0],
              street: street.trim() || 'Flat 402, Green Glen Layout',
              city: city.trim() || 'Bengaluru',
              state: state.trim() || 'Karnataka',
              zipCode: zipCode.trim() || '560103',
              phone: phone.trim() || '+91 98765 12345',
            },
          });
        } else {
          await loginCustomer(email.trim(), password);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoCustomer = () => {
    setAuthModalRole('customer');
    setAuthModalMode('register');
    setName('Priya Sharma');
    setEmail('priya.sharma@example.com');
    setPassword('customer123');
    setPhone('+91 98451 88290');
    setStreet('14th Cross, Indiranagar');
    setCity('Bengaluru');
    setState('Karnataka');
    setZipCode('560038');
    setErrorMsg(null);
  };

  const handleFillOwner = () => {
    setAuthModalRole('owner');
    setEmail('mailmethirukailash@gmail.com');
    setPassword('OwnerPassword@2026');
    setErrorMsg(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e5ded0] overflow-hidden my-auto"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setIsAuthModalOpen(false);
              setErrorMsg(null);
            }}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Primary Portal Selector: Customer vs Owner */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={() => {
                setAuthModalRole('customer');
                setErrorMsg(null);
              }}
              className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                authModalRole === 'customer'
                  ? 'border-[#2d4d2b] bg-white text-[#203a1f]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span>Customer Account</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalRole('owner');
                setErrorMsg(null);
              }}
              className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                authModalRole === 'owner'
                  ? 'border-amber-600 bg-amber-50/50 text-amber-900'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Owner & Artisan Portal</span>
            </button>
          </div>

          {/* Header Banner */}
          <div
            className={`p-6 text-center text-white transition-colors ${
              authModalRole === 'owner'
                ? 'bg-[#292218] border-b border-amber-900/40'
                : 'bg-[#1c301d] border-b border-[#2d4d2e]'
            }`}
          >
            <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-full p-1 shadow-md flex items-center justify-center">
              <img
                src="/logo.svg"
                alt="Lumina Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {authModalRole === 'owner' ? (
              <>
                <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-amber-500/40 mb-1.5">
                  <KeyRound className="w-3 h-3 text-amber-300" />
                  <span>Sole Proprietor Restricted Access</span>
                </div>
                <h3 className="font-serif font-bold text-lg tracking-wide">
                  Owner Admin Portal
                </h3>
                <p className="text-xs text-amber-200/80 mt-1 max-w-xs mx-auto">
                  Sign in as the sole proprietor to manage customer orders, inventory, pricing in ₹, and curing racks.
                </p>
              </>
            ) : (
              <>
                <h3 className="font-serif font-bold text-lg tracking-wide">
                  {authModalMode === 'register' ? 'Create Customer Account' : 'Customer Sign In'}
                </h3>
                <p className="text-xs text-[#9ebf9a] mt-1 max-w-xs mx-auto">
                  {authModalMode === 'register'
                    ? 'Customer account required to verify your delivery address and fulfill artisan orders.'
                    : 'Sign in with your customer account to place orders and track delivery.'}
                </p>

                {/* Sub-mode Switcher for Customer */}
                <div className="mt-3.5 inline-flex bg-[#2a452c] p-1 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('login');
                      setErrorMsg(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-md transition-all ${
                      authModalMode === 'login'
                        ? 'bg-amber-400 text-[#172b18] shadow font-bold'
                        : 'text-[#cfe0cd] hover:text-white'
                    }`}
                  >
                    Customer Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('register');
                      setErrorMsg(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-md transition-all ${
                      authModalMode === 'register'
                        ? 'bg-amber-400 text-[#172b18] shadow font-bold'
                        : 'text-[#cfe0cd] hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Quick Pre-fill / Testing Bar */}
          <div className="bg-[#faf8f2] px-5 py-2 border-b border-[#eee7d8] flex items-center justify-between text-[11px] text-gray-500">
            <span className="font-medium">Quick switch for review:</span>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleFillDemoCustomer}
                className="text-[#2b4c29] font-bold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Fill Customer</span>
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleFillOwner}
                className="text-amber-800 font-bold hover:underline flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3 text-amber-600" />
                <span>Fill Owner</span>
              </button>
            </div>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs text-gray-700 max-h-[60vh] overflow-y-auto">
            {authModalRole === 'owner' ? (
              /* OWNER LOGIN FORM */
              <>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                  Registered Sole Proprietorship Account:
                  <strong className="block text-xs mt-0.5 text-amber-950 font-mono">
                    mailmethirukailash@gmail.com
                  </strong>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Sole Proprietor Email</label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mailmethirukailash@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-amber-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Owner Access Password</label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-amber-600 focus:outline-none"
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
                    <span>Password: <strong className="font-mono text-amber-900">OwnerPassword@2026</strong></span>
                    <button
                      type="button"
                      onClick={() => setPassword('OwnerPassword@2026')}
                      className="text-amber-800 font-bold hover:underline cursor-pointer"
                    >
                      Use Default
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#8b5a2b] hover:bg-[#6e4620] text-white rounded-xl font-bold transition-colors shadow flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-200" />
                  <span>{loading ? 'Verifying Credentials...' : 'Sign In to Owner Admin Panel'}</span>
                </button>
              </>
            ) : (
              /* CUSTOMER LOGIN / REGISTER FORM */
              <>
                {authModalMode === 'register' && (
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Your Full Name</label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Priya Sharma"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#2d4d2b] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#2d4d2b] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Password</label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#2d4d2b] focus:outline-none"
                    />
                  </div>
                </div>

                {authModalMode === 'register' && (
                  <>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Mobile Phone (+91)</label>
                      <div className="relative flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98451 88290"
                          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#2d4d2b] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <span className="font-bold text-[#1f371e] block mb-2 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        Shipping Address (India)
                      </span>
                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="House / Flat No., Street, Landmark"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#2d4d2b] focus:outline-none"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#2d4d2b] focus:outline-none"
                          />
                          <input
                            type="text"
                            required
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="State"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#2d4d2b] focus:outline-none"
                          />
                          <input
                            type="text"
                            required
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            placeholder="PIN Code"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#2d4d2b] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#284826] hover:bg-[#1c351b] text-white rounded-xl font-bold transition-colors shadow flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-300" />
                  <span>
                    {loading
                      ? 'Processing...'
                      : authModalMode === 'register'
                      ? 'Create Customer Account & Continue'
                      : 'Sign In as Customer'}
                  </span>
                </button>
              </>
            )}
          </form>

          {/* Footer note */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-center text-[11px] text-gray-500">
            {authModalRole === 'customer' ? (
              <span>
                Need Sole Proprietor administrative access?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalRole('owner');
                    setErrorMsg(null);
                  }}
                  className="text-amber-800 font-bold hover:underline"
                >
                  Switch to Owner Portal
                </button>
              </span>
            ) : (
              <span>
                Are you a Lumina customer?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalRole('customer');
                    setErrorMsg(null);
                  }}
                  className="text-[#2b4c29] font-bold hover:underline"
                >
                  Switch to Customer Sign In
                </button>
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
