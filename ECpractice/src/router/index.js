import Vue from 'vue'
import VueRouter from 'vue-router'



// import Home from '@/components/HelloWorld'
import Login from '@/components/pages/Login'
import Dashboard from '@/components/Dashboard'
import Products from '@/components/pages/Products'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: '*',
            redirect: 'login'
        },
        // {
        //     name: '首頁',
        //     path: '/',
        //     component: Home,
        //     meta: { requiresAuth: true },
        // },
        {
            name: 'Login',
            path: '/Login',
            component: Login,
        },
        {
            name: 'Dashboard',
            path: '/admin',
            component: Dashboard,
            children: [
                {
                    name: 'Products',
                    path: 'Products',
                    component: Products,
                    meta: { requiresAuth: true },
                }
            ]
        },
    ]
})

