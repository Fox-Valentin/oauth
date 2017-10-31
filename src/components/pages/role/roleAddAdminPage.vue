<template>
  <div>
      <v-breadcrumb :routerProp="routerProp"></v-breadcrumb>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <router-link :to="{path: '/roleAdminPage'}">
          <el-button type="primary">返回角色管理</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    <el-form ref="ruleForm" :model="form" label-width="80px" :rules="rules" style="width:400px;">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="选择站点" prop="website">
        <el-select v-model="optionValue" placeholder="请选择">
          <el-option
            v-for="client in clients" 
            :key="client.id"
            :label="client.name" 
            :value="client.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择权限">
        <div class="tree-wrap">
          <el-tree
            :data="dataTable"
            show-checkbox
            :default-expanded-keys="[0,1]"
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
          </el-tree>
        </div>
      </el-form-item>
      <div class="buttons">
        <el-button type="primary" @click="onSubmit('ruleForm')">立即创建</el-button>
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
      var validateWebsite = (rule, value, callback) => {
        if (!this.optionValue) {
          callback(new Error('请选择站点'))
        }else{
          callback();
        }
      }
      return {
      routerProp:[
        {
          lebal:'角色管理',
          path:'/roleAdminPage'
        },
        {
          lebal:'添加角色',
          path:'/roleAddAdminPage'
        },
      ],
        form: {
          name: '',
          desc: ''
        },
        clients: [],
        optionValue: '',
         dataTable:null,
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          website:[
           { validator: validateWebsite, trigger: 'change' }
          ],
          description:[
            { required: true, message: '请输入描述', trigger: 'blur' }
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
      })
      this.$http.get("http://192.168.1.75/admin/get_clients").then(
      (res)=>{
        console.log(res.data.data)
        this.clients = res.data.data
      },(err)=>{
          console.log(err)
      })
      this.$http.get("http://192.168.1.75/admin/rule").then(
      (res)=>{
       this.dataTable = this.__treeDataFormate(res.data)
        console.log(this.dataTable)
      },(err)=>{})
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
            console.log(11)
          if (valid) {
            Vue.http.interceptors.push(function(request, next) {
              var token = "Bearer " + localStorage.getItem("currentUser_token")
              request.headers.set('Authorization', token)
              request.headers.set('Accept', "application/json")
              next()
            });
            var params = {
              "name":this.form.name,
              "description":this.form.description,
              "permissions":this.$refs.tree.getCheckedKeys(),
              "client_id":this.optionValue
            }
            this.$http.post("http://192.168.1.75/admin/role",params).then(
            (res)=>{
              if(res.data.msg === "success"){
                this.$router.replace("/roleAdminPage")
              }
            },(err)=>{
                console.log(err)
            })
            
          } else {
            return false;
          }
        })
      },
      __treeDataFormate(ary){
        // 第一步 搜集所有的父id 确定树父级
              function setCidAry(ary){
                  var temp = []
                  var obj = {}
                  for(var i in ary){
                      temp.push(ary[i].pid)
                      ary[i]["children"] = []
                  }
                  //数组去重
                  temp = _.uniq(temp)
                  for(i in temp){
                      obj[temp[i]] = []
                  }
                  return obj
              }

              //第二步 根据搜集到的父id，对原始数据分层级
              function setLevelAry(cidary,ary){
                  for(var i in ary){
                      cidary[ary[i].pid].push(ary[i])
                  }
                  return cidary
              }
              //第三步 从分层数据开始，从后向前寻找对应的父节点，合并到父节点，并删除子节点
              function finalAry(levelAry,ary){
                    _.forInRight(levelAry,function(val,key){
                          for(var i in ary){
                                if(ary[i].id == key){
                                      for(var j in val){
                                            ary[i].children.push(val[j])
                                      }
                                }
                          }
                    })
                    var obj = []
                    for(var i in ary){
                        if(ary[i].pid === 0){
                          obj.push(ary[i])
                        }
                    }
                    return obj
              }
              var temp1 = setCidAry(ary)
              var temp2 = setLevelAry(temp1,ary)
              var temp3 = finalAry(temp2,ary)
              return temp3
        }
    }
  }
</script>
<style scoped>
  .tree-wrap{
    padding-bottom:24px;
  }
</style>
