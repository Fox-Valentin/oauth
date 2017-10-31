import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-default/reset.css'
import App from './App.vue'
import router from './route'
import Vueresource from 'vue-resource'
import store from './store'
Vue.use(ElementUI)
Vue.use(Vueresource)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    this.checkLogin();
  },
  methods: {
    checkLogin () {
      // 检查是否存在currentUser_token
      if(!localStorage.getItem("currentUser_token")){
        //如果没有登录状态则跳转到登录页
        this.$router.push('/login');
      } else {
        this.$router.push('/');
      }
    }
  }
})
