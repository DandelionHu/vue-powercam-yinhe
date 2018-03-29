<template>
    <el-row class="service-Wrapper">
        <el-tabs type="border-card">
            <el-tab-pane label="个人信息">
                <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="姓名">
                                <el-input v-model="formLabelAlign.name" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别" :span="12">
                                <el-input v-model="formLabelAlign.sex" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="民族" :span="12">
                                <el-input v-model="formLabelAlign.nation" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="出生日期" :span="12">
                                <el-input v-model="formLabelAlign.birthday" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号码">
                                <el-input v-model="formLabelAlign.phone" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="身份证号码">
                                <el-input v-model="formLabelAlign.identity" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12" class="pic-box">
                            <img :src="frontPic">
                            <div>身份证正面</div>
                        </el-col>
                        <el-col :span="12" class="pic-box">
                            <img :src="backPic">
                            <div>身份证反面</div>
                        </el-col>

                        <el-col :span="12" :offset="6" class="snap-box">
                            <img :src="snapPicUrl">
                            <div>拍照图片</div>
                        </el-col>
                    </el-row>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="产品信息">
                <el-form :label-position="labelPosition" label-width="100px" :model="formLabelProduct">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="产品名称">
                                <el-input v-model="formLabelProduct.productname" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="产品代码" :span="12">
                                <el-input v-model="formLabelProduct.productnumber" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="产品期限" :span="12">
                                <el-input v-model="formLabelProduct.deadline" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="风险级别" :span="12">
                                <el-input v-model="formLabelProduct.riskgrade" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="产品特点">
                        <el-input v-model="formLabelProduct.productfeature" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="投资及收益币种">
                        <el-input v-model="formLabelProduct.productdate" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="产品类型">
                        <el-input v-model="formLabelProduct.producttype" :disabled="true"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </el-row>
</template>

<script>
export default {
    data() {
        return {
            labelPosition: 'right',
            formLabelAlign: {
                name: '百度熊',
                sex: '男',
                nation: '汉',
                birthday: '1989-06-01',
                identity: '532101198906010015',
                identitydate: '2050',
                phone: '13888888888'
            },
            formLabelProduct: {
                productname: '优储蓄',
                productnumber: 'T9020',
                deadline: '2017-12-30',
                riskgrade: '风险较高',
                productfeature: '非保本产品',
                productdate: '人民币',
                producttype: '非保本浮动收益型'
            },
            frontPic: require('../../assets/img/front.jpg'),
            backPic: require('../../assets/img/back.jpg'),
        };
    },
    computed:{
        snapPicUrl:function(){
            console.log(this.snapPicStr+"照片地址");
            return this.snapPicStr ? this.snapPicStr : require("../../assets/img/client.png");
        }
    },
    created:function(){

    },
    props: {
        snapPicStr:{
            type:String,
            required:true
        },
    },
    methods: {

    }
}
</script>

<style scope>
.service-Wrapper{
    width: calc(100% - 5px);
    float: right;
    margin:5px 5px 0 5px;
    margin-top: 5px;
    font-size: 14px;
    color: #48576a;
    line-height: 2;
    height: 100%;
}
.service-Wrapper .el-tabs__content{
    height: calc(100% - 80px);
}
.service-Wrapper .el-tabs.el-tabs--border-card{
    height: 104%;
}
.pic-box{
    text-align: center;
}
.pic-box img{
    width: 67%
}
.service-box div{
    line-height: 2;
    font-size: 16px;
}
.apply-user > span,.service-box >span,.queue-box >span{
    color: #20a0ff;
}
.service-box >span:nth-last-child(1){
    color: red;
}
.snap-box img{
    width: 67%;
}
.snap-box{
    text-align: center;
    margin-top: 15px;
}
.el-tabs__content{
    overflow-y: scroll;
}
</style>
