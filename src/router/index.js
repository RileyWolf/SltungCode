import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from "../components/LoginPage";
import Index from "../components/Index";

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
        }
    ]
})

export default router
