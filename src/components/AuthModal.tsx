import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Phone, KeyRound, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, setUser, showToast } = useApp();
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('801 234 5678');
  const [otp, setOtp] = useState(['1', '0', '1', '2']);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      showToast('OTP sent to +234 ' + phoneNumber);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
      setUser({
        name: 'Yu',
        phone: `+234 ${phoneNumber}`,
        isGuest: false,
      });
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setStep('phone');
        showToast('Welcome back, Yu!');
      }, 900);
    }, 800);
  };

  const handleContinueAsGuest = () => {
    setUser({
      name: 'Guest',
      phone: 'Not verified',
      isGuest: true,
    });
    setIsAuthModalOpen(false);
    showToast('Continuing as Guest');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-[380px] bg-white rounded-[99px] p-6 shadow-2xl border border-[#E8E8E8] text-center space-y-4"
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
      >
        <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-2">
          <span className="text-xs font-bold text-[#858585] uppercase tracking-wide">
            Food101 Account
          </span>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-[99px] bg-[#F6F6F6] flex items-center justify-center text-[#171717]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4 pt-1">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#171717]">Good food. No waiting around.</h2>
              <p className="text-xs text-[#626262]">Your Nigerian favourites, delivered fast.</p>
            </div>

            <div className="text-left space-y-1">
              <label className="text-xs font-bold text-[#171717]">Phone number</label>
              <div className="flex items-center bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] px-3.5 py-2.5">
                <span className="text-xs font-bold text-[#171717] mr-2 pr-2 border-r border-[#E8E8E8]">
                  🇳🇬 +234
                </span>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="801 234 5678"
                  className="w-full bg-transparent text-xs font-semibold text-[#171717] placeholder-[#858585] focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#171717] text-white rounded-[99px] text-xs font-semibold hover:bg-[#FF641B] transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Continue with phone'
              )}
            </button>

            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="w-full h-10 bg-[#F6F6F6] text-[#171717] rounded-[99px] text-xs font-semibold hover:bg-[#E8E8E8]"
            >
              Continue as guest
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#171717]">Enter 4-digit code</h2>
              <p className="text-xs text-[#858585]">Sent via SMS to +234 {phoneNumber}</p>
            </div>

            <div className="flex justify-center gap-2 py-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const next = [...otp];
                    next[idx] = e.target.value;
                    setOtp(next);
                  }}
                  className="w-12 h-12 text-center text-lg font-bold bg-[#F6F6F6] border border-[#E8E8E8] rounded-[99px] focus:outline-hidden focus:border-[#171717]"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#171717] text-white rounded-[99px] text-xs font-semibold hover:bg-[#FF641B] transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Verify & sign in'
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="text-xs text-[#858585] underline"
            >
              Change phone number
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="py-6 flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-[99px] bg-[#12E600] text-[#171717] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-base font-bold text-[#171717]">Signed In Successfully!</h3>
            <p className="text-xs text-[#858585]">Welcome back to Food101</p>
          </div>
        )}
      </div>
    </div>
  );
};
