<template>
  <div class="login_container">
    <div class="login_box">

     <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
  
      <!-- 登录表单区域 -->
      <el-form
        ref = "loginFormRef"
        :model="form"
       :rules="rules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="name">
          <el-input v-model="form.name" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click='login'>登录</el-button>
          <el-button type="info" @click='dialogFormVisible = true'>注册</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="注册" :visible.sync="dialogFormVisible">
        <el-form ref = "addUserFormRef" :model="registerForm" label-width="80px" :rules="registerRuse" >
            <el-form-item label="账户名"  prop="name">
                <el-input v-model="registerForm.name"></el-input>
            </el-form-item>
            <el-form-item label="邮箱"  prop="email">
                <el-input v-model="registerForm.email"></el-input>
            </el-form-item>
            <el-form-item label="密码"  prop="password">
                <el-input v-model="registerForm.password" type="password"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="register">确 定</el-button>
        </div>
        </el-dialog>

  </div>
</template>

<script>

export default {
  data() {
    let checkEmail= (rule,value,cb)=>{
            const regEmail = /^\w+@\w+(\.\w+)+$/
            if(regEmail.test(value)){
                return cb()
            }
            return cb(new Error('请输入合法邮箱'))
        }
    return {
      // 这是登录表单的数据绑定对象
      form: {
        name: '',
        password: '',
      },
      dialogFormVisible:false,
      registerForm:{
        name: '',
        password: '',
        email:''
      },
      rules:{
          name:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
          ],
      },
      registerRuse:{
          name:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ],
            email:[
              { required: true, message: '请输入邮箱', trigger: 'blur' },
              { validator:checkEmail, trigger: 'blur' }
            ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
          ],
      }
     
  }
  },
  created() {
    this.form.name=this.$route.query.name
  },
  methods:{
    login(){

      // 登录预验证
      this.$refs.loginFormRef.validate(async (bool,obj)=>{
          if(!bool) return console.log('用户名或密码错误');
          
          let { data:res } = await this.$http.post("user/login",this.form);
          if(res.meta.status !==200 ) return this.$message.error('账户或密码错误');
          console.log()
          window.sessionStorage.setItem('token',res.data.api_token)
          this.$message.success('登录成功！')
          this.$router.push('/')
      });
    },
    async register(){
      this.$refs.addUserFormRef.validate(async bool=>{
        if(!bool) return this.$message.error('请输入完整的用户信息')
        let {data:res}=await this.$http.post('user/register',this.registerForm)
        if(res.meta.status!==201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.dialogFormVisible = false

        this.$router.push({
        path:'/login',
          query:{
            name:this.registerForm.name
          }
        })
      })
    },
    // async register(){
    //     this.dialogFormVisible = false
    //     let { data:res } = await this.$http.post('user/register',this.registerForm);
    // },

    open(){

    },
  }

}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    display:flex;
    justify-content:center;
    align-items:center;
    img {
      width: 80%;
      height: 80%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

</style>
