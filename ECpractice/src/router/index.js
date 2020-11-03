import Vue from 'vue'
import VueRouter from 'vue-router'



// import Home from '@/components/HelloWorld'
import Login from '@/components/pages/Login'
import Dashboard from '@/components/Dashboard'
import Products from '@/components/pages/Products'
import Orders from '@/components/pages/Orders'
import CustomerOrder from '@/components/pages/CustomerOrder'
import Coupons from '@/components/pages/Coupons'


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
            path: '/login',
            component: Login,
        },
        {
            name: 'Dashboard',
            path: '/admin',
            component: Dashboard,
            children: [
                {
                    name: 'Products',
                    path: 'products',
                    component: Products,
                    meta: { requiresAuth: true },
                },
                {
                    name: 'Orders',
                    path: 'orders',
                    component:Orders,
                    meta: { requiresAuth: true },
                },
                {
                    name: 'Coupons',
                    path: 'coupons',
                    component: Coupons,
                }
            ]
        },
        {
            name: 'Dashboard',
            path: '/',
            component: Dashboard,
            children: [
                {
                    name: 'CustomerOrder',
                    path: 'customer_order',
                    component: CustomerOrder,
                },
                
            ]
        },
    ]
})

