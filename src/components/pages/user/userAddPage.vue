<template>
  <div>
    <v-breadcrumb :routerProp="routerProp"></v-breadcrumb>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <router-link :to="{path: '/userAdminPage'}">
          <el-button type="primary">返回用户管理</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="用户名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="用户密码"  prop="pass">
        <el-input v-model="form.pass" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="form.checkPass" type="password"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="选择角色" prop="type">
        <el-checkbox-group v-model="form.checkList" >
          <el-checkbox v-for="item in checkListData" :key="item" :label="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
      </el-form-item>
      <div>
        {{form.checkList}}
      </div>
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
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.checkPass !== '') {
            this.$refs.form.validateField('checkPass');
          }
          callback();
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.checkPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      var validatePass3 = (rule, value, callback) => {
          if(this.form.checkList.length == 0){
            callback(new Error('请选择角色'));
          }else{
            callback();
          }
      }
      return {
        routerProp:[
          {
            lebal:'用户管理',
            path:'/userAdminPage'
          },
          {
            lebal:'添加用户',
            path:'/userAddPage'
          },
        ],
        data:[],
        form: {
          name: '',
          pass: '',
          checkPass:"",
          checkList: [],
          email: ''
        },
        checkListData:[],
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          email:[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          type:[
            { validator: validatePass3, trigger: 'change' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      Vue.http.interceptors.push(function(request, next) {
        var token = "Bearer " + localStorage.getItem("currentUser_token")
        request.headers.set('Authorization', token)
        request.headers.set('Accept', "application/json")
        next()
      });
      this.$http.post("http://192.168.1.75/admin/role/index").then(
      (res)=>{
        this.checkListData = res.data.data.data
      },(err)=>{
          console.log(err)
      })
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
                password:this.form.pass,
                email:this.form.email,
                roles:this.form.checkList.join(",")
              }
              this.$http.post("http://192.168.1.75/admin/user",params).then(
              (res)=>{
                if(res.data.msg === "success"){
                  this.$router.replace("/userAdminPage")
                }
              },(err)=>{
                  console.log(err)
              })
          } else {
              return false;
            }
          })
      }
    }
  }
</script>
