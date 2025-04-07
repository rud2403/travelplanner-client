import { create } from 'zustand';
import { refreshTokenAPI } from '@/services/user';

type UserInfo = {
  name?: string;
  sub?: string;
  email?: string;
  picture?: string;
  nickname?: string;
};

type SessionState = {
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  accessTokenExpiresAt: number | null;
  updateUserInfo: (userInfo: UserInfo) => void;
  updateTokenExpiry: (expiresAt: number) => void;
  clearUserInfo: () => void;
  checkTokenExpiration: () => Promise<boolean>;
};

const useSessionStore = create<SessionState>((set, get) => ({
  userInfo: null,
  isLoggedIn: false,
  accessTokenExpiresAt: null,

  updateUserInfo: (userInfo) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
    
    set({ 
      userInfo, 
      isLoggedIn: true
    });
  },
  
  updateTokenExpiry: (expiresAt) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessTokenExpiresAt', expiresAt.toString());
    }
    
    set({
      accessTokenExpiresAt: expiresAt
    });
  },

  clearUserInfo: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('accessTokenExpiresAt');
    }
    set({ 
      userInfo: null, 
      isLoggedIn: false, 
      accessTokenExpiresAt: null
    });
  },
  
  // 토큰 만료 여부 확인
  checkTokenExpiration: async () => {
    const { accessTokenExpiresAt } = get();
    const now = Date.now();
    
    // 액세스 토큰 만료 확인
    if (!accessTokenExpiresAt || accessTokenExpiresAt < now) {
      try {
        // 토큰 갱신 API 호출 (쿠키는 자동으로 포함됨)
        const response = await fetch('/api/user/token/refresh', {
          method: 'POST',
          credentials: 'include' // 쿠키 포함
        });
        
        if (!response.ok) {
          // 갱신 실패 시 로그아웃
          get().clearUserInfo();
          return true; // 만료됨
        }
        
        const data = await response.json();
        if (data?.data?.accessTokenExpiresAt) {
          // 토큰 만료 시간 업데이트
          get().updateTokenExpiry(data.data.accessTokenExpiresAt);
          return false; // 갱신 성공
        }
        
        // 응답에 만료 시간이 없는 경우
        get().clearUserInfo();
        return true; // 만료됨
      } catch (error) {
        // 오류 발생 시 로그아웃
        get().clearUserInfo();
        return true; // 만료됨
      }
    }
    
    return false; // 유효함
  }
}));

// 클라이언트에서만 실행되도록 상태 초기화
if (typeof window !== 'undefined') {
  const userInfo = localStorage.getItem('userInfo');
  const accessTokenExpiresAt = localStorage.getItem('accessTokenExpiresAt');
  
  if (userInfo && accessTokenExpiresAt) {
    const expiresAtNum = parseInt(accessTokenExpiresAt, 10);
    
    // 토큰이 유효한 경우에만 상태 복원
    if (expiresAtNum > Date.now()) {
      useSessionStore.setState({
        userInfo: JSON.parse(userInfo),
        isLoggedIn: true,
        accessTokenExpiresAt: expiresAtNum
      });
    } else {
      // 만료된 경우 데이터 삭제 (서버에서 새로고침 시 토큰 검증)
      localStorage.removeItem('userInfo');
      localStorage.removeItem('accessTokenExpiresAt');
    }
  }
}

export default useSessionStore;
