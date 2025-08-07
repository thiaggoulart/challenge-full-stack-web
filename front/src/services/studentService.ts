import type { Student } from "@/stores/studentStore";
import axios from "axios";


const api = import.meta.env.VITE_API_BASE_URL;

export async function getStudents(
    query: string = '',
    limit: number = 10,
    offset: number = 0
): Promise<{ students: Student[]; total: number }> {
    const searchUrl = query.trim()
        ? `${api}/students/search?query=${query}&limit=${limit}&offset=${offset}`
        : `${api}/students?limit=${limit}&offset=${offset}`;

    const { data } = await axios.get(searchUrl);

    if (Array.isArray(data)) {
        return {
            students: data,
            total: data.length,
        };
    }

    return {
        students: data.students,
        total: data.total,
    };
}

export const deleteStudentByRa = async (ra: string) => {
    try {
        await axios.delete(`${api}/students/${ra}`);
    } catch (error) {
        console.error("Erro ao excluir aluno:", error);
        throw error;
    }
};

export const getStudentByRa = async (ra: string) => {
    try {
        const { data } = await axios.get(`${api}/students/${ra}`);
        return data;
    } catch (error) {
        console.error("Erro ao buscar aluno:", error);
        throw error;
    }
};

export const createStudent = async (student: Student) => {
    try {
        const { data } = await axios.post(`${api}/students`, student);
        return data;
    } catch (error) {
        console.error("Erro ao criar aluno:", error);
        throw error;
    }
};

export const updateStudent = async (ra: string, student: Student) => {
    try {
        const { data } = await axios.put(`${api}/students/${ra}`, student);
        return data;
    } catch (error) {
        console.error("Erro ao atualizar aluno:", error);
        throw error;
    }
};