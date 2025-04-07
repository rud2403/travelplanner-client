'use client';

import React, { useEffect } from 'react';
import useSessionStore from '@/store/useSessionStore';
import { usePathname, useRouter } from 'next/navigation';

// 로그인이 필요하지 않은 경로 목록
const PUBLIC_PATHS = [
  '/',
  '/auth/signin',
  '/auth/googleLogin'
];

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isLoggedIn, checkTokenExpiration } = useSessionStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 주기적으로 토큰 유효성 검사 (1분마다)
    const checkInterval = setInterval(async () => {
      if (isLoggedIn) {
        const isExpired = await checkTokenExpiration();
        if (isExpired) {
          // 토큰이 만료되면 알림 표시
          alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
          router.push('/auth/signin');
        }
      }
    }, 60000); // 1분마다 체크

    return () => clearInterval(checkInterval);
  }, [isLoggedIn, checkTokenExpiration, router]);

  useEffect(() => {
    // 초기 로드 시 토큰 유효성 검사
    const checkInitialToken = async () => {
      if (isLoggedIn) {
        await checkTokenExpiration();
      }

      // 비로그인 상태에서 보호된 경로 접근 시 로그인 페이지로 리다이렉트
      const isPublicPath = PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith('/auth/'));
      
      if (!isLoggedIn && !isPublicPath) {
        router.push('/auth/signin');
      }
    };
    
    checkInitialToken();
  }, [isLoggedIn, pathname, router, checkTokenExpiration]);

  return <>{children}</>;
}
