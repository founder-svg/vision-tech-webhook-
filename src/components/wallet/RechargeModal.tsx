'use client';

import React, { useState } from 'react';
import { Wallet, X, CheckCircle, ShieldCheck, ArrowRight, ExternalLink, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRechargeSuccess: (amount: number, txId: string) => void;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  onClose,
  onRechargeSuccess,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'meta_billing'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRecharge = () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (!finalAmount || finalAmount <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const generatedTxId = `META-PAY-${Date.now()}`;
      onRechargeSuccess(finalAmount, generatedTxId);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-[#1f2c34] border border-[#2a3942] rounded-3xl max-w-md w-full p-6 text-gray-100 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-xl hover:bg-[#2a3942] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00a884] to-[#25D366] flex items-center justify-center shadow-lg shadow-[#00a884]/20">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Recharge Meta Wallet</h2>
            <p className="text-xs text-gray-400">Meta WhatsApp Business Prepaid Balance</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Recharge Successful!</h3>
            <p className="text-xs text-gray-300">
              ₹{(customAmount ? parseFloat(customAmount) : selectedAmount).toFixed(2)} added to Meta Wallet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Amount Presets */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-2">
                Select Recharge Amount (INR)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[500, 1000, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2.5 rounded-xl font-bold text-xs transition-all border ${
                      selectedAmount === amt && !customAmount
                        ? 'bg-[#00a884] text-white border-[#00a884] shadow-md shadow-[#00a884]/30'
                        : 'bg-[#111b21] text-gray-300 border-[#2a3942] hover:bg-[#2a3942]'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                Or Enter Custom Amount
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  placeholder="e.g. 3500"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-[#111b21] text-white font-bold text-sm rounded-xl pl-8 pr-4 py-2.5 border border-[#2a3942] focus:border-[#00a884] focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Gateway Options */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-2">
                Payment Gateway Integration
              </label>
              <div className="space-y-2">
                <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-[#00a884]/10 border-[#00a884]'
                    : 'bg-[#111b21] border-[#2a3942]'
                }`}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="accent-[#00a884]"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">UPI Payment (GPay, PhonePe, Paytm)</span>
                      <span className="text-[10px] text-gray-400">Instant credit to Meta Business Account</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">Fastest</span>
                </label>

                <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'meta_billing'
                    ? 'bg-[#00a884]/10 border-[#00a884]'
                    : 'bg-[#111b21] border-[#2a3942]'
                }`}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'meta_billing'}
                      onChange={() => setPaymentMethod('meta_billing')}
                      className="accent-[#00a884]"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Direct Meta Business Billing</span>
                      <span className="text-[10px] text-gray-400">Card on file in Meta Business Suite</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </label>
              </div>
            </div>

            {/* Total Summary & Confirm Button */}
            <div className="pt-3 border-t border-[#2a3942] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Total Recharge Amount:</span>
                <span className="text-lg font-black text-[#00a884]">
                  ₹{(customAmount ? parseFloat(customAmount) || 0 : selectedAmount).toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleRecharge}
                disabled={isProcessing}
                className="w-full bg-[#00a884] hover:bg-[#008f70] disabled:bg-gray-700 text-white text-xs font-bold py-3 rounded-xl shadow-xl shadow-[#00a884]/20 flex items-center justify-center space-x-2 transition-all active:scale-98"
              >
                {isProcessing ? (
                  <span>Connecting to Meta Billing Gateway...</span>
                ) : (
                  <>
                    <span>Proceed to Pay & Recharge</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
