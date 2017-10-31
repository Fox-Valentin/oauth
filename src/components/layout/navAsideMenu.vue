<template>
    <el-col :span="4" class="nav-aside-wrapper">
      <el-menu :default-active="active" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <router-link :to="{path : '/roleAdminPage'}"><el-menu-item index="1"><i class="el-icon-star-on"></i>角色管理</el-menu-item></router-link>
        <router-link :to="{path: '/userAdminPage'}"><el-menu-item index="2"><i class="el-icon-star-off"></i>用户管理</el-menu-item></router-link>
        <router-link :to="{path: '/clientAdminPage'}"><el-menu-item index="3"><i class="el-icon-menu"></i>站点管理</el-menu-item></router-link>
        <router-link :to="{path: '/permissionAdminPage'}"><el-menu-item index="4"><i class="el-icon-setting"></i>权限管理</el-menu-item></router-link>
      </el-menu>
    </el-col>
</template>
<script>
export default {
    data(){
      return {
        active:null
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },
    mounted () {
      switch(this.$router.currentRoute.path){
        case "/roleAdminPage":
        this.active = "1" 
        return;
        case "/userAdminPage":
        this.active = "2" 
        return;
        case "/clientAdminPage":
        this.active = "3" 
        return;
        case "/permissionAdminPage":
        this.active = "4" 
        return;
        default:
        this.active = null 
        ;
      }
    }
}
</script>
<style scoped>
  .nav-aside-wrapper {
    background-color: #eef1f6;
    height: 100%;
  }
</style>
