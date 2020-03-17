<template>
    <div class="box_gd">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
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
                                :file-list="fileList"
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
                            <el-button type="primary" @click="onSubmit">确认修改</el-button>
                            <el-button @click='onReset'>重置</el-button>
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
            id:0,
            cateList:[],
            cateLists:[],
            form:{},
            formData:{},
            fileList:[],
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
        this.id = this.$route.query.id
        this.getGoodsDetail(this.id)
    },
    methods: {
        //准备图片数据
        upLoad(file){
            this.formData.append("pic[]",file.file)
        },
        handlePictureCardPreview(file){
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        async handleRemove(file){
            let {data:res}=await this.$http.post('products/del_img',{id:this.id,img:file.url})
            if(res.meta.status!==200) return this.$message.error('商品更新失败!') 
            this.$message.success(res.meta.msg)
            this.getGoodsDetail(this.id)
        },
        //确认修改
        async onSubmit(){
            this.formData= new FormData()
            this.$refs.upload.submit()
            this.addGoodsForm.on_sale = this.addGoodsForm.on_sale=='上架'?1:0
            this.formData.append("form",JSON.stringify(this.addGoodsForm));
            let {data:res}=await this.$http.post('products/update',this.formData)
            if(res.meta.status!==200) return this.$message.error('商品更新失败!') 
            this.$message.success(res.meta.msg)
            this.$router.push({
                path:'/goods',
            })
        },
        //重置
        onReset(){
            this.getGoodsDetail(this.id)
        },
        //请求商品详情
        async getGoodsDetail(id){
            let arr=[]
            let {data:res} = await this.$http.post('products/detail',{id})
            let {image,...goods} = res
            image.map(item=>{
                let obj={}
                obj.url=item
                arr.push(obj)
                this.fileList=arr
            })
            goods.on_sale= goods.on_sale==true?'上架':'下架'
            this.addGoodsForm=goods
        },
    },
    updated() {
        // this.cateLists= this.cateList[this.form.num]?this.cateList[this.form.num].children:''
    },
}
</script>
<style lang="less">
.box_gd{
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