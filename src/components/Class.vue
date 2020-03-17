<template>
    <div class="class">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>分类管理</el-breadcrumb-item>
        </el-breadcrumb>
        
        <el-card>
            <el-col :span="6">
            <el-button type="primary" icon="el-icon-plus" @click="addClass=true">新增分类</el-button>
            </el-col>

        <el-table
            :data="classList"
            style="width: 100%"
            row-key="id"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
                type="selection"
                width="80">
            </el-table-column>
            <el-table-column
            label="分类名称"
            width="250">
                <template slot-scope="scope">
                    <el-tag size="medium">{{ scope.row.title }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
            label="是否显示"
            width="250">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="toChange(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
            label="描述信息"
            width="250">
                <template slot-scope="scope">
                    {{ scope.row.des }}
                </template>
            </el-table-column>
            <el-table-column
            label="操作"
            width="250">
            <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="toEdit(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="toDelete(scope.row)"></el-button>
            </template>
            </el-table-column>
        </el-table>
        </el-card>

        <!-- 添加分类 -->
        <el-dialog
            title="创建分类"
            :visible.sync="addClass"
            width="30%"
            >
            <el-form ref="addCate" :model="addCate" label-width="80px">
                <el-form-item label="商品大类">
                    <el-select v-model="addCate.pid" placeholder="请选择商品大类">
                    <el-option :label="item.title" :value="item.id" v-for="item in classList" :key="item.id"></el-option>
                    <el-option label="无" :value="0"></el-option>  
                    </el-select>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="addCate.title"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="addCate.des"></el-input>
                </el-form-item>
                <el-form-item label="是否上架">
                    <el-radio-group v-model="addCate.status">
                    <el-radio border label="是"></el-radio>
                    <el-radio border label="否"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAdd = false">取 消</el-button>
                <el-button type="primary" @click="confirmAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑商品 -->
        <el-dialog
            title="修改分类信息"
            :visible.sync="isEdit"
            width="30%"
            >
            <el-form ref="editNumber" :model="editNumber" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="editNumber.title"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="editNumber.des"></el-input>
                </el-form-item>
            </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="isEdit = false">取 消</el-button>
                <el-button type="primary" @click="confirmEdit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import { CLIENT_RENEG_LIMIT } from 'tls'
export default {
    data(){
        return{
            classList:[],
            isEdit:false,
            editNumber:{},
            addClass:false,
            addCate:{
                pid:0,
                title:'',
                ord:0,
                status:1,
                des:'',
            },
        }
    },
    methods:{
        //获取商品分类列表
        async getClassList(){
            let { data:res } = await this.$http.get('cate/list')
            let newres = res
            console.log(res)
            newres.map((item)=>{
                item.children.map(i=>{
                    i.status =  i.status===1 ? true : false;
                    return i;
                })
                item.status =  item.status===1 ? true : false
                return item
        })
        this.classList = newres
        },
        //添加分类
        async confirmAdd(){
            this.addCate.status= this.addCate.status=='是'?1:0
            let {data:res} = await this.$http.post('cate/store',this.addCate)
            if(res.status!==200) return this.$message.error("分类添加失败")
            this.$message.success("分类添加成功")
            this.getClassList()
            this.addCate={}
            this.addClass=false
        },
        //改变状态
        async toChange(val){
            let {id,status}=val
           // status=  status?1:0
            let {data:res} = await this.$http.post('cate/update_state',val)
            if(res.status!==200) return this.$message.error("状态修改失败")
            this.$message.success("状态修改成功")
            this.getClassList()
        },
        //删除分类
        async toDelete(val){
            this.$confirm('此操作将永久删除该商品分类, 是否继续?', '警告提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then( async () => {
                let {data:res} = await this.$http.post('/cate/delete',val)
                if(res.status!==200) return this.$message.error("该分类删除失败")
                this.$message.success("该分类删除成功")
                this.getClassList()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //修改分类信息
        toEdit(val){
            this.isEdit = true
            this.editNumber = val
        },
        //编辑修改请求
        async confirmEdit(){
            console.log(this.editNumber)
            let {data:res} = await this.$http.post('cate/update',this.editNumber)
            if(res.status!==200) return this.$message.error("编辑修改失败")
            this.$message.success("编辑修改成功")
            this.isEdit=false
            this.getClassList()
        },
    },
    created(val){
        this.getClassList()
    },

}
</script>

<style lang="less">
.el-breadcrumb{
    font-size: 14px;
}
</style>