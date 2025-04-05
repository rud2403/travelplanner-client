import axios from '../libs/axios';
import { TripPageData } from '@/types/tripPage';

/**
 * 여행 계획을 저장하는 API
 * @param travelPlan 
 * @param jwtToken 
 * @returns 
 */
export const saveTravelPlanAPI = async (travelPlan: any, jwtToken: string | null) => {
    try {
      const response = await axios.post('/api/travelplan/save', travelPlan, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });
  
      if (response.data.status === 201) {
        return response.data.data || response.data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      throw error;
    }
};

/**
 * OpenAPI를 호출하여 여행 계획을 가져오는 API
 * @param destination 
 * @param startDate 
 * @param endDate 
 * @returns 
 */
export const callTravelPlanAPI = async (destination: string, startDate: string, endDate: string) => {
    try {
      const response = await axios.get('/api/travelplan/callTravelPlannerAssistant', {
        params: {
          destination,
          startDate,
          endDate,
        },
        timeout: 999999, // 최대 대기시간 설정
      });
      console.log('response : ', response);
  
      return JSON.parse(response.data.data);
    } catch (error) {
      console.error('chatGpt assistant 호출 실패 :', error);
      throw error;
    }
};

/**
 * 특정 여행 ID로 여행 상세 정보를 조회하는 API
 * @param travelId 여행 ID
 * @returns 여행 상세 정보 (JSON)
 */
export const getTravelPlanByIdAPI = async (travelId: number) => {
    try {
      const response = await axios.get(`/api/travelplan/${travelId}`);

      if (response.status === 200) {
        return response.data; // JSON 형태로 반환
      } else {
        throw new Error(`여행 상세 조회 실패: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`여행 상세 조회 실패 (ID: ${travelId})`, error);
      throw error;
    }
};

/**
 * 여행 설명을 수정하는 API
 * @param tripId 여행 ID
 * @param updateData 수정할 TripDTO (부분 필드 포함 가능)
 * @param jwtToken 인증 토큰
 * @returns 서버 응답
 */
export const updateTripDescriptionAPI = async (tripId: number, updateData: any, jwtToken: string | null) => {
  try {
    const response = await axios.patch(`/api/travelplan/${tripId}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`여행 설명 수정 실패 (ID: ${tripId})`, error);
    throw error;
  }
};

/**
 * 여행을 삭제하는 API
 * @param tripId 여행 ID
 * @param jwtToken 인증 토큰
 * @returns 서버 응답
 */
export const deleteTripAPI = async (tripId: number, jwtToken: string | null) => {
    try {
        const response = await axios.delete(`/api/travelplan/${tripId}`, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error(`여행 삭제 실패 (ID: ${tripId})`, error);
        throw error;
    }
};

/**
 * 페이징된 여행 데이터 가져오기
 * @param nickname 사용자 닉네임
 * @param page 페이지 번호 (0부터 시작)
 * @param size 페이지당 항목 수
 * @returns 페이징된 여행 데이터
 */
export const getPagedTripsByNickname = async (nickname: string, page: number, size: number) => {
  try {
    console.log(`API 호출: /api/user/trips?nickname=${nickname}&paginate=true&page=${page}&size=${size}`);
    
    const response = await axios.get(`/api/user/trips`, {
      params: {
        nickname,
        paginate: true,
        page,
        size
      }
    });

    console.log('Trip API 응답 전체:', response);
    console.log('응답 데이터 구조:', response.data);
    
    // 응답 구조 분석
    if (response.data) {
      // API 응답이 { status, message, data } 구조인 경우 (일반적인 백엔드 응답 패턴)
      if (response.data.status && response.data.data) {
        console.log('페이징된 데이터:', response.data.data);
        return response.data;
      } 
      // 직접 데이터를 반환하는 경우
      else {
        console.log('직접 반환된 데이터:', response.data);
        return response.data;
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('여행 데이터 조회 오류:', error);
    throw error;
  }
};

const travelPlanService = { 
    saveTravelPlanAPI, 
    callTravelPlanAPI, 
    getTravelPlanByIdAPI, 
    updateTripDescriptionAPI, 
    deleteTripAPI,
    getPagedTripsByNickname
};

export default travelPlanService;
