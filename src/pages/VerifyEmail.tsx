import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2, MailCheck } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';

type VerificationStatus = 'checking' | 'success' | 'error';

const TOKEN_QUERY_KEYS = ['token', 'code', 'verification_token', 'verificationToken'];

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>('checking');
  const [message, setMessage] = useState('Verifying your account...');

  const token = useMemo(() => {
    for (const key of TOKEN_QUERY_KEYS) {
      const value = searchParams.get(key);
      if (value) return value;
    }
    return '';
  }, [searchParams]);

  const email = searchParams.get('email') || undefined;

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification link is missing a token.');
        toast.error('Verification link is invalid.');
        return;
      }

      const { error } = await apiClient.auth.verifyEmail({ token, email });
      if (error) {
        setStatus('error');
        setMessage(error.message || 'Could not verify the account.');
        toast.error(error.message || 'Could not verify the account.');
        return;
      }

      setStatus('success');
      setMessage('Account verified. You can sign in now.');
      toast.success('Account verified. Please sign in.');
    };

    verifyAccount();
  }, [email, token]);

  const isChecking = status === 'checking';
  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen bg-[#F0F0F0] font-mono flex items-center justify-center p-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <main className="relative w-full max-w-lg bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
        <div className={`w-20 h-20 border-4 border-black flex items-center justify-center mb-8 ${isSuccess ? 'bg-green-400' : status === 'error' ? 'bg-[#FF4500]' : 'bg-black text-white'}`}>
          {isChecking ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : isSuccess ? (
            <CheckCircle2 className="w-10 h-10" />
          ) : (
            <AlertTriangle className="w-10 h-10 text-white" />
          )}
        </div>

        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#FF4500] mb-3">
          Email Verification
        </p>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-5">
          {isChecking ? 'Checking Link' : isSuccess ? 'Account Verified' : 'Verification Failed'}
        </h1>
        <p className="text-sm md:text-base font-bold uppercase text-muted-foreground leading-relaxed mb-8">
          {message}
        </p>

        <Link
          to="/auth"
          className="w-full bg-black text-white border-2 border-black py-4 px-5 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all"
        >
          <MailCheck className="w-5 h-5" />
          Go To Sign In
          <ArrowRight className="w-5 h-5" />
        </Link>
      </main>
    </div>
  );
};

export default VerifyEmail;
