<template>
  <div class="layout-wrapper">
    <v-header></v-header>
    <el-row class="tac nav-wrapper">
      <v-nav-aside-menu></v-nav-aside-menu>
      <v-content></v-content>
    </el-row>
  </div>
</template>
<script>
import Vue from "vue"
import vHeader from '@/layout/header'
import vNavAsideMenu from '@/layout/navAsideMenu'
import vContent from '@/layout/content'
export default {
  components: {
    vHeader,
    vContent,
    vNavAsideMenu
  },
  mounted (){
    Vue.http.interceptors.push(function(request, next) {
      var token = "Bearer " + this.$store.getters.getUserToken
      request.headers.set('Authorization', token)
      request.headers.set('Accept', "application/json")
      next()
    });
  },
  methods: {
    
  }
}
</script>
<style scoped>
  .nav-wrapper {
    padding-top: 60px;
    height: 100%;
  }
  .layout-wrapper {
    position: relative;
    height: 100%;
  }
</style>
