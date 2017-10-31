  <template>
    <div >
      <v-breadcrumb :routerProp="routerProp"></v-breadcrumb>

      <el-button type="primary" @click="appendDialog()">增加权限</el-button>

      <!--<el-tree-->
        <!--:data="dataTable"-->
        <!--default-expand-all-->
        <!--node-key="id"-->
        <!--ref="tree"-->
        <!--highlight-current-->
        <!--:props="defaultProps"-->
        <!--:expand-on-click-node="false"-->
        <!--:render-content="renderContent"-->
        <!--&gt;-->
      <!--</el-tree>-->
        <el-table
                ref="multipleTable"
                :data="tableData"
                border
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="">
          <el-table-column
                  type="selection"
                  width="55">
          </el-table-column>
          <el-table-column
                  label="父节点"
                  prop="p_title">
          </el-table-column>
          <el-table-column
                  label="显示名"
                  prop="title">
          </el-table-column>
          <el-table-column
                  prop="name"
                  label="名称">
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


      <el-dialog title="增加权限" :visible.sync="dialogFormVisibleAppend" size="tiny">
        <!--<el-form :model="formAppend" ref="form1" :rules="rules">-->
          <!--<el-form-item label="权限名称" :label-width="formLabelWidth" prop="name">-->
            <!--<el-input v-model="formAppend.name" auto-complete="off"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="权限描述" :label-width="formLabelWidth" prop="description">-->
            <!--<el-input type="textarea" v-model="formAppend.description" auto-complete="off"></el-input>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
        <div class="m-l-50 m-t-30 w-500">
          <el-form ref="form" :model="form" :rules="rules" label-width="110px">
            <el-form-item label="显示名" prop="title" style="width: 320px;">
              <el-input v-model.trim="form.title" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name" style="width: 320px;">
              <el-input v-model.trim="form.name" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="节点类型" prop="level">
              <el-radio-group v-model="form.level">
                <el-radio label="1">项目</el-radio>
                <el-radio label="2">模块</el-radio>
                <el-radio label="3">操作</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="父节点" prop="pid">
              <el-select v-model="form.pid" placeholder="父节点" class="w-200">
                <el-option v-for="item in options" :key="item.id" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="add('form')" :loading="isLoading">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      
      <el-dialog title="编辑权限" :visible.sync="dialogFormVisibleEdit" size="tiny">
        <el-form :model="formEdit" ref="form1" :rules="rules">
          <el-form-item label="权限显示名" :label-width="formLabelWidth" prop="else">
            <el-input v-model="formEdit.else" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formEdit.name" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="subEdit('form1')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import _ from 'lodash'
import Vue from "vue"
import vBreadcrumb from '@/layout/breadcrumb'
  export default {
    components: {
      vBreadcrumb
    },
    data() {
      return {
        tableData: [],
        isLoading: false,
        form: {
          title: '',
          name: '',
          pid: null,
          level: '1'
        },
        options: [{id: 0, title: '根节点'}],
        routerProp: [
          {
            lebal: '权限管理',
            path: '/permissionAdminPage'
          }
        ],
        dataTable: null,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        formAppend: {
          name: '',
          description: ""
        },
        formEdit: {
          name: '',
          else: '',
          id: 0
        },
        tempFormData: {
          data: "",
          store: ""
        },
        formLabelWidth: '120px',
        lastId: null,
        dialogFormVisibleAppend: false,
        dialogFormVisibleEdit: false,
        data: "",
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入描述', trigger: 'blur'}
          ]
        }
      };
    },
    mounted () {
      // this.$store.dispatch("getpermissionlist").then(()=>{
      //   this.dataTable = this.$store.getters.getAdminTableData
      // })
      Vue.http.interceptors.push(function (request, next) {
        var token = "Bearer " + this.$store.getters.getUserToken
        request.headers.set('Authorization', token)
        request.headers.set('Accept', "application/json")
        next()
      })
    },
    methods: {
      updateDataTable(){
        this.$http.get("http://192.168.1.75/admin/rule").then(
          (res) => {
            this.dataTable = this.__treeDataFormate(res.data)
          }, (err) => {
          })
      },
      appendDialog() {
        this.dialogFormVisibleAppend = true
      },
      subEdit (form) {
        const params = {
          name: this.formEdit.name,
          title: this.formEdit.else,
          _method: 'PUT'
        }
        this.$http.post("http://192.168.1.75/admin/rule/"+this.formEdit.id, params).then((response) => {
          if (response.data == '1' ){
            this.dialogFormVisibleEdit = false
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
          }
        })
      },
      handleDelete (store, data) {
        let params = {
          _method: "delete"
        }
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('http://192.168.1.75/admin/rule/' + data.id, params).then((res) => {
            if (res.data === '1') {
              this.updateDataTable();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          }, (err) => {
            console.log(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleEdit (store, data) {
        this.dialogFormVisibleEdit = true
//        this.tempFormData.store = store
//        this.tempFormData.data = data
        this.formEdit = {
          else: data.else,
          id: data.id,
          name: data.name
        }
        console.log(data)
      },
      add () {
        this.$http.get("http://192.168.1.75/admin/store", {
          params: this.form
        })
      }
    },
    created: function () {
      this.$http.get("http://192.168.1.75/admin/rule").then((res) => {
        this.tableData = res.data
        res.data.forEach((ret) => {
          if (ret.level != 3) {
            this.options.push(ret)
          }
        })
      })
    }
  }
</script>
<style scoped>

</style>
