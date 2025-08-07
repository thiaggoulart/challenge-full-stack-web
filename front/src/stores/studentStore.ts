import { reactive } from 'vue';
import { getStudents, deleteStudentByRa, createStudent, getStudentByRa, updateStudent } from '@/services/studentService';

export interface Student {
    name: string;
    email: string;
    ra: string;
    cpf: string;
}

export const studentStore = reactive({
    students: [] as Student[],
    serverItemsLength: 0,
    loading: false,
    deleteDialog: false,
    selectedStudentToDelete: null as Student | null,
    tableOpts: {
        page: 1,
        itemsPerPage: 10,
        search: '',
    },

    async getStudents() {
        this.loading = true;
        try {
            const offset = (this.tableOpts.page - 1) * this.tableOpts.itemsPerPage;

            const data = this.tableOpts.search.trim()
                ? await getStudents(this.tableOpts.search, this.tableOpts.itemsPerPage, offset)
                : await getStudents("", this.tableOpts.itemsPerPage, offset);

            this.students = data.students;
            this.serverItemsLength = data.total;
        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
        } finally {
            this.loading = false;
        }
    },

    async deleteStudent() {
        if (!studentStore.selectedStudentToDelete) return;
        try {
            await deleteStudentByRa(studentStore.selectedStudentToDelete.ra);
            studentStore.deleteDialog = false;
            await studentStore.getStudents();
        } catch (error) {
            console.error('Erro ao excluir aluno:', error);
        }
    },

    openDeleteDialog(student: Student) {
        this.selectedStudentToDelete = student;
        this.deleteDialog = true;
    },

    async createStudent(student: { name: string; email: string; ra: string; cpf: string }) {
        await createStudent(student);
    },

    async getStudentByRa(ra: string) {
        const data = await getStudentByRa(ra);
        return data;
    },

    async updateStudent(student: { name: string; email: string; ra: string; cpf: string }) {
        await updateStudent(student.ra, student);
    },
});
