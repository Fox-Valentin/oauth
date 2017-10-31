<template>
  <div>
    <v-breadcrumb :routerProp="routerProp"></v-breadcrumb>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <router-link :to="{path: '/clientAdminPage'}">
          <el-button type="primary">返回站点管理</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="站点名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="定向地址" prop="website">
        <el-input v-model="form.redirect"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Vue from "vue"
import vBreadcrumb from '@/layout/breadcrumb'
  export default {
    components: {
      vBreadcrumb
    },
    data() {
      var validatePass1 = (rule, value, callback) => {
          if(!this.form.redirect){
            callback(new Error('请输入定向地址'));
          }else{
            callback();
          }
      }
      return {
        routerProp:[
          {
            lebal:'站点管理',
            path:'/clientAdminPage'
          },
          {
            lebal:'添加站点',
            path:'/clientAddPage'
          },
        ],
        form: {
          name: '',
          description: ''
        },
        options: [],
        optionValue: '',
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          website:[
           { validator: validatePass1, required: true, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                Vue.http.interceptors.push(function(request, next) {
                  var token = "Bearer " + localStorage.getItem("currentUser_token")
                  request.headers.set('Authorization', token)
                  request.headers.set('Accept', "application/json")
                  next()
                });
                var params = {
                  name:this.form.name,
                  redirect:this.form.redirect
                }
                this.$http.post("http://192.168.1.75/admin/add_client",params).then(
                (res)=>{
                  console.log(res.data)
                  if(res.data.msg === "添加成功"){
                    this.$router.replace("/clientAdminPage")
                  }
                },(err)=>{
                    console.log(err)
                })

            } else {
              console.log('error submit!!');
              return false;
            }
        })
      }
    }
  }
</script>
<style scoped>
</style>
