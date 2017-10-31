<template>
    <el-breadcrumb separator="/" class="breadcrumb-wrapper">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in routerProp" :key="item.id" :to="{ path: item.path }">{{ item.lebal }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
export default {
  mounted(){
  },
  props:["routerProp"],
  data(){
    return {
      
    }
  }
}
</script>
<style scoped>
  .breadcrumb-wrapper{
    padding-bottom:24px;
  }
</style>
