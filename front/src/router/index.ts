import { createRouter, createWebHistory } from 'vue-router'
import StudentList from '../views/StudentList.vue'
// import StudentForm from '../views/StudentForm.vue'

const routes = [
  { path: '/', component: StudentList },
  // { path: '/students/new', component: StudentForm },
  // { path: '/students/edit/:ra', component: StudentForm, props: true }
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
