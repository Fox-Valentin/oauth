<template>
  <div class="header">
    <el-row :gutter="20">
      <el-col :span="6"  :offset="20">
        <div class="grid-content">
          <el-row :gutter="20">
            <el-col :span="9" >
              <div class="grid-content">
                <div>用户名: {{user_name}}</div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">
                <el-button type="text" class="headerLink" @click="logout">退出</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      user_name: ''
    }
  },
  methods: {
    logout(){
      this.$confirm('确定注销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem("currentUser_token")
        this.$router.push('/login');
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消注销'
        })
      })
    }
  },
  created: function () {
    this.user_name = localStorage.getItem("user_name")
  }
}
</script>
<style scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple {
    background: #d3dce6;
  }
.header{
      height: 60px;
    background-color: #20a0ff;
    color: #fff;
    top: 0;
    left: 0;
    width: 100%;
    line-height: 60px;
    z-index: 100;
    position: absolute;
}
.headerLink{
      height: 60px;
    box-sizing: border-box;
    width: 100%;
    color:#FFFFFF;
}
.headerLink:hover{
      height: 60px;
    box-sizing: border-box;
    width: 100%;
    color:#D3DCE6;
}
</style>
