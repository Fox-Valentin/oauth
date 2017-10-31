import Vuex from 'vuex'
import Vue from 'vue'
import loginStatus from './modules/loginStatus'
import adminTokenModule from './modules/adminTokenModule'
import adminPermissionModule from './modules/adminPermissionModule'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    loginStatus,
    adminTokenModule,
    adminPermissionModule
  }
})

