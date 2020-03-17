<template>
    <div class="box_goods">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>创建商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-alert
                title="基本信息"
                type="info"
                :closable="false">
            </el-alert>
            <el-form ref="form" :model="addGoodsForm" label-width="80px">
                <el-row>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="商品分类">
                            <el-select v-model="form.num" placeholder="请选择大类">
                                <el-option :label="item.title" :value="index" v-for="(item,index) in cateList" :key="item.id"></el-option>
                            </el-select>
                            <el-select v-model="addGoodsForm.pid" placeholder="请选择子类">
                                <el-option :label="i.title" :value="i.id" v-for="i in cateLists" :key="i.id" ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="商品名称">
                            <el-input v-model="addGoodsForm.title"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="商品描述">
                            <el-input type="textarea" v-model="addGoodsForm.description"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="上传图片">
                            <el-upload
                                ref="upload"
                                :http-request="upLoad"
                                action="house/upload"
                                list-type="picture-card"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove"
                                :auto-upload="false"
                                :limit="6"
                                multiple>
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" :offset="6">
                        <el-form-item label="是否上架" prop="resource">
                            <el-radio-group v-model="addGoodsForm.on_sale">
                            <el-radio label="上架"></el-radio>
                            <el-radio label="下架"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" :offset="6">
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">立即创建</el-button>
                            <el-button>重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>    
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            cateList:[],
            cateLists:[],
            form:{},
            formData:{},
            addGoodsForm:{
                title:'',
                description:'',
                on_sale:0
            },
            ruleForm:{
                resource:''
            },
            dialogImageUrl: '',
            dialogVisible: false,
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        
        upLoad(file){
            console.log(file.file)
            this.formData.append("pic[]",file.file)
        },
        handlePictureCardPreview(file){
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleRemove(){},

        async onSubmit(){
            this.formData= new FormData()
            this.$refs.upload.submit()
            this.addGoodsForm.on_sale = this.addGoodsForm.on_sale=='上架'?1:0
            console.log(this.addGoodsForm)
            this.formData.append("form",JSON.stringify(this.addGoodsForm));
            let {data:res}=await this.$http.post('products/store',this.formData)
            if(res.meta.status!==200) return this.$message.error('商品发布失败') 
            this.$message.success(res.meta.msg)
            this.$router.push({
                path:'/goods'
            })
        },
        //请求商品列表
        async getCateList(){
            let {data:res} = await this.$http.get('cate/list')
            this.cateList=res
        },
    },
    updated() {
        this.cateLists= this.cateList[this.form.num]?this.cateList[this.form.num].children:''
    },
}
</script>
<style lang="less">
.box_goods{
    .box-card{
        .el-alert{
            margin-bottom: 100px;
        }
        .el-select{
            margin-right: 20px;
        }
    }
    textarea{
        height: 200px!important;
    }
}
</style>