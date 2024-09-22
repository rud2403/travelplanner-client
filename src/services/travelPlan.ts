import axios from '../libs/axios';

// 백엔드에서 받아온 데이터를 사용하여 travelPlan을 수정
export const callTravelPlanAPI = async (destination: string, startDate: string, endDate: string) => {
    try {
        const response = await axios.get('/api/travelplan/callTravelPlannerAssistant', {
            params: {
                destination,
                startDate,
                endDate
            }
        });
        console.log('response : ', response);
        return response.data.data;
    } catch (error) {
        console.error('chatGpt assistant 호출 실패 :', error);
        throw error;
    }
};

export default callTravelPlanAPI;
