import { create } from 'zustand';

type UserInfo = {
  sub: string;
  name: string;
  email: string;
  picture: string;
};

type SessionState = {
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  updateUserInfo: (userInfo: UserInfo) => void;
  clearUserInfo: () => void;
};

const useSessionStore = create<SessionState>((set) => ({
  userInfo: null,
  isLoggedIn: false,

  updateUserInfo: (userInfo) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
    set({ userInfo, isLoggedIn: true });
  },

  clearUserInfo: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userInfo');
    }
    set({ userInfo: null, isLoggedIn: false });
  },
}));

// 클라이언트에서만 실행되도록 useEffect로 상태 초기화
if (typeof window !== 'undefined') {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    useSessionStore.setState({
      userInfo: JSON.parse(userInfo),
      isLoggedIn: true,
    });
  }
}

export default useSessionStore;
