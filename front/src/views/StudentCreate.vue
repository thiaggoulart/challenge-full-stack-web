<template>
    <v-container class="d-flex justify-center align-start" style="min-height: 100vh;">
        <v-card class="pa-8" max-width="800" width="100%" elevation="2">
            <v-card-title class="text-h6 pl-0 mb-10">Cadastrar Aluno</v-card-title>
            <StudentForm submit-label="Salvar" cancel-url="/students" @submit="onSubmit" />
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { studentStore } from '@/stores/studentStore';
import StudentForm from '@/components/students/StudentForm.vue';

const router = useRouter()

const onSubmit = async (data: any) => {
    await studentStore.createStudent(data);
    router.push('/students');
}
</script>
