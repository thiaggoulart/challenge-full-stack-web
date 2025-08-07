import { createRouter, createWebHistory } from 'vue-router';
import StudentList from '../views/StudentList.vue';
import StudentCreate from '../views/StudentCreate.vue';
import StudentEdit from '../views/StudentEdit.vue';

const routes = [
  { path: '/', redirect: '/students' },
  { path: '/students', component: StudentList },
  { path: '/students/create', component: StudentCreate },
  { path: '/students/edit/:ra', component: StudentEdit }
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
