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
interface TripUpdateDTO {
  tripName?: string;
  tripDescription?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * 여행 계획을 저장하는 API
 * @param travelPlan 저장할 여행 계획 데이터
 * @param jwtToken 사용자 인증 토큰
 * @returns 저장된 여행 정보
 */
export const saveTravelPlanAPI = async (travelPlan: TravelPlanToSave, jwtToken: string | null) => {
  try {
    const response = await axios.post<ApiResponse<any>>('/api/travelplan/save', travelPlan, {
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
 * @param jwtToken 인증 토큰
 * @returns 수정된 여행 정보
 */
export const updateTripDescriptionAPI = async (tripId: number, updateData: TripUpdateDTO, jwtToken: string | null) => {
  try {
    const response = await axios.patch(`/api/travelplan/${tripId}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`여행 정보 수정 실패 (ID: ${tripId})`, error);
    throw error;
  }
};

/**
 * 여행을 삭제하는 API
 * @param tripId 여행 ID
 * @param jwtToken
 * @returns 삭제 결과
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