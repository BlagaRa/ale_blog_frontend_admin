'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const isAuthRoute = pathname.startsWith('/login');

      if (!token) {
        if (!isAuthRoute) {
          router.push('/login');
        } else {
          setIsValidating(false);
        }
        return;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        
        await axios.get(`${baseUrl}/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (isAuthRoute) {
          router.push('/');
        } else {
          setIsValidating(false);
        }
      } catch (error) {
        localStorage.removeItem('token');
        if (!isAuthRoute) {
          router.push('/login');
        } else {
          setIsValidating(false);
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isValidating) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return <>{children}</>;
}