'use client'

import { User } from '@/types/user';
import React, { useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import { useAuthStore } from '@/stores/authStore';

interface AuthLayoutProps {
  children: React.ReactNode;
  user?: User; // Made optional as we're also using the store
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, user }) => {
  const { user: storeUser, initialize, loading } = useAuthStore();
  
  // Use an empty dependency array to run only once on component mount
  useEffect(() => {
    // Call initialize directly
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Use loading state from store to avoid flash of content
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // Give preference to user from props if available, otherwise use store user
  const displayUser = user || storeUser;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header username={displayUser?.name} />
      <main className={displayUser ? 'flex-1 pt-16' : 'flex-1'}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;