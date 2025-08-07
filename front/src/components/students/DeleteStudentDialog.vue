<template>
    <v-dialog v-model="model" max-width="500">
        <v-card>
            <v-card-title class="text-h6">Confirmar Exclusão</v-card-title>
            <v-card-text>
                Tem certeza que deseja excluir o aluno <strong>{{ student?.name }}</strong>?
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn variant="outlined" color="grey-darken-1" @click="cancel">Cancelar</v-btn>
                <v-btn color="error" @click="confirm">Excluir</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Student } from "../../stores/studentStore.ts";
import { computed } from "vue";

const props = defineProps<{
    deleteDialog: boolean;
    student: Student | null;
}>();

const emit = defineEmits<{
    (e: 'update:deleteDialog', value: boolean): void;
    (e: 'cancel'): void;
    (e: 'confirm'): void;
}>();

const model = computed({
    get: () => props.deleteDialog,
    set: (val: boolean) => emit('update:deleteDialog', val)
});

const cancel = () => emit("cancel");
const confirm = () => emit("confirm"); 
</script>