import axios from '../libs/axios';

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
        return response.data;
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

export default { saveTravelPlanAPI, callTravelPlanAPI, getTravelPlanByIdAPI };
