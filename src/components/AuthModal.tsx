import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Clock, 
  Lock, 
  Mail, 
  Phone, 
  Building2, 
  ArrowRight, 
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  accounts: UserAccount[];
  onLogin: (account: UserAccount) => void;
  onRegister: (newAccountData: {
    name: string;
    email: string;
    phone: string;
    accountType: 'individual' | 'dealer' | 'agency';
    companyName?: string;
  }) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  accounts,
  onLogin,
  onRegister,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+250 78');
  const [regAccountType, setRegAccountType] = useState<'individual' | 'dealer' | 'agency'>('individual');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regSuccessNotice, setRegSuccessNotice] = useState(false);
  const [regError, setRegError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const target = accounts.find((a) => a.email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (target) {
      onLogin(target);
      onClose();
    } else {
      setLoginError('No account found with this email. Please check your spelling or register a new account.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setRegError('Please fill in all required fields.');
      return;
    }

    const existing = accounts.find((a) => a.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (existing) {
      setRegError('An account with this email address already exists. Please login instead.');
      return;
    }

    onRegister({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      accountType: regAccountType,
      companyName: regCompanyName.trim() || undefined
    });

    setRegSuccessNotice(true);
    setTimeout(() => {
      setRegSuccessNotice(false);
      onClose();
    }, 2800);
  };

  const selectPersona = (acc: UserAccount) => {
    onLogin(acc);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800/80 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-700 to-red-950 border border-red-600/40 flex items-center justify-center text-white shadow-lg">
              <Lock className="w-5 h-5 text-red-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                {currentUser ? 'Account Profile' : activeTab === 'login' ? 'Sign In to RwandaCarHub' : 'Open a New Account'}
              </h2>
              <p className="text-xs text-neutral-400">
                {currentUser 
                  ? `Signed in as ${currentUser.name}` 
                  : 'Access your listings, dashboard, and messages'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* IF USER IS ALREADY LOGGED IN: SHOW CURRENT STATUS & LOGOUT OPTION */}
        {currentUser ? (
          <div className="p-6 space-y-6">
            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-800 to-neutral-900 border border-red-700/60 flex items-center justify-center text-white font-bold text-lg font-['Outfit',sans-serif]">
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{currentUser.name}</h3>
                    <p className="text-xs text-neutral-400">{currentUser.email}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{currentUser.phone}</p>
                  </div>
                </div>

                {/* ROLE & STATUS BADGES */}
                <div className="flex flex-col items-end gap-1.5">
                  {currentUser.role === 'admin' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-red-950 text-red-300 border border-red-700 flex items-center gap-1.5 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                      Website Admin
                    </span>
                  ) : currentUser.status === 'approved' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1.5 shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      Account Approved
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-1.5 shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      Pending Approval
                    </span>
                  )}
                </div>
              </div>

              {/* STATUS EXPLANATION BOX */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                currentUser.role === 'admin'
                  ? 'bg-red-950/40 border-red-800/60 text-red-200'
                  : currentUser.status === 'approved'
                  ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                  : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
              }`}>
                {currentUser.role === 'admin' ? (
                  <p>
                    <strong>Administrator Privileges:</strong> You have full access to the <strong>Dashboard</strong>, website statistics, car listings moderation, and the <strong>User Approvals Panel</strong> to approve or decline newly opened accounts.
                  </p>
                ) : currentUser.status === 'approved' ? (
                  <p>
                    <strong>Dashboard Access Granted:</strong> Your account has been approved by the website administrator. The <strong>Dashboard</strong> is enabled in your main navigation bar.
                  </p>
                ) : (
                  <p>
                    <strong>Pending Admin Approval:</strong> Your account was received and is awaiting validation from the RwandaCarHub Admin. In accordance with platform security rules, the <strong>Dashboard</strong> will only appear once your account has been approved.
                  </p>
                )}
              </div>
            </div>

            {/* SWITCH PERSONA / LOGOUT BUTTONS */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Switch Demo Persona:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {accounts.slice(0, 3).map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => selectPersona(acc)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                      currentUser.id === acc.id
                        ? 'bg-red-950 border-red-600 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="font-bold truncate">{acc.name}</div>
                    <div className="text-[10px] text-neutral-400 capitalize">
                      {acc.role === 'admin' ? 'Admin' : acc.status === 'approved' ? 'Approved' : 'Pending'}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-red-400 text-xs font-bold border border-neutral-800 transition-colors"
                >
                  Sign Out
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-bold transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* TABS: LOGIN vs REGISTER */}
            <div className="flex rounded-2xl bg-neutral-900 p-1 border border-neutral-800">
              <button
                onClick={() => { setActiveTab('login'); setLoginError(''); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'login'
                    ? 'bg-red-800 text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setActiveTab('register'); setRegError(''); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'register'
                    ? 'bg-red-800 text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Open Account
              </button>
            </div>

            {/* QUICK 1-CLICK DEMO ACCOUNTS BAR */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Quick Demo 1-Click Login
                </span>
                <span className="text-[10px] text-neutral-500">Test roles instantly</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* 1. Admin */}
                <button
                  type="button"
                  onClick={() => selectPersona(accounts[0])}
                  className="p-2.5 rounded-xl bg-neutral-950 hover:bg-red-950/50 border border-red-900/40 hover:border-red-600 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-red-300">Admin</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-950 text-red-400 font-bold border border-red-800">Admin</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate mt-0.5">Dashboard + Approvals</div>
                </button>

                {/* 2. Approved User */}
                <button
                  type="button"
                  onClick={() => selectPersona(accounts[1])}
                  className="p-2.5 rounded-xl bg-neutral-950 hover:bg-emerald-950/50 border border-emerald-900/40 hover:border-emerald-600 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300">Approved User</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">Approved</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate mt-0.5">Dashboard Visible</div>
                </button>

                {/* 3. Pending User */}
                <button
                  type="button"
                  onClick={() => selectPersona(accounts[2])}
                  className="p-2.5 rounded-xl bg-neutral-950 hover:bg-amber-950/50 border border-amber-900/40 hover:border-amber-600 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-amber-300">Pending User</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-950 text-amber-400 font-bold border border-amber-800">Pending</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate mt-0.5">No Dashboard yet</div>
                </button>
              </div>
            </div>

            {/* TAB 1: SIGN IN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. admin@rwandacarhub.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-neutral-300">
                      Password
                    </label>
                    <span className="text-[11px] text-neutral-500">Any password for demo</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 hover:to-red-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-950/80 transition-all"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TAB 2: REGISTER / OPEN ACCOUNT FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {regError && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{regError}</span>
                  </div>
                )}

                {regSuccessNotice && (
                  <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Account Created Successfully!
                    </div>
                    <p className="text-[11px] text-emerald-300/90">
                      Your account has been submitted and is currently <strong>Pending Approval</strong> by the website administrator. Once approved, the Dashboard will appear in your navigation bar.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Eric Ndahiro"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="eric@example.rw"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+250 788 123 456"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Account Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['individual', 'dealer', 'agency'] as const).map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setRegAccountType(type)}
                        className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold capitalize text-center transition-all ${
                          regAccountType === type
                            ? 'bg-red-950/90 border-red-600 text-white'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {type === 'individual' ? 'Car Owner' : type === 'dealer' ? 'Car Dealer' : 'Rental Agency'}
                      </button>
                    ))}
                  </div>
                </div>

                {regAccountType !== 'individual' && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Business / Dealership Name
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={regCompanyName}
                        onChange={(e) => setRegCompanyName(e.target.value)}
                        placeholder="e.g. Kigali Motors Ltd"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>
                )}

                {/* APPROVAL POLICY NOTICE */}
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 flex items-start gap-2 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    To maintain trusted standards across Rwanda, every new account requires manual approval by the <strong>website administrator</strong> before the user dashboard is activated.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={regSuccessNotice}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 hover:to-red-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-950/80 transition-all disabled:opacity-50"
                >
                  <span>Submit Account for Approval</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
