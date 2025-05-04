import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/exchange-rates'; // Замените на свой URL

const exchangeRateService = {
    getAllExchangeRates: async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data;
        } catch (error) {
            console.error("Ошибка при получении обменных курсов:", error);
            throw error;
        }
    },

    getExchangeRate: async (bankId, fromCurrencyCode, toCurrencyCode) => {
        try {
            const response = await axios.get(API_BASE_URL, {
                params: { bankId, fromCurrencyCode, toCurrencyCode }
            });
            const rateData = response.data;
            // Предполагаем, что сервер возвращает объект с полем rate или список, где нужно взять первый элемент
            if (Array.isArray(rateData) && rateData.length > 0) {
                return rateData[0].rate; // Возвращаем курс из первого подходящего объекта
            } else if (rateData && rateData.rate) {
                return rateData.rate; // Если сервер возвращает одиночный объект
            } else {
                return null; // Если курс не найден
            }
        } catch (error) {
            console.error(`Ошибка при получении обменного курса для bankId=${bankId}, from=${fromCurrencyCode}, to=${toCurrencyCode}:`, error);
            throw error;
        }
    },

    createExchangeRate: async (bankId, fromCurrencyCode, toCurrencyCode, rate) => {
        try {
            const response = await axios.post(API_BASE_URL, null, {
                params: { bankId, fromCurrencyCode, toCurrencyCode, rate }
            });
            return response.data;
        } catch (error) {
            console.error("Ошибка при создании обменного курса:", error);
            throw error;
        }
    },

    updateExchangeRate: async (id, fromCurrencyCode, toCurrencyCode, newRate) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, null, {
                params: { fromCurrencyCode, toCurrencyCode, newRate }
            });
            return response.data;
        } catch (error) {
            console.error(`Ошибка при обновлении обменного курса с ID ${id}:`, error);
            throw error;
        }
    },

    deleteExchangeRate: async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
        } catch (error) {
            console.error(`Ошибка при удалении обменного курса с ID ${id}:`, error);
            throw error;
        }
    }
};

export default exchangeRateService;