<template>
  <div class="app-body" v-loading="loading">
    <router-view :to="{name: 'layout'}"></router-view>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      loading: null
    }
  },
  created () {
    this.loading = false  
    if(location.hash.indexOf("access_token") !== -1){
      let urTokenKey = "access_token"
      let urlSliceIndex = location.hash.indexOf("access_token") + urTokenKey.length + 1
      let urlSliceEnd = location.hash.slice(urlSliceIndex).indexOf("&")
      let token =  location.hash.slice(urlSliceIndex).slice(0,urlSliceEnd)
      this.$store.commit("setUser",token)
    }
    // if(!localStorage.getItem("currentUser_token")){
    //    location.href = "http://192.168.1.75/api/redirect"
    // }
  }
}
</script>

<style>
body {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
  .app-body {
    position: relative;
    left: 0;
    top: 0;
    height: 100%;
  }
</style>
