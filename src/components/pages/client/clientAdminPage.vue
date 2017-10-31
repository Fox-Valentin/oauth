<template>
  <div>
      <v-breadcrumb :routerProp="routerProp"></v-breadcrumb>
  <el-form :inline="true" class="demo-form-inline">
    <el-form-item>
      <router-link :to="{path: '/clientAddPage'}">
      <el-button type="primary">增加站点</el-button>
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
      label="站点名称"
      prop="name">
    </el-table-column>
    <el-table-column
      label="定向地址"
      prop="redirect">
    </el-table-column>
    <el-table-column
      label="token"
      prop="secret">
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
  <el-dialog title="编辑站点" :visible.sync="dialogFormVisible"  size="tiny">
      <el-form :model="row"  ref="form" :rules="rules">
        <el-form-item label="站点名称" :label-width="formLabelWidth"  prop="name">
          <el-input auto-complete="off" v-model="row.name"></el-input>
        </el-form-item>
        <el-form-item label="定向地址" :label-width="formLabelWidth" prop="redirect">
          <el-input auto-complete="off" v-model="row.redirect"></el-input>
        </el-form-item>
      </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleEditSubmit('form')">确 定</el-button>
    </div>
  </el-dialog>
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
      return {
        routerProp:[
          {
            lebal:'站点管理',
            path:'/clientAdminPage'
          }
        ],
        tableData: [],
        formLabelWidth: '120px',
        dialogFormVisible: false,
        row:{
          id:null,
          name:"",
          redirect:""
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          redirect:[
           { required: true, message: '请输入地址', trigger: 'blur' }
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
        this.dialogFormVisible = true
        this.row = row
      },
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params = {
            id:row.id
          }
          this.$http.post("http://192.168.1.75/admin/delete_client",params).then(
            (res)=>{
                if(res.data.msg == "删除成功"){
                  this.refreshTableWithPage(this.page.current_page,this.page.per_page)
                  this.$message({
                    type: 'success',
                    message: res.data.msg
                  });
                }
            },
            (err)=>{}
          )
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      refreshTableWithPage(page,per_page){
        this.$http.get("http://192.168.1.75/admin/get_clients?page="+page+"&per_page="+per_page).then(
          (res)=>{
            this.tableData = res.data.data
          },
          (err)=>{
            console.log(err)
          }
        )
      },
      handleEditSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.dialogFormVisible = false
              var params = {
                id:this.row.id,
                name:this.row.name,
                redirect:this.row.redirect
              }
              this.$http.post("http://192.168.1.75/admin/update_client",params).then(
                (res)=>{
                  if(res.data.msg=='success'){
                      this.refreshTableWithPage(page,per_page);
                      this.$message({
                      message: '恭喜你，编辑保存成功',
                      type: 'success'
                    });
                  }
                },
                (err)=>{}
              )
          } else {
            return false;
          }
        });
        
      }
    },
    mounted () {
        Vue.http.interceptors.push(function(request, next) {
          var token = "Bearer " + this.$store.getters.getUserToken
          request.headers.set('Authorization', token)
          request.headers.set('Accept', "application/json")
          next()
        });
        this.$http.get("http://192.168.1.75/admin/get_clients").then(
          (res)=>{
            console.log(res.data)
          this.page.total = res.data.total
          this.page.per_page = res.data.per_page
          this.page.current_page = res.data.current_page
            this.tableData = res.data.data
          },
          (err)=>{
            console.log(err)
          }
        )
    }
  }
</script>
<style scoped>
.pagination-wrap{
    text-align: right;
    margin-top: 20px;
}
</style>