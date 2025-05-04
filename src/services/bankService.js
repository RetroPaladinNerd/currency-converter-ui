// src/services/bankService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/banks'; // Замените на свой URL

const bankService = {
    getAllBanks: async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data;
        } catch (error) {
            console.error("Ошибка при получении банков:", error);
            throw error;
        }
    },

    getBank: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Ошибка при получении банка с ID ${id}:`, error);
            throw error;
        }
    },

    createBank: async (name) => {
        try {
            const response = await axios.post(API_BASE_URL, null, { params: { name } });
            return response.data;
        } catch (error) {
            console.error("Ошибка при создании банка:", error);
            throw error;
        }
    },

    updateBank: async (id, newName) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, null, { params: { newName } });
            return response.data;
        } catch (error) {
            console.error(`Ошибка при обновлении банка с ID ${id}:`, error);
            throw error;
        }
    },

    deleteBank: async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
        } catch (error) {
            console.error(`Ошибка при удалении банка с ID ${id}:`, error);
            throw error;
        }
    }
};

export default bankService;