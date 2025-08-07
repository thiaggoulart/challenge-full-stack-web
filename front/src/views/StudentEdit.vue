<template>
    <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
        <v-card class="pa-8" max-width="800" width="100%" elevation="2">
            <v-card-title class="text-h6">Editar Aluno</v-card-title>
            <div v-if="loading" class="py-8">
                <v-progress-circular indeterminate />
            </div>
            <div v-else-if="!student">
                <v-alert type="error" title="Aluno não encontrado" />
                <v-btn class="mt-4" to="/students" variant="tonal">Voltar</v-btn>
            </div>
            <StudentForm v-else :model-value="student" :original-data="student" submit-label="Atualizar"
                cancel-url="/students" @submit="onSubmit" />
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StudentForm from '@/components/students/StudentForm.vue';
import { studentStore } from '@/stores/studentStore';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const student = ref<{ name: string; email: string; ra: string; cpf: string } | null>(null);

onMounted(async () => {
    const ra = String(route.params.ra || '');

    try {
        const data = await studentStore.getStudentByRa(ra);
        student.value = data ?? null;
    } finally {
        loading.value = false;
    }
})

const onSubmit = async (payload: { name: string; email: string; ra: string; cpf: string }) => {
    await studentStore.updateStudent(payload);
    router.push('/students');
}
</script>
