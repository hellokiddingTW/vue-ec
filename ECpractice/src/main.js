// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
 
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
})


router.beforeEach((to, from, next) => {
  console.log('to:',to,'from:',from,'next:',next)
  if(to.meta.requiresAuth){
    console.log('這裡需要驗證')
  }else{
    next()
  }
 
})