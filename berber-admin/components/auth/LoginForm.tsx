'use client';

import { useState } from 'react';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // TODO: Implement actual authentication
    // Simulated login
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard on success
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo and Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#3498DB] to-[#2C3E50] rounded-2xl mb-4 shadow-lg shadow-[#3498DB]/20">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2">Hoş Geldiniz</h1>
        <p className="text-[#94A3B8]">Admin paneline giriş yapın</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#CBD5E1] mb-2">
            E-posta
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ornek@email.com"
              className="w-full pl-10 pr-4 py-3 bg-[#1E293B] border border-[#334155] rounded-lg text-[#E5E7EB] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#CBD5E1] mb-2">
            Şifre
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 bg-[#1E293B] border border-[#334155] rounded-lg text-[#E5E7EB] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8] hover:text-[#E5E7EB] transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 bg-[#1E293B] border-[#334155] rounded text-[#3498DB] focus:ring-[#3498DB] focus:ring-2"
            />
            <span className="ml-2 text-sm text-[#CBD5E1]">Beni Hatırla</span>
          </label>
          <a
            href="#"
            className="text-sm text-[#3498DB] hover:text-[#3498DB]/80 transition-colors"
          >
            Şifremi Unuttum
          </a>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-[#EF4444]/20 border border-[#EF4444]/30 rounded-lg text-sm text-[#EF4444]">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-[#3498DB] to-[#2C3E50] text-white font-semibold rounded-lg hover:from-[#3498DB]/90 hover:to-[#2C3E50]/90 transition-all duration-200 shadow-lg shadow-[#3498DB]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Giriş yapılıyor...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Giriş Yap</span>
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-[#94A3B8]">
          Sorun mu yaşıyorsunuz?{' '}
          <a href="#" className="text-[#3498DB] hover:text-[#3498DB]/80 transition-colors">
            Destek ekibiyle iletişime geçin
          </a>
        </p>
      </div>
    </div>
  );
}

