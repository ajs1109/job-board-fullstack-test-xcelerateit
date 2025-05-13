'use client'

import { User } from '@/types/user';
import React, { useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import { useAuthStore } from '@/stores/authStore';
import { DottedSpinner } from '@/utils/customToast';

interface AuthLayoutProps {
  children: React.ReactNode;
  user?: User;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { user: storeUser, initialize, loading } = useAuthStore();
  
  useEffect(() => {
    initialize();
  }, []);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><DottedSpinner /></div>;
  }
  
  return (
    storeUser && <div className="min-h-screen flex flex-col">
      <Header username={storeUser?.name} />
      <main className={storeUser ? 'flex-1 pt-16' : 'flex-1'}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;