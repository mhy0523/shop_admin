<template>
    <div class="box_gs">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品规格管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <div class="box-card-hd">
                <el-button type="primary" round @click="dialogVisible=true"><i class="el-icon-plus"></i>新增规格</el-button>
                <el-col :span="3">
                <el-input
                    :placeholder="input"
                    :disabled="true">
                </el-input>
                </el-col>
            </div>
            <el-table
                :data="goodsSkus"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                >
                <el-table-column
                    type="selection"
                    width="80">
                </el-table-column>
                <el-table-column
                label="规格名称"
                width="250">
                <template slot-scope="scope">
                    <el-tag size="medium">{{ scope.row.title }}</el-tag>
                </template>
                </el-table-column>
                <el-table-column
                label="规格信息"
                width="300">
                <template slot-scope="scope">
                    <el-tag size="medium">{{scope.row.description}}</el-tag>
                </template>
                </el-table-column>
                <el-table-column
                label="库存"
                width="150">
                <template slot-scope="scope">
                    <el-tag size="medium">{{scope.row.stock}}</el-tag>
                </template>
                </el-table-column>
                <el-table-column
                label="价格"
                width="150">
                <template slot-scope="scope">
                    <el-tag size="medium">{{scope.row.price}}</el-tag>
                </template>
                </el-table-column>
                <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
                    
                    <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)"></el-button>
                </template>
                </el-table-column>
            </el-table>
        </el-card> 
        <!-- 添加规格 -->
         <el-dialog
            title="添加规格"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <el-form ref="form" :model="form" label-width="80px">
                <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="规格名称">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item label="规格描述">
                        <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="form.description">
                        </el-input>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="价格">
                        <el-input v-model="form.price"></el-input>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="库存">
                        <el-input v-model="form.stock"></el-input>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="24">
                <el-col :span="18">
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">立即发布</el-button>
                        <el-button @click="dialogVisible=false">取消</el-button>
                    </el-form-item>
                </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <!-- 修改规格   -->
        <el-dialog
            title="修改规格"
            :visible.sync="dialogEdit"
            width="30%"
            >
            <el-form ref="form" :model="formEdit" label-width="80px">
                <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="规格名称">
                        <el-input v-model="formEdit.title"></el-input>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item label="规格描述">
                        <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="formEdit.description">
                        </el-input>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="价格">
                        <el-input v-model="formEdit.price"></el-input>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="库存">
                        <el-input v-model="formEdit.stock"></el-input>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="24">
                <el-col :span="18">
                    <el-form-item>
                        <el-button type="primary" @click="onEdit">确认修改</el-button>
                        <el-button @click="dialogEdit=false">取消</el-button>
                    </el-form-item>
                </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            id:0,
            input:'111',
            goodsSkus:[],
            dialogVisible:false,
            dialogEdit:false,
            form:{},
            formEdit:{}
        }
    },
    created() {
        this.id = this.$route.query.id
        this.getGoodsSkus(this.id)
    },
    methods: {
        //确认修改
        async onEdit(){
            let {data:res} = await this.$http.post('sku/update',this.formEdit)
            if(res.status!==200) return this.$message.error("该规格修改失败")
            this.$message.success("该规格修改成功")
            this.dialogEdit=false
        },
        //弹出修改对话框
        handleEdit(obj){
            this.dialogEdit=true
            this.formEdit=obj
        },
        //删除规格
        handleDelete(id){
             this.$confirm('此操作将永久删除该条规格, 是否继续?', '删除提示', {
                                                                        confirmButtonText: '确定',
                                                                        cancelButtonText: '取消',
                                                                        type: 'warning'
                                                                    }).then(async () => {
                                                                        let {data:res} = await this.$http.post('sku/del',{id})
                                                                        if(res.status!==200) return this.$message.error("该规格删除失败")
                                                                        this.getGoodsSkus(this.id)
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
        //发布规格
        async onSubmit(){
            this.form.product_id=this.id
            console.log(this.form)
            let {data:res} = await this.$http.post('sku/add',this.form)
            if(res.status!==200) return this.$message.error("规格添加失败")
            this.$message.success("规格添加成功")
            this.getGoodsSkus(this.id)
            this.dialogVisible=false
        },
        //请求规格列表
        async getGoodsSkus(id){
            let {data:res} = await this.$http.post('product/skus',{id})
            this.goodsSkus=res.skus
        },
        //点击选中
        handleSelectionChange(val) {
            console.log(val)
        },
    },
}
</script>
<style lang="less" scoped>
.box_gs{
    
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