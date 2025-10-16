'use client';

import './globals.css';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth/provider';
import ReactQueryProvider from '@/providers/react-query-provider';
import axiosService from '@/services/axios.service';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem('token');

    if (stored) axiosService.setToken(stored);
    if (token) axiosService.setToken(token);
  }, [token]);
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-[#121214] text-gray-100`}>
        <AuthProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
