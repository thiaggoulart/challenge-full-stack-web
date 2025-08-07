<template>
  <v-data-table v-bind="studentStore.tableOpts" :headers="headers" :items="studentStore.students"
    :loading="studentStore.loading" class="elevation-1" no-data-text="Nenhum aluno encontrado"
    @update:page="onPageChange">
    <template v-slot:item.actions="{ item }">
      <div class="d-flex justify-end ga-2">
        <v-btn size="small" variant="text" color="primary" :to="`/students/edit/${item.ra}`">
          <v-icon start>mdi-pencil</v-icon> Editar
        </v-btn>
        <v-btn size="small" variant="text" color="error" @click="() => studentStore.openDeleteDialog(item)">
          <v-icon start>mdi-delete</v-icon> Excluir
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { studentStore } from '@/stores/studentStore';

const headers = [
  { title: 'Registro Acadêmico', key: 'ra' },
  { title: 'Nome', key: 'name' },
  { title: 'CPF', key: 'cpf' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
]

onMounted(() => {
  studentStore.fetchStudents()
})

const onPageChange = (page: number) => {
  studentStore.tableOpts.page = page
  studentStore.fetchStudents()
}
</script>