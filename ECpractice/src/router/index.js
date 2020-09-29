import Vue from 'vue'
import VueRouter from 'vue-router'



import Home from '@/components/HelloWorld'
import Login from '@/components/pages/Login'

Vue.use(VueRouter)

export default new VueRouter({
    routes:[
    {
      name:'首頁',
      path:'/',
      component:Home,
      meta: { requiresAuth: true },
    },
    {
      name:'Login',
      path:'/Login',
      component:Login,  
    }
  ]
})

