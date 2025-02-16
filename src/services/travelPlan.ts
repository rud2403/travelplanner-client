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
        timeout: 999999, // ex) 최대 10초 동안 기다림 (10000ms)
      });
      console.log('response : ', response);
  
      return JSON.parse(response.data.data);
    } catch (error) {
      console.error('chatGpt assistant 호출 실패 :', error);
      throw error;
    }
  };
  
  export default { saveTravelPlanAPI, callTravelPlanAPI };
