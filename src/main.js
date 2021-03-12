import Vue from 'vue'
import App from './App.vue'
import store from '@/store/index.js'
import VueRouter from 'vue-router'
import router from './router'
import ElementUI from 'element-ui';
import '@/assets/css/theme-chalk/index.css'
import '@/assets/css/theme-chalk/reset.css'

import interceptorsSetup from './api/interceptors'

interceptorsSetup()

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(ElementUI);

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
