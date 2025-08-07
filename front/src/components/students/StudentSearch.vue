<template>
  <v-text-field v-model="model" prepend-inner-icon="mdi-magnify" label="Procure por um estudante" variant="outlined"
    density="comfortable" clearable hide-details @keyup.enter="onSearch" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps<{
  search: string;
}>();

const emit = defineEmits<{
  (event: "update:search", value: string): void;
}>();

const model = computed({
  get: () => props.search,
  set: (value: string) => emit("update:search", value),
});

const onSearch = () => {
  emit("update:search", props.search);
};
</script>
