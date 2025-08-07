<template>
    <v-form @submit.prevent="handleSubmit">
        <v-text-field class="mb-4" v-model="form.name" label="Nome" :error-messages="errors.name" @blur="validateField('name')" />
        <v-text-field class="mb-4" v-model="form.email" label="Email" :error-messages="errors.email"
            @blur="validateField('email')" />
        <v-text-field class="mb-4" v-model="form.ra" label="RA" :error-messages="errors.ra" @blur="validateField('ra')"
            @input="form.ra = form.ra.toUpperCase()" />
        <v-text-field class="mb-1" v-model="form.cpf" label="CPF" ref="cpfRef" :error-messages="errors.cpf"
            @blur="validateField('cpf')" />

        <v-card-actions class="justify-end">
            <v-btn variant="outlined" :to="cancelUrl" color="grey-darken-1">Cancelar</v-btn>
            <v-btn type="submit" color="primary">{{ submitLabel }}</v-btn>
        </v-card-actions>
    </v-form>
</template>

<script setup lang="ts">
import { reactive, watch, onMounted, ref, nextTick } from 'vue';
import { z, ZodError } from 'zod';
import { MaskInput } from "maska";

const cpfRef = ref()

const props = defineProps<{
    modelValue?: {
        name: string
        email: string
        ra: string
        cpf: string
    },
    cancelUrl?: string
    submitLabel?: string
}>()

const emit = defineEmits<{
    (e: 'submit', data: { name: string, email: string, ra: string, cpf: string }): void
}>()

const form = reactive({
    name: '',
    email: '',
    ra: '',
    cpf: '',
})

watch(() => props.modelValue, (value) => {
    if (value) {
        Object.assign(form, value)
    }
}, { immediate: true })

const errors = reactive<Record<string, string[]>>({
    name: [],
    email: [],
    ra: [],
    cpf: [],
})

const schema = z.object({
    name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }).max(100, { message: "O nome pode ter no máximo 100 caracteres" }),
    email: z.string().email({ message: "Formato de e-mail inválido" }),
    ra: z.string().regex(/^RA[A-Z0-9]{4,10}$/, { message: "RA deve começar com 'RA' seguido de 4 a 10 letras ou números (totalizando 6 a 12 caracteres)" }),
    cpf: z.string().regex(/^\d{11}$/, { message: "CPF deve conter exatamente 11 dígitos numéricos" }),
})

const validateField = (field: keyof typeof form) => {
    try {
        schema.pick({ [field]: true }).parse({ [field]: form[field].replace(/\D/g, '') })
        errors[field] = []
    } catch (err: any) {
        errors[field] = err.errors?.map((e: any) => e.message) || []
    }
}

const validateAll = () => {
    try {
        schema.parse({
            ...form,
            cpf: form.cpf.replace(/\D/g, '')
        })
        Object.keys(errors).forEach((k) => (errors[k] = []))
        return true
    } catch (err: any) {
        Object.keys(errors).forEach((k) => (errors[k] = []))

        if (err instanceof ZodError) {
            err.issues.forEach((issue) => {
                const field = issue.path?.[0] as string
                if (field) {
                    errors[field] ||= []
                    errors[field].push(issue.message)
                }
            })
        } else {
            console.error("Erro inesperado durante validação:", err)
        }

        return false
    }
}

const handleSubmit = () => {
    if (!validateAll()) return
    emit('submit', {
        ...form,
        cpf: form.cpf.replace(/\D/g, '')
    })
}

onMounted(() => {
    nextTick(() => {
        const inputEl = cpfRef.value?.$el?.querySelector('input')
        if (inputEl) {
            new MaskInput(inputEl, { mask: '###.###.###-##' })
        }
    })
})
</script>
