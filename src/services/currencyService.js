// src/services/currencyService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/currencies'; // Замените на свой URL

const currencyService = {
    getAllCurrencies: async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data;
        } catch (error) {
            console.error("Ошибка при получении валют:", error);
            throw error;
        }
    },

    getCurrency: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Ошибка при получении валюты с ID ${id}:`, error);
            throw error;
        }
    },

    createCurrency: async (code, name) => {
        try {
            const response = await axios.post(API_BASE_URL, null, { params: { code, name } });
            return response.data;
        } catch (error) {
            console.error("Ошибка при создании валюты:", error);
            throw error;
        }
    },

    updateCurrency: async (id, newCode, newName) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, null, { params: { newCode, newName } });
            return response.data;
        } catch (error) {
            console.error(`Ошибка при обновлении валюты с ID ${id}:`, error);
            throw error;
        }
    },

    deleteCurrency: async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
        } catch (error) {
            console.error(`Ошибка при удалении валюты с ID ${id}:`, error);
            throw error;
        }
    },
    convertCurrency: async (conversionRequest) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/convert`, conversionRequest);
            return response.data;
        } catch (error) {
            console.error("Ошибка при конвертации валюты:", error);
            throw error;
        }
    }
};

export default currencyService;