<template>
  <div>
      <v-breadcrumb :routerProp="routerProp"></v-breadcrumb>
  <el-form :inline="true" class="demo-form-inline">
    <el-form-item>
      <router-link :to="{path: '/userAddPage'}">
      <el-button type="primary">增加用户</el-button>
      </router-link>
    </el-form-item>
  </el-form>
  <el-table
    :data="tableData"
    border
    style="width: 100%"
    >
    <el-table-column
      label="ID"
      width="180"
      sortable
      prop="id"
      >
    </el-table-column>
    <el-table-column
      label="用户名"
      prop="name">
    </el-table-column>
    <el-table-column label="角色">
      <template scope="scope">
        <el-tag type="primary" v-for="role in scope.row.roles" :key="role.id">{{role.name}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="拥有站点">
      <template scope="scope">
        <el-tag type="primary" v-for="client in scope.row.clients" :key="client.id">{{client.name}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="邮箱"
      prop="email">
    </el-table-column>
    <el-table-column
      label=" 创建时间"
      prop="created_at">
    </el-table-column>
    <el-table-column
      label="更新时间"
      prop="updated_at">
    </el-table-column>
    <el-table-column label="操作">
      <template scope="scope">
        <el-button
          size="small"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-wrap">
    <el-pagination 
    @size-change="handleSizeChange" 
    @current-change="handleCurrentChange" 
    :current-page="page.current_page" 
    :page-sizes="[10,15, 25, 50, 100]" 
    :page-size="page.per_page" 
    layout="total, sizes, prev, pager, next, jumper" 
    :total="page.total">
    </el-pagination>
  </div>
  <el-dialog title="编辑用户" :visible.sync="dialogFormVisible">
      <el-form :model="row"  ref="form" :rules="rules">
        <el-form-item label="用户名称" :label-width="formLabelWidth"  prop="name">
          <el-input auto-complete="off"  v-model="row.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth"  prop="pass">
          <el-input auto-complete="off" type="password"  v-model="row.password"></el-input>
        </el-form-item>
        <el-form-item label="重复输入密码" :label-width="formLabelWidth"  prop="checkPass">
          <el-input auto-complete="off" type="password" v-model="row.checkPass"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" :label-width="formLabelWidth"  prop="email">
          <el-input auto-complete="off"  v-model="row.email"></el-input>
        </el-form-item>
        <el-form-item label="角色选择" :label-width="formLabelWidth" prop="roleList">
          <el-checkbox-group v-model="checkList" >
            <template v-for="roleList in checkLists">
                  <el-checkbox :label="roleList.id">{{roleList.name}}</el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="editSubmit('form')">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import Vue from "vue"
import _ from "lodash"
import vBreadcrumb from '@/layout/breadcrumb'
  export default {
    components: {
      vBreadcrumb
    },
    data() {
      var validatePass = (rule, value, callback) => {
          if (this.row.checkPass !== '') {
            this.$refs.form.validateField('checkPass');
          }
          callback();
      }
      var validatePass2 = (rule, value, callback) => {
        if (value !== this.row.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      var validatePass3 = (rule, value, callback) => {
        if(this.checkList.length == 0){
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
          }
        ],
        tableData: [],
        formLabelWidth: '120px',
        dialogFormVisible: false,
        row:{
          id:"",
          name:"",
          password:"",
          checkPass:"",
          email:""
        },
        checkList:[],
        checkLists:[],
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          email:[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          roleList:[
            { validator: validatePass3, trigger: 'change' }
          ],
          pass:[
              {validator: validatePass,trigger: 'blur'}
            ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
        page:{
          total:0,
          per_page:15,
          current_page:1
        }
      }
    }, 
    methods: {
      handleSizeChange(val) {
        this.page.per_page = val
        this.refreshTableWithPage(this.page.current_page,val)
      },
      handleCurrentChange(val) {
        this.page.current_page = val
        this.refreshTableWithPage(val,this.page.per_page)
      },
      handleEdit(index, row) {
        this.dialogFormVisible=true;
        this.row = row
        this.checkList = row.roles.map(ele => ele.id)
      },
      handleDelete(index, row) {
          this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var params = { _method: 'delete'}
            this.$http.post("http://192.168.1.75/admin/user/"+row.id,params).then(
              (res)=>{
                if(res.data.msg == "删除成功"){
                  this.refreshTableWithPage(this.current_page,this.per_page)
                  this.$message({
                    type: 'success',
                    message: res.data.msg
                  });
                }
              },
              (err)=>{})
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        },
      editSubmit(form){
        this.$refs[form].validate((valid) => {
            if (valid) {
                this.dialogFormVisible=false
                let params = {
                  _method: 'put',
                  name: this.row.name,
                  password: this.row.password,
                  email: this.row.email,
                  roles: this.checkList.join(",")
                }
              this.$http.post("http://192.168.1.75/admin/user/"+this.row.id,params).then(
                (res)=>{
                  if(res.data.msg=='更新成功'){
                      this.refreshTableWithPage(this.current_page,this.per_page)
                      this.$message({
                      message: '编辑保存成功',
                      type: 'success'
                    });
                  }
                },
                (err)=>{}
              )
            }else{
                return false
            }
          })
      },
      refreshTableWithPage(page,per_page){
        if(!per_page){
          per_page = 15
        }
        this.$http.post("http://192.168.1.75/admin/user/index?page="+page+"&per_page="+per_page).then(
          (res)=>{
            this.tableData = res.data.data.data
          },
          (err)=>{
            console.log(err)
          }
        )
      }
    },
    mounted () {
    Vue.http.interceptors.push(function(request, next) {
      var token = "Bearer " + this.$store.getters.getUserToken
      request.headers.set('Authorization', token)
      request.headers.set('Accept', "application/json")
      next()
    });
      this.$http.post("http://192.168.1.75/admin/user/index").then(
        (res)=>{
          this.page.total = res.data.data.total
          this.page.per_page = res.data.data.per_page
          this.page.current_page = res.data.data.current_page
          this.tableData = res.data.data.data
        },
        (err)=>{
          console.log(err)
        }
      )
      this.$http.post("http://192.168.1.75/admin/role/index").then(
      (res)=>{
        this.checkLists = res.data.data.data
      },(err)=>{
          console.log(err)
      });
    }
  }
</script>
<style scoped>
.pagination-wrap{
    text-align: right;
    margin-top: 20px;
}
</style>