<template>
    <div class="anychat-head">
        <div class="LocationHallImg">
            AnyChat远程双录坐席系统
        </div>
        <div class="agent-queue-info">
            <el-select class="selectMargin" v-model="toStatus" @change="statusFunChild" placeholder="切换状态">
                <el-option
                    v-for="item in strStatusChild"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label">
                </el-option>
            </el-select>
            <el-select class="selectMargin" placeholder="队列信息" v-model="queueChildSelect">
                <el-option
                    v-for="item in queueChild"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                    :disabled="item.disabled">
                </el-option>
            </el-select>
            <el-button type="primary" @click="logout">退出</el-button>
        </div>
        <div class="agent-status-info">
            <div class="pepole"></div>
            <div id="AgentName" class="name" v-text="userIdChild"></div>
            <div id="AgentStatus" class="state" v-text="statusChild"></div>
        </div>
    </div>
</template>

<script>
    window.instance = null;
    export default {
        data() {
            return {
                toStatus:'',
                queueChildSelect:'',
            };
        },
        computed: {

        },
        methods: {
            statusFunChild:function () {
                this.$emit('child-status',this.toStatus)
            },
            logout:function () {
                var that=this;
                console.info(this.statusChild);
                if(this.statusChild=='状态：未签入'){
                    instance.logout();
                    instance=null;
                    this.$router.push({ path: 'Login' })
                }else{
                    that.$message.error('请先签出再退出');
                }

            }
        },
        props: ['queueChild','userIdChild','strStatusChild','statusChild'],
        watch:{
            'queueChild':{
                handler:(val,oldVal)=>{
                    console.log('队列信息改变');
                },
                // 深度观察
                deep:true
            }
        }
    }
</script>
<style>
    .el-button--primary{
        font-family: 微软雅黑;
    }
    .el-input__inner{
        line-height: 30px;
    }
</style>
<style scoped>

    .anychat-head{
        background: #fff;
        height: 60px;
    }
    .LocationHallImg{
        width: 300px;
        height: 60px;
        display: inline-block;
        float: left;
        padding-left: 20px;
        font-size: 22px;
        line-height: 54px;
        color: #20a0ff;
    }
    .LocationHallImg img{
        width: 100%;
        margin: 10px auto;
    }
    .agent-status-info{
        display: inline-block;
        height: 60px;
        float: right;
    }
    .agent-queue-info{
        display: inline-block;
        height: 60px;
        float: right;
        padding: 0px 30px;
    }
    .pepole{
        width: 35px;
        height: 50px;
        text-align: right;
        background-image: url("../../assets/img/icons_pepole.png");
        background-repeat: no-repeat;
        background-position: 0;
        text-indent: 20px;
    }
    .agent-status-info .name {
        color: #367cb8;
        margin: 0 10px;
    }
    .agent-status-info > div {
        display: inline-block;
        height: 60px;
        vertical-align: top;
        line-height: 60px;
        font-size: 16px;
    }
    .selectMargin{
        margin: 12px;
        font-family: 微软雅黑;
        width: 122px;
    }

</style>
<style>
    body{
        font-family: 微软雅黑;
    }
    .selectMargin input{
        font-family: 微软雅黑;
    }
</style>

