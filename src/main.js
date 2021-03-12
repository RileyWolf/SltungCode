import Vue from 'vue'
import App from './App.vue'
import store from '@/store/index.js'
import VueRouter from 'vue-router'
import router from './router'
import ElementUI from 'element-ui';
import { Icon} from 'element-ui';
import { Input} from 'element-ui';
import { DatePicker} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/theme-chalk/index.css'
import '@/assets/css/theme-chalk/reset.css'

import interceptorsSetup from './api/interceptors'

interceptorsSetup()

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(ElementUI);
Vue.use(Icon);
Vue.use(Input);
Vue.use(DatePicker);


new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
