import axios from '../libs/axios';

export const fetchData = async (googleCode: string | null) => {
    try {
        const response = await axios.get(`/api/user/oauth/google?code=${googleCode}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};