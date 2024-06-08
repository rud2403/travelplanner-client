import axios from '../libs/axios';

export const fetchData = async () => {
    try {
        const response = await axios.get('/api/tests/Docker-test');
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};