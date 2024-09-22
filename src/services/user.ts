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

export const updateUserInfoAPI = async (email: string, nickname: string) => {
    try {
        const response = await axios.patch('/api/user/update', {
            email,
            nickname
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user information:', error);
        throw error;
    }
};