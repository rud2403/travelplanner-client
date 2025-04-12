import axios from '../libs/axios';
import { TravelPlanToSave } from '@/types/travel';

/**
 * API 반환 타입 정의
 */
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

/**
 * 여행 수정 DTO
 */
export interface TripUpdateDTO {
  tripName?: string;
  tripDescription?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  description?: string; // 이것이 필요했었음
}

/**
 * 여행 계획을 저장하는 API
 * @param travelPlan 저장할 여행 계획 데이터
 * @returns 저장된 여행 정보
 */
export const saveTravelPlanAPI = async (travelPlan: TravelPlanToSave) => {
  try {
    console.log('여행 계획 저장 API 호출:', { travelPlan });
    
    // withCredentials: true로 설정하여 쿠키 기반 인증 사용
    const response = await axios.post<ApiResponse<any>>('/api/travelplan/save', travelPlan, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // 쿠키 포함 요청
    });

    console.log('API 응답:', response.data);

    if (response.data.status === 201) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || response.statusText || '여행 계획 저장 오류');
    }
  } catch (error: any) {
    // 오류 상세 정보 로깅
    if (error.response) {
      console.error('서버 오류 응답:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    console.error('여행 저장 실패:', error);
    throw error;
  }
};

/**
 * OpenAPI를 호출하여 여행 계획을 생성하는 API
 * @param destination 목적지
 * @param startDate 시작일
 * @param endDate 종료일
 * @returns 생성된 여행 계획
 */
export const callTravelPlanAPI = async (destination: string, startDate: string, endDate: string) => {
  try {
    const response = await axios.get<ApiResponse<string>>('/api/travelplan/callTravelPlannerAssistant', {
      params: {
        destination,
        startDate,
        endDate,
      },
      timeout: 60000, // 1분 타임아웃
    });

    return JSON.parse(response.data.data);
  } catch (error) {
    console.error('여행 계획 생성 실패:', error);
    throw error;
  }
};

/**
 * 특정 여행 ID로 여행 상세 정보를 조회하는 API
 * @param travelId 여행 ID
 * @returns 여행 상세 정보
 */
export const getTravelPlanByIdAPI = async (travelId: number) => {
  try {
    const response = await axios.get(`/api/travelplan/${travelId}`);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`여행 상세 조회 실패: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`여행 상세 조회 실패 (ID: ${travelId})`, error);
    throw error;
  }
};

/**
 * 여행 정보를 수정하는 API
 * @param tripId 여행 ID
 * @param updateData 수정할 정보
 * @returns 수정된 여행 정보
 */
export const updateTripDescriptionAPI = async (tripId: number, updateData: TripUpdateDTO) => {
  try {
    console.log(`여행 정보 수정 API 호출 (ID: ${tripId}):`, updateData);
    
    const response = await axios.patch(`/api/travelplan/${tripId}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // 쿠키 포함 요청
    });

    return response.data;
  } catch (error: any) {
    // 오류 상세 정보 로깅
    if (error.response) {
      console.error(`여행 정보 수정 오류 응답 (ID: ${tripId}):`, {
        status: error.response.status,
        data: error.response.data
      });
    }
    console.error(`여행 정보 수정 실패 (ID: ${tripId})`, error);
    throw error;
  }
};

/**
 * 여행을 삭제하는 API
 * @param tripId 여행 ID
 * @returns 삭제 결과
 */
export const deleteTripAPI = async (tripId: number) => {
  try {
    console.log(`여행 삭제 API 호출 (ID: ${tripId})`);
    
    const response = await axios.delete(`/api/travelplan/${tripId}`, {
      withCredentials: true, // 쿠키 포함 요청
    });

    return response.data;
  } catch (error: any) {
    // 오류 상세 정보 로깅
    if (error.response) {
      console.error(`여행 삭제 오류 응답 (ID: ${tripId}):`, {
        status: error.response.status,
        data: error.response.data
      });
    }
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
    const response = await axios.get('/api/user/trips', {
      params: {
        nickname,
        paginate: true,
        page,
        size
      }
    });

    // API 응답 구조 확인
    if (response.data && response.data.status && response.data.data) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error('여행 데이터 조회 오류:', error);
    throw error;
  }
};

/**
 * 여행 계획 관련 API 서비스
 */
const travelPlanService = { 
  saveTravelPlanAPI, 
  callTravelPlanAPI, 
  getTravelPlanByIdAPI, 
  updateTripDescriptionAPI, 
  deleteTripAPI,
  getPagedTripsByNickname
};

export default travelPlanService;