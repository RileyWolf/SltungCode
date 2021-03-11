import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from "../components/LoginPage";
import Index from "../components/Index";
import Labeling from '../components/Labeling'
import projectManagement from '../components/projectManagement'

Vue.use(Router)

let router = new Router({
    routes: [
        {
            path: '/',
            name: 'Index',
            component: Index
        },
        {
            path: '/login',
            name: 'LoginPage',
            component: LoginPage
        },
        {
            path: '/labeling',
            name: 'Labeling',
            component: Labeling
        },
        {
            path: '/projectManagement',
            name: 'projectManagement',
            component: projectManagement
        }
    ]
})

export default router
