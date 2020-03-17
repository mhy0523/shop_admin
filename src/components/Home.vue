<template>
  <div class="home-container">
     <el-container>
        <el-header height="80px">
          <div class="main">
            <img src="../assets/logo.png" class="img">
            <span>欢迎登陆猪小哼后台管理系统</span>
          </div>
          <div class="user">
           <div><img src="../assets/usericon.png" alt="" class="usericon"></div>
          <el-button type="primary" @click="logout">退出</el-button>
          </div>
        </el-header>
        <el-container>
          <el-aside :width= 'isCollapse? "64px":"200px"'>
            <el-menu
              router
              :collapse-transition=false
              :collapse="isCollapse"
              :default-active="activePath"
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
              <div class="toggle_btn" @click="activeCollapse">|||</div>
              <el-menu-item index="/class" @click="saveActivPath('/class')">
                  <i class="el-icon-menu"></i>
                  <span slot="title">分类管理</span>
              </el-menu-item>
              <el-menu-item index="/goods" @click="saveActivPath('/goods')">
                  <i class="el-icon-s-goods"></i>
                  <span slot="title">商品管理</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main>
          <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
  </div>
</template>

<script>
export default {
  name:'home',
  data(){
    return{
      userIcon:'',
      isCollapse:false,
      index:'/class',
      activePath:'/users',
    }
  },
  created(){
    this.activePath = sessionStorage.getItem('activePath') ? sessionStorage.getItem('activePath') :'/class';
  },
  methods:{
    saveActivPath(activePath){
       sessionStorage.setItem("activePath",activePath);
       this.activePath = activePath;
    },
    logout(){
      window.sessionStorage.removeItem('token')
      this.$message.success('退出登陆成功')
      this.$router.push('/login')
    },
    activeCollapse(){
      this.isCollapse = ! this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.user{
  display: flex;
  .usericon{
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-right: 20px;
    border-radius: 50%;
  }
}

.home-container,.el-container{
  height: 100%
}
element.style {
    height: 60px;
}
.el-header{
  background: #383d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .main{
    display: flex;
    color: #888;
    align-items: center;
    .img{
      width: 40px;
      height: 40px;
      border:2px solid #888;
      border-radius: 50%;
      padding:5px;
      margin-right: 10px; 
    }
    span{
      font-size: 16px
    }
  }
}
.el-button{
  width: 120px;
  height:40px;
  background: #f3f3f3;
  color: black;
  font-size: 16px;
  border:#afafaf 1px solid;

}
.el-container{

  .el-aside{
    background: #343743;
  }
  .el-main{
    background: #ebedf1;
  }
}
.el-menu{
  border-right: none
}
.toggle_btn{
  height: 40px;
  background-color: #4b5063;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
</style>

