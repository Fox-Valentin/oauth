<template>
  <div class="login-wrap">
    <el-row type="flex" class="row-bg" justify="center" align="middle">
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="用户名">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="form.pwd"></el-input>
              </el-form-item>
              <el-form-item class="button-wrap">
                <el-button type="primary" @click="login"  size="large">登录</el-button>
                <el-button  @click="reset" size="large">重置</el-button>
              </el-form-item>
          </el-form>
        </div>
        </el-col>
    </el-row>
    <div>{{ isLogin }}</div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        name: '',
        pwd: ''
      },
      isLogin: null
    }
  },
  methods: {
    login () {
      this.$http.post('http://192.168.1.75/oauth/token', {
        grant_type: 'password',
        client_id: 2,
        client_secret: 'XgxZOsMxTvBudPoyncNWNzDMkwJeDw5pMGCZTxEZ',
        username: this.form.name, //'111245@qq.com',
        password: this.form.pwd, //'123456',
        scope: ''
      }).then((res) => {
        localStorage.setItem("currentUser_token", res.data.access_token)
        localStorage.setItem("user_name", this.form.name)

        this.getRules()
        this.$router.push('/');
        }, (err) => {
          console.log(err)
          this.$message('用户名或者密码错误')
        })
    },
    getRules () {
      this.$http.get('http://192.168.1.75/api/get_rules').then((res)=> {
        localStorage.setItem("rules", res.data)
      })
    },
    reset () {
      this.form.name = ''
      this.form.pwd = ''
    }
  },
  mounted () {
    this.isLogin = this.$store.getters.getLoginState
  }
}
</script>
<style scoped>
  .login-wrap{
    background-color: #E5E9F2;
    height: 100%;
  }
  .el-row {
    height: 100%;
  }
  .button-wrap{
    text-align: center;
  }

</style>
