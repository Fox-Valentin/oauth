<template>
  <div>
      <v-breadcrumb :routerProp="routerProp"></v-breadcrumb>
  <el-form :inline="true" class="demo-form-inline">
    <el-form-item>
      <router-link :to="{path: '/roleAddAdminPage'}">
      <el-button type="primary">增加角色</el-button>
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
      label="角色名称"
      prop="name">
    </el-table-column>
    <el-table-column
      label="角色描述"
      prop="description">
    </el-table-column>
    <el-table-column
      label="站点"
      prop="client_id">
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
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
  <el-dialog title="角色编辑" :visible.sync="dialogFormVisible" size="tiny">
    <el-form :model="row" ref="form" :rules="rules" style="height: 550px; width: 500px;">
      <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="row.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" :label-width="formLabelWidth" prop="description">
        <el-input type="textarea" v-model="row.description" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="所属站点" :label-width="formLabelWidth">
        <el-select v-model="row.client_id" placeholder="请选择站点">
            <el-option 
            v-for="client in clients" 
            :key="client.id"
            :label="client.name" 
            :value="client.id"
            ></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="选择权限"  :label-width="formLabelWidth" >
            <el-tree
              style="height:360px; overflow-y: scroll;"
              :data="dataTableTree"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="tree"
              highlight-current
              :props="defaultProps">
            </el-tree>
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
import _ from "lodash"
import vBreadcrumb from '@/layout/breadcrumb'
  export default {
    components: {
      vBreadcrumb
    },
    data() {
      var validateCheckList = (rule, value, callback)=>{
        console.log(this.$refs.tree.getCheckedKeys().length)
        if(this.$refs.tree.getCheckedKeys().length === 0){
          callback(new Error('请选择权限'));
        }
      }
      return {
      routerProp:[
          {
            lebal:'角色管理',
            path:'/roleAdminPage'
          }
        ],
        tableData: [],
        dialogFormVisible: false,
        formLabelWidth: '120px',
        row:{
          name:'',
          description:'',
          client_id:''
        },
        permissions:[],
        clients:[],
        dataTableTree:[],
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        rules:{
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          description:[
            { required: true, message: '请输入描述', trigger: 'blur' }
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
        console.log(val,this.page.per_page)
        this.refreshTableWithPage(val,this.page.per_page)
      },
      setCheckedKeys() {
        this.$refs.tree.setCheckedKeys([])
        this.$refs.tree.setCheckedKeys(this.row.permissions.map(ele => ele.id));
      },
      handleEdit(index, row) {
        this.dialogFormVisible=true;
        this.row = row;
        var _this = this
        setTimeout(function(){
          _this.setCheckedKeys()
        },100)
      },
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params = { _method: 'delete'}
          this.$http.post("http://192.168.1.75/admin/role/"+row.client_id,params).then(
            (res)=>{
                if(res.data.msg === "删除成功"){
                  this.refreshTableWithPage(this.page.current_page,this.page.per_page)
                  this.$message({
                    type: 'success',
                    message: res.data.msg
                  });
                }
            },
            (err)=>{}
            )
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      handleEditSubmit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false;
            let paramData = {
              _method: 'put',
              client_id: this.row.client_id,
              name: this.row.name,
              description: this.row.description,
              permissions: this.$refs.tree.getCheckedKeys()
            }
            this.$http.post("http://192.168.1.75/admin/role/"+this.row.id, paramData).then(
              (res)=>{
                  if(res.data.msg=='success'){
                      this.refreshTableWithPage(this.page.current_page,this.page.per_page);
                      this.$message({
                      message: '恭喜你，编辑保存成功',
                      type: 'success'
                    });
                  }
              },(err)=>{
                  console.log(err)
              })

          } else {
            return false;
          }
        });
        },
        refreshTableWithPage(page,per_page){
          this.$http.post("http://192.168.1.75/admin/role/index?page="+page+"&per_page="+per_page).then(
          (res)=>{
            this.$store.commit("upadtegetAdminTableData",res.data.data.data)
            this.tableData = this.$store.getters.getAdminTableData
          },(err)=>{
              console.log(err)
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
    },
    mounted () {
      Vue.http.interceptors.push(function(request, next) {
        var token = "Bearer " + this.$store.getters.getUserToken
        request.headers.set('Authorization', token)
        request.headers.set('Accept', "application/json")
        next()
      });
         this.$http.get("http://192.168.1.75/admin/rule").then(
      (res)=>{
        console.log(res.data)
        this.dataTableTree = this.__treeDataFormate(res.data)
      },(err)=>{
          console.log(err)
      });
       this.$http.get("http://192.168.1.75/admin/get_clients").then(
      (res)=>{
        this.clients = res.data.data
      },(err)=>{
          console.log(err)
      });
      this.$http.post("http://192.168.1.75/admin/role/index").then(
      (res)=>{
        this.$store.commit("upadtegetAdminTableData",res.data.data.data)
          this.page.total = res.data.data.total
          this.page.per_page = res.data.data.per_page
          this.page.current_page = res.data.data.current_page
        this.tableData = this.$store.getters.getAdminTableData
      },(err)=>{
          console.log(err)
      })
    }
  }
</script>
<style scoped>
.pagination-wrap{
    text-align: right;
    margin-top: 20px;
}
</style>