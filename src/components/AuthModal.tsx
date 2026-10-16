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
  onLogin?: (account: UserAccount) => void;
  onSelectUser?: (account: UserAccount | null) => void;
  onRegister: (newAccountData: {
    name: string;
    email: string;
    phone: string;
    accountType: 'individual' | 'dealer' | 'agency';
    companyName?: string;
  }) => void;
  onLogout?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  accounts,
  onLogin,
  onSelectUser,
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

  const performLogin = (acc: UserAccount) => {
    if (onLogin) {
      onLogin(acc);
    } else if (onSelectUser) {
      onSelectUser(acc);
    }
    onClose();
  };

  const performLogout = () => {
    if (onLogout) {
      onLogout();
    } else if (onSelectUser) {
      onSelectUser(null);
    }
    onClose();
  };

  const adminAccount = accounts.find((a) => a.role === 'admin') || accounts[0];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmed = loginEmail.trim().toLowerCase();
    
    // 1. Direct match in existing accounts list
    let target = accounts.find((a) => a.email.toLowerCase() === trimmed);

    // 2. If entering admin credentials or user email, match administrator
    if (!target && (trimmed.includes('admin') || trimmed === 'jerremyd2013@gmail.com' || trimmed === 'admin@rwandacarhub.com')) {
      target = adminAccount;
    }

    if (target) {
      performLogin(target);
    } else {
      // Auto-fallback: if user simply wants to enter with any email, provide admin or approved access
      setLoginError('No existing account matched that email. Use the 1-Click Administrator button below, or enter admin@rwandacarhub.com.');
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
    performLogin(acc);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-[#0a0f1d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/30">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                {currentUser ? 'Account Profile' : activeTab === 'login' ? 'Sign In to RwandaCarHub' : 'Open a New Account'}
              </h2>
              <p className="text-xs text-slate-400">
                {currentUser 
                  ? `Signed in as ${currentUser.name}` 
                  : 'Access your listings, dashboard, and messages'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#0f172a] border border-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* IF USER IS ALREADY LOGGED IN: SHOW CURRENT STATUS & LOGOUT OPTION */}
        {currentUser ? (
          <div className="p-6 space-y-6">
            <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-[#0a0f1d] border border-blue-500/40 flex items-center justify-center text-white font-bold text-lg font-['Outfit',sans-serif]">
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{currentUser.name}</h3>
                    <p className="text-xs text-slate-400">{currentUser.email}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{currentUser.phone}</p>
                  </div>
                </div>

                {/* ROLE & STATUS BADGES */}
                <div className="flex flex-col items-end gap-1.5">
                  {currentUser.role === 'admin' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-950 text-blue-300 border border-blue-700 flex items-center gap-1.5 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      Website Admin
                    </span>
                  ) : currentUser.status === 'approved' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5 shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                      Account Approved
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1.5 shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Pending Approval
                    </span>
                  )}
                </div>
              </div>

              {/* STATUS EXPLANATION BOX */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                currentUser.role === 'admin'
                  ? 'bg-blue-950/30 border-blue-800/60 text-blue-200'
                  : currentUser.status === 'approved'
                  ? 'bg-slate-900 border-slate-800 text-slate-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                {currentUser.role === 'admin' ? (
                  <p>
                    <strong>Administrator Privileges Active:</strong> You have full control over the <strong>Dashboard</strong>, vehicle inventory status (Available / Sold / Rented / Leased), partner sliding advertisements, and user account approvals.
                  </p>
                ) : currentUser.status === 'approved' ? (
                  <p>
                    <strong>Dashboard Access Granted:</strong> Your account is verified by the administrator. You can post cars and manage your listings.
                  </p>
                ) : (
                  <p>
                    <strong>Pending Admin Approval:</strong> Your account is registered and awaiting validation by the administrator.
                  </p>
                )}
              </div>
            </div>

            {/* SWITCH PERSONA / LOGOUT BUTTONS */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Switch Account / Role:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {accounts.slice(0, 3).map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => selectPersona(acc)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                      currentUser.id === acc.id
                        ? 'bg-blue-600 text-white border-blue-400'
                        : 'bg-[#0a0f1d] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold truncate">{acc.name}</div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {acc.role === 'admin' ? 'Admin' : acc.status === 'approved' ? 'Approved' : 'Pending'}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={performLogout}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition-colors"
                >
                  Sign Out
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-md"
                >
                  Enter Dashboard
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* TABS: LOGIN vs REGISTER */}
            <div className="flex rounded-2xl bg-[#0a0f1d] p-1 border border-slate-800">
              <button
                onClick={() => { setActiveTab('login'); setLoginError(''); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'login'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setActiveTab('register'); setRegError(''); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'register'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Open Account
              </button>
            </div>

            {/* INSTANT 1-CLICK ADMIN LOGIN BANNER */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 to-[#0a0f1d] border border-blue-600/60 shadow-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1.5 font-['Outfit',sans-serif]">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Website Administrator Access
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-900 text-blue-200 border border-blue-700">
                  Full Authority
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Log in directly as the administrator to approve user accounts, update inventory statuses (Available / Sold / Rented), and manage sliding ads.
              </p>
              <button
                type="button"
                onClick={() => selectPersona(adminAccount)}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-950 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>1-Click Sign In as Website Administrator</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* OTHER QUICK DEMO PERSONAS */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => selectPersona(accounts[1] || adminAccount)}
                className="p-2.5 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-blue-300">Approved User</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-300 font-bold border border-slate-700">Member</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">Jean-Damascène (Seller)</div>
              </button>

              <button
                type="button"
                onClick={() => selectPersona(accounts[2] || adminAccount)}
                className="p-2.5 rounded-xl bg-[#0a0f1d] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-blue-300">Pending User</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-400 font-bold border border-slate-700">Pending</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">Patrick Mugisha (Dealer)</div>
              </button>
            </div>

            {/* TAB 1: SIGN IN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-blue-400" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. admin@rwandacarhub.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0f1d] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-500">Any password for demo</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0f1d] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-950/80 transition-all"
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
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-blue-400" />
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Eric Ndahiro"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0f1d] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="eric@example.rw"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0f1d] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+250 788 123 456"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0f1d] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                            ? 'bg-blue-600 border-blue-400 text-white'
                            : 'bg-[#0a0f1d] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {type === 'individual' ? 'Car Owner' : type === 'dealer' ? 'Car Dealer' : 'Rental Agency'}
                      </button>
                    ))}
                  </div>
                </div>

                {regAccountType !== 'individual' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Business / Dealership Name
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={regCompanyName}
                        onChange={(e) => setRegCompanyName(e.target.value)}
                        placeholder="e.g. Kigali Motors Ltd"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0f1d] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* APPROVAL POLICY NOTICE */}
                <div className="p-3 rounded-xl bg-[#0a0f1d] border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    To maintain trusted standards across Rwanda, every new account requires manual approval by the <strong>website administrator</strong> before the user dashboard is activated.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={regSuccessNotice}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-950/80 transition-all disabled:opacity-50"
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
