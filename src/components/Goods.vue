<template>
    <div class="box_goods_cate">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <div class="box-card-hd">
                <el-button type="primary" round @click="goGoods"><i class="el-icon-plus"></i>新增商品</el-button>
                <div class="block">
                    <el-cascader
                        v-model="value"
                        :options="options"
                        :props="{ expandTrigger: 'hover' }"
                        @change="handleChange"></el-cascader>
                </div>
            </div>
            <el-table
                :data="goodsList"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                >
                <el-table-column
                    type="selection"
                    width="80">
                </el-table-column>
                <el-table-column
                label="分类名称"
                width="400">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                    <p>姓名: {{ scope.row.title }}</p>
                    <p>描述: {{ scope.row.description }}</p>
                    <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.title }}</el-tag>
                    </div>
                    </el-popover>
                </template>
                </el-table-column>
                <el-table-column
                label="库存"
                width="100">
                <template slot-scope="scope">
                    <el-tag size="medium">{{scope.row.review_count}}</el-tag>
                </template>
                </el-table-column>
                <el-table-column
                label="售出"
                width="100">
                <template slot-scope="scope">
                    <el-tag size="medium">{{scope.row.sold_count}}</el-tag>
                </template>
                </el-table-column>
                <el-table-column
                label="状态"
                width="200">
                    <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.on_sale"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="onChange(scope.row)">
                    </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)"></el-button>
                    <el-button type="success" icon="el-icon-s-goods" circle @click="handleSkus(scope.row)"></el-button>
                </template>
                </el-table-column>
            </el-table>
        </el-card>    
    </div>
</template>
<script>
export default {
    data() {
        return {
            pid:0,
            value:[],
            options:[],
            goodsList:[],
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        //请求3级商品列表
        async handleChange(value) {
            this.pid=value[1]
            let {data:res} = await this.$http.post("products/list",{pid:this.pid})
            this.goodsList=res.data
        },
        //请求商品列表
        async getCateList(){
            let {data:res} = await this.$http.get('cate/list')
            let newcateList= res
            newcateList.map(item=>{
                item.children.map(i=>{
                    i.label= i.title
                    i.value= i.id
                    i.disabled =  i.status===1 ? false : true;
                    return i;
                })
                item.label= item.title
                item.value= item.id
                item.disabled =  item.status===1 ? false : true;
                return item
            })
            this.options=res
        },
        //修改商品上架状态
        onChange(val){
            console.log(val)
        },
        //跳转到规格页面
        handleSkus(val){
            this.$router.push({
                path:'/goods_sku',
                query:{ id:val.id }
            })
        },
        //删除该商品
        handleDelete(id){
             this.$confirm('此操作将永久删除该商品规格, 是否继续?', '删除提示', {
                                                                        confirmButtonText: '确定',
                                                                        cancelButtonText: '取消',
                                                                        type: 'warning'
                                                                    }).then(async () => {
                                                                        let {data:res} = await this.$http.post('products/del',{id})
                                                                        if(res.status!==200) return this.$message.error('商品删除失败!') 
                                                                        let {data:r} = await this.$http.post("products/list",{pid:this.pid})
                                                                        this.goodsList=r.data
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
        //重新编辑商品跳转到编辑页面
        handleEdit(val){
            this.$router.push({
                path:'/goods_edit',
                query:{ id:val.id }
            })
        },
        //点击选中
        handleSelectionChange(val) {
            console.log(val)
        },
        //跳转到新增商品页面
        goGoods(){
            this.$router.push('/create_goods')
        },
        
    },
    // beforeRouteEnter(to, from, next){
    //     next((vm)=>{
    //         if(from.path=='/goodsDetail'){
    //             vm.$http.post('products/detail',{id:from.query.id}).then(res=>{
    //                                                                         vm.goodsList=res
    //                                                                     })
    //         }
    //     })
    // }    
}
</script>
<style lang="less" scoped>
.box_goods_cate{
    .box-card{
        .box-card-hd{
            display: flex;
            .el-button{
                margin-right: 50px;
            }
        }
    }

}
</style>