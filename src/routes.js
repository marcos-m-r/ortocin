// import Home from './components/Home.vue'
import HelloWorld from './components/HelloWorld.vue'
import Patients from './components/Patients/Index.vue'
import DataTable from './components/DataTable.vue'

const routes = [
    { path: '/', component: Patients, name: 'home' },
    { path: '/hello-world', component: HelloWorld, name: 'hello-world' },
    { path: '/data-table', component: DataTable, name: 'data-table' },
];

export default routes;