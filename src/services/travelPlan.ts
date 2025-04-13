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
 * 여행 계획 전체를 업데이트하는 API
 * @param travelPlan 업데이트할 여행 계획 데이터 (ID 포함)
 * @returns 업데이트된 여행 정보
 */
export const updateTravelPlanAPI = async (travelPlan: any) => {
  try {
    console.log('여행 계획 업데이트 API 호출:', { travelPlan });
    
    const response = await axios.put<ApiResponse<any>>(`/api/travelplan/${travelPlan.id}`, travelPlan, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // 쿠키 포함 요청
    });

    console.log('API 응답:', response.data);

    if (response.data.status === 200) {
      return response.data.data || response.data;
    } else {
      throw new Error(response.data.message || response.statusText || '여행 계획 업데이트 오류');
    }
  } catch (error: any) {
    // 오류 상세 정보 로깅
    if (error.response) {
      console.error('서버 오류 응답:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    console.error('여행 업데이트 실패:', error);
    throw error;
  }
};

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
 * 여행 일정을 엑셀로 내보내는 API
 * @param tripId 여행 ID (선택적 - 주어진 경우 해당 ID의 저장된 여행 일정을 내보냄)
 * @param travelPlan 여행 계획 데이터 (선택적 - 저장되지 않은 여행 일정을 내보낼 때 사용)
 * @returns 엑셀 파일 블롭
 */
export const exportTravelPlanToExcel = async (tripId?: number, travelPlan?: any) => {
  try {
    let response;
    
    if (tripId) {
      // 저장된 여행 일정을 내보낼 때
      response = await axios.get(`/api/travelplan/${tripId}/excel`, {
        responseType: 'blob', // 응답을 blob으로 받음
        withCredentials: true, // 쿠키 포함 요청
      });
    } else if (travelPlan) {
      // 저장되지 않은 여행 일정을 내보낼 때
      response = await axios.post('/api/travelplan/excel', travelPlan, {
        responseType: 'blob', // 응답을 blob으로 받음
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // 쿠키 포함 요청
      });
    } else {
      throw new Error('여행 ID 또는 여행 계획 데이터가 필요합니다.');
    }

    // 파일 다운로드 로직
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = `여행계획_${new Date().toISOString().slice(0, 10)}.xlsx`;
    
    // 다운로드 링크 생성 및 클릭
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // 정리
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return true;
  } catch (error: any) {
    console.error('엑셀 내보내기 실패:', error);
    if (error.response) {
      console.error('서버 오류 응답:', {
        status: error.response.status,
        data: error.response.data
      });
    }
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
  updateTravelPlanAPI,
  deleteTripAPI,
  getPagedTripsByNickname,
  exportTravelPlanToExcel
};

export default travelPlanService;