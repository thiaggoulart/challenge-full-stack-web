<template>
    <v-card>
        <v-card-title>
            <v-row class="w-100 align-center" no-gutters>
                <v-col cols="12" md="8">
                    <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Digite sua busca"
                        variant="outlined" density="comfortable" clearable hide-details @keyup.enter="fetchStudents" />
                </v-col>

                <v-col cols="12" md="4" class="d-flex justify-end">
                    <v-btn color="primary" variant="tonal" class="font-weight-medium" prepend-icon="mdi-account-plus"
                        @click="goToCreate">
                        Cadastrar Aluno
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>

            <v-data-table :headers="headers" :items="students" :items-per-page="itemsPerPage" :page="page"
                :server-items-length="totalStudents" :loading="loading" class="elevation-1 px-4 pt-4"
                no-data-text="Nenhum aluno encontrado" @update:page="onPageChange">
                <template v-slot:item.actions="{ item }">
                    <v-btn size="small" variant="text" color="primary" @click="editStudent(item)">
                        <v-icon start>mdi-pencil</v-icon> Editar
                    </v-btn>
                    <v-btn size="small" variant="text" color="primary" @click="openDeleteDialog(item)">
                        <v-icon start>mdi-delete</v-icon> Excluir
                    </v-btn>
                </template>
            </v-data-table>
            <v-dialog v-model="deleteDialog" max-width="500">
                <v-card>
                    <v-card-title class="text-h6">Confirmar Exclusão</v-card-title>
                    <v-card-text>
                        Tem certeza que deseja excluir o aluno
                        <strong>{{ selectedStudentToDelete?.name }}</strong> (RA: {{ selectedStudentToDelete?.ra }})?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn variant="outlined" color="grey-darken-1" class="b-1"
                            @click="deleteDialog = false">Cancelar</v-btn>
                        <v-btn variant="elevated" color="secondary" @click="confirmDelete">Excluir</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
    </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";


const router = useRouter();

interface Student {
    name: string;
    email: string;
    ra: string;
    cpf: string;
}

const students = ref<Student[]>([]);
const totalStudents = ref(0);
const search = ref("");
const page = ref(1);
const itemsPerPage = 10;
const loading = ref(false);
const api = import.meta.env.VITE_API_BASE_URL;

const headers = [
    { title: "Registro Acadêmico", key: "ra" },
    { title: "Nome", key: "name" },
    { title: "CPF", key: "cpf" },
    { title: "Ações", key: "actions", sortable: false },
];

const fetchStudents = async () => {
    loading.value = true;
    try {
        const offset = (page.value - 1) * itemsPerPage;
        let url = "";

        if (search.value.trim()) {
            url = `${api}/students/search?query=${search.value}`;
        } else {
            url = `${api}/students?limit=${itemsPerPage}&offset=${offset}`;
        }

        const { data } = await axios.get(url);
        students.value = data.students || data;
        totalStudents.value = data.total || data.length || 0;
    } catch (error) {
        console.error("Erro ao buscar alunos:", error);
    } finally {
        loading.value = false;
    }
};

const onPageChange = (newPage: number) => {
    page.value = newPage;
    fetchStudents();
};

const editStudent = (student: Student) => {
    router.push(`/students/edit/${student.ra}`);
};

const deleteDialog = ref(false);
const selectedStudentToDelete = ref<Student | null>(null);

const openDeleteDialog = (student: Student) => {
    selectedStudentToDelete.value = student;
    deleteDialog.value = true;
};

const confirmDelete = async () => {
    if (!selectedStudentToDelete.value) return;

    try {
        await axios.delete(`${api}/students/${selectedStudentToDelete.value.ra}`);
        deleteDialog.value = false;
        fetchStudents();
    } catch (error) {
        console.error("Erro ao excluir aluno:", error);
    }
};


const goToCreate = () => {
    router.push("/students/new");
};

watch(search, () => {
    page.value = 1;
    fetchStudents();
});

onMounted(fetchStudents);
</script>
