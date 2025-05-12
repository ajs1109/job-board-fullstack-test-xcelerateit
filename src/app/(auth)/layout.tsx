import AuthLayout from '@/components/layout/AuthLayout';
import { verifyUser } from '@/lib/api';
import { User } from '@/types/user';
import { apiService } from '@/utils/apiService';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieList = await cookies();
  const accessToken = cookieList.get('auth_token')?.value ?? ''
  let user: User | null = null;
  try {
    apiService.setupHeader("Authorization", `Bearer ${accessToken}`);
    const { user: newUser } = await verifyUser(accessToken);
    if(newUser){
      user = newUser;
    }
    //setAuthUser(user);
  } catch (error) {
     console.log('error while verifyUser():', error);
  } finally{
    if(user){
      //this redirect does not work. But assuming that code wont reach here as middleware handles it.
      redirect("/");
    }
  }

  return (
    <>{children}</>
  );
}