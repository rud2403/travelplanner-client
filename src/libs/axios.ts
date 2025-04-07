import axios from 'axios';
import useSessionStore from '@/store/useSessionStore';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 쿠키를 포함하기 위해 필요
});

// 응답 인터셉터 설정 (서버 측에서는 사용하지 않음)
if (typeof window !== 'undefined') {
  // 응답 인터셉터
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      
      // 401 오류이고, 재시도하지 않은 요청인 경우 토큰 갱신 시도
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // 토큰 갱신 API 호출 (쿠키는 자동으로 포함됨)
          const response = await instance.post('/api/user/token/refresh');
          
          if (response.status === 200) {
            // 사용자 정보 업데이트
            const userData = response.data.data;
            useSessionStore.getState().updateUserInfo({
              name: userData.name,
              email: userData.email,
              picture: userData.profilePictureUrl, // 필드 이름 변경에 맞게 수정
              nickname: userData.nickname
            });
            
            // 토큰 만료 시간 업데이트
            useSessionStore.getState().updateTokenExpiry(userData.accessTokenExpiresAt);
            
            // 원래 요청 재시도
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // 토큰 갱신 실패 시 로그아웃 처리
          useSessionStore.getState().clearUserInfo();
          
          // 로그인 페이지로 리디렉션
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/signin';
          }
          
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
}

export default instance;
