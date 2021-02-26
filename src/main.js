import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import ElementUI from 'element-ui';
import { Table } from 'element-ui';
import { Switch  } from 'element-ui';
import { MessageBox } from 'element-ui';
import '@/assets/css/theme-chalk/index.css'
import '@/assets/css/theme-chalk/reset.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import 'element-ui/lib/theme-chalk/index.css'



library.add(far, fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component(MessageBox.name, MessageBox)
Vue.config.productionTip = false
Vue.use(Table)
Vue.use(VueRouter)
Vue.use(Switch)
Vue.use(ElementUI)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
