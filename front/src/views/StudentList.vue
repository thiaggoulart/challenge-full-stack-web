<template>
    <v-container>
        <v-card>
            <v-card-title>
                <v-row class="w-100 align-center" no-gutters>
                    <v-col cols="12" md="8">
                        <StudentSearch v-model:search="studentStore.tableOpts.search" />
                    </v-col>
                    <v-col cols="12" md="4" class="d-flex justify-end">
                        <v-btn color="primary" variant="tonal" class="font-weight-medium"
                            prepend-icon="mdi-account-plus" to="/students/create">
                            Cadastrar Aluno
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>

            <StudentTable class="px-4 pt-4" />
            <DeleteStudentDialog v-model:deleteDialog="studentStore.deleteDialog"
                :student="studentStore.selectedStudentToDelete" @cancel="studentStore.deleteDialog = false"
                @confirm="studentStore.deleteStudent" />
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import StudentSearch from "../components/students/StudentSearch.vue";
import StudentTable from "../components/students/StudentTable.vue";
import DeleteStudentDialog from "../components/students/DeleteStudentDialog.vue";
import { studentStore } from "../stores/studentStore.ts";
</script>
