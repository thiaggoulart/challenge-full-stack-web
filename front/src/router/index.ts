import { createRouter, createWebHistory } from 'vue-router'
import StudentList from '../pages/StudentList.vue'
import StudentForm from '../pages/StudentForm.vue'

const routes = [
  { path: '/', component: StudentList },
  { path: '/students/new', component: StudentForm },
  { path: '/students/edit/:ra', component: StudentForm, props: true }
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
