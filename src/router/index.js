import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Class from '../components/Class.vue'
import Goods from '../components/Goods.vue'
import CreateGoods from '../components/CreateGoods.vue'
import GoodsDetail from '../components/GoodsDetail.vue'
import GoodsEdit from '../components/GoodsEdit.vue'
import GoodsSku from '../components/GoodsSku.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children:[
      {path:'/',component:Class},
      {path:'/class',component:Class},
      {path:'/goods',component:Goods},
      {path:'/create_goods',component:CreateGoods},
      {path:'/goods_detail',component:GoodsDetail},
      {path:'/goods_edit',component:GoodsEdit},
      {path:'/goods_sku',component:GoodsSku},
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{

  if(to.path=='/login') return next();
  const tokenStr =window.sessionStorage.getItem('token')

  if(!tokenStr){
    return next('/login')
  }

  next()
  
})

export default router
