<template>
    <div class="anychat-hall" v-loading.body="loading" element-loading-text="正在加载坐席信息">
        <anychat-header :queueChild="queuesParent" :userIdChild="userId" :statusChild="status" :strStatusChild="strStatus" @child-status="statusFun"></anychat-header>

            <router-view
            :idleAgentCountNum = "idleAgentCountNum"
            :queningUserCountNum = "queningUserCountNum"
            :busyAgentCountNum = "busyAgentCountNum"
            @video-reject="videoReject"
            @leave-room="leaveRoomFun"></router-view>


    </div>
    </template>

    <script>
import AnychatHeader from '@/components/public/AnychatHeader'


export default {
    data() {
        return {
            loading: true,
            initOpt: {
                nickName:JSON.parse(sessionStorage.content).username,
                strUserId:JSON.parse(sessionStorage.content).username,
                password: "",
                userId:2000,
                serverIp: AnyChatConfig.ip,
                serverPort: AnyChatConfig.port,
                appId: AnyChatConfig.appId,
                onLogin: this.onLogin,
                onDisConnect: this.onDisConnect,
                queueOpt: {
                    role: 2, //0--客户， 2--坐席
                    priority: 15, //优先级，值为1-15，值越大，优先级越高
                    isAutoMode: 1, //路由模式，0为手动路由，1为自动路由（默认）
                    attribute: "", //业务属性，可以根据业务需求传入JSON对象
                    //营业厅状态变化通知事件(客户/坐席进入或离开营业厅)
                    onAreaChanged: this.onAreaChanged,
                    //队列状态变化通知事件(客户进入或离开队列)
                    onQueueChanged: this.onQueueChanged,
                    //用户出队列开始服务通知事件
                    onServiceNotify: this.onServiceNotify,
                    //其他坐席用户的状态变化通知事件
                    onElseAgentStatusChanged:this.onElseAgentStatusChanged
                },
            },
            agentServiceInfo: {
                serviceBeginTime: 0,
                serviceTotalTime: 0,
                serviceUserCount: 0
            },
            userId: '', //用户名
            areaId: 10,  //营业厅id
            businessnallname: '',//营业厅名称
            queuesParent: [],  //队列信息
            strStatus: [
                { id: 1, label: "签入" }
            ], //切换状态
            status: '状态：未签入', //状态
            agentCount: '',  //总坐席数
            idleAgentCountNum: '', //示闲人数
            queningUserCountNum: '',//排队人数
            busyAgentCountNum: '',//示忙人数
            queueList:''
        };
    },
    computed: {

    },
    created: function() {
        if (sessionStorage.content) {
            if (instance == null) instance = AnyChatWebSDK.sdkInit(this.initOpt);
            AnyChat.instance = instance;
            console.log("初始化anychat");
        }

    },
    methods: {
        strStatusFun: function(event) {
            var mapping = {
                "-1": "初始化",
                "0": "未签入",
                "1": "空闲",
                "2": "通话中",
                "3": "暂停服务",
                "10": "离线",
            }
            this.status = "状态：" + mapping[event];

            AnyChat.bus.$emit('status',event)

            if (event == 1) {
                this.strStatus = [
                    { id: 2, label: "暂停服务" },
                    { id: 3, label: "签出" }
                ]
            } else if (event == 3) {
                this.strStatus = [
                    { id: 4, label: "继续服务" },
                    { id: 3, label: "签出" }
                ]
            } else if (event == 0) {
                this.strStatus = [
                    { id: 1, label: "签入" }
                ]
            }else if (event == 2) {
                this.strStatus = []
            }
        },
        statusFun: function(event) {
            console.info("头部改变状态：" + event)
            if (event == '签入') {
                //改变坐席状态
                instance.agentServiceCtrl({
                    ctrlCode: 0,
                    done: this.onServiceCtrlDone,
                    onAgentStatusChanged: this.onAgentStatusChanged,
                    onAgentServiceInfoNotify: this.onAgentServiceInfoNotify
                });

            } else if (event == '暂停服务') {
                instance.agentServiceCtrl({
                    ctrlCode: 2,
                    done: this.onServiceCtrlDone,
                    onAgentStatusChanged: this.onAgentStatusChanged,
                    onAgentServiceInfoNotify: this.onAgentServiceInfoNotify
                });
            } else if (event == '签出') {
                instance.agentServiceCtrl({
                    ctrlCode: 1,
                    done: this.onServiceCtrlDone,
                    onAgentStatusChanged: this.onAgentStatusChanged,
                    onAgentServiceInfoNotify: this.onAgentServiceInfoNotify
                });
            } else if (event == '继续服务') {
                instance.agentServiceCtrl({
                    ctrlCode: 0,
                    done: this.onServiceCtrlDone,
                    onAgentStatusChanged: this.onAgentStatusChanged,
                    onAgentServiceInfoNotify: this.onAgentServiceInfoNotify
                });
            }
        },
        onLogin: function(data) {
            console.log("登录AnyChat成功");
            this.userId = AnyChat.userId =instance.getUserName({
                userId: data.userId
            });
            //启动web服务
            instance.setSDKOption({enableWebService: 1});


            console.log("当前坐席营业厅id" + this.areaId);

            instance.enterArea({
                areaId: this.areaId,
                done: this.onEnterAreaDone
            });


        },
        onDisConnect: function(result) {
            if(result.code==0){
                console.log("主动退出");
            }else {
                console.log("登录AnyChat出错");
                this.loading = false;
                this.$message.error(result.msg);
                instance.logout();
                instance = null;
                var that = this;
                setTimeout(that.$router.push({ path: '/Login' }), 2000)
            }

        },

        onEnterAreaDone: function(result, data) {
            if (result.code == 0) {
                Object.assign(AnyChat, {
                    areaData: data
                });
                this.queueList= data.queues;
                var obj = data.queues;
                console.info("当前营业厅下的队列及排队人数");
                for (var i = 0; i < obj.length; i++) {
                    var num = this.getQueueLength(obj[i].id);
                    obj[i].num = num;
                    obj[i].disabled = true;
                    obj[i].name = obj[i].name + "(" + num + ")";
                    console.info(obj[i]);
                }
                this.loading = false;
                this.queuesParent = obj;
                this.businessnallname = data.areaName;//营业厅名称
                console.log('进入的营业厅名称：' + data.areaName)
                this.agentCount = data.agentCount;
                console.log('营业厅人数：'+data.idleAgentCount);
                this.idleAgentCountNum = data.idleAgentCount;
                this.queningUserCountNum = data.queningUserCount;
                this.busyAgentCountNum = parseInt(data.agentCount) - parseInt(data.idleAgentCount);
            }
        },
        onServiceCtrlDone: function(result) {
        },
        onAgentStatusChanged: function(event) {
            var that=this;
            //坐席状态变化通知回调
            console.log("座席状态改变");
            this.strStatusFun(event.status);
            if (event.status == 1) {

            }
            console.info("坐席变化，示闲示忙人数变化");
            setTimeout(function () {
                var agentcount = instance.getAgentCount({areaId:that.areaId});
                console.info('营业厅人总数：'+agentcount.allAgentCount);
                console.info('营业厅示闲人数：'+agentcount.idleAgentCount);
                that.agentCount = agentcount.allAgentCount;  //营业厅内的坐席总数
                that.idleAgentCountNum = agentcount.idleAgentCount; //营业厅内的空闲坐席数
                that.busyAgentCountNum = parseInt(agentcount.allAgentCount) - parseInt(agentcount.idleAgentCount);
            },1000)
        },
        onElseAgentStatusChanged:function () {
            var that=this;
            setTimeout(function () {
                var agentcount = instance.getAgentCount({areaId:that.areaId});
                console.info('营业厅人总数：'+agentcount.allAgentCount);
                console.info('营业厅示闲人数：'+agentcount.idleAgentCount);
                that.agentCount = agentcount.allAgentCount;  //营业厅内的坐席总数
                that.idleAgentCountNum = agentcount.idleAgentCount; //营业厅内的空闲坐席数
                that.busyAgentCountNum = parseInt(agentcount.allAgentCount) - parseInt(agentcount.idleAgentCount);
            },1000)
        },
        onAgentServiceInfoNotify: function(data) {
            // 坐席服务信息变化通知回调  主动查询当前示忙示闲人数
            this.agentServiceInfo.serviceBeginTime = data.serviceBeginTime;
            this.agentServiceInfo.serviceTotalTime = data.serviceTotalTime;
            this.agentServiceInfo.serviceUserCount = data.serviceUserCount;

        },
        onAreaChanged: function(data) {
            //营业厅状态变化通知事件  主动查询当前示忙示闲人数

        },
        onQueueChanged: function(data) {
            //队列状态发生改变  主动查询排队人数和每个队列排队人数
//            this.queningUserCountNum= instance.getAreaQueueUserCount({
//                areaId: this.areaId
//            });

            this.queningUserCountNum=0;
            for(var i = 0; i<this.queueList.length; i++){
                this.queningUserCountNum +=instance.getQueueLength({
                    queueId:this.queueList[i].id
                });
            }

            this.queuesParent.forEach(function(item, index) {
                if (item.id == data.queueId) {
                    item.name = (item.name).replace(/\(.*?\)/g, '') + "(" + data.userCount + ")";
                }
            });

        },
        onServiceNotify: function() {
            console.log('服务通知');

        },
        getQueueLength: function(event) {
            //查询队列人数
            return instance.getQueueLength({
                queueId: event
            });
        },
        videoReject:function (msg) {
            console.info("拒绝"+msg);
            instance.agentServiceCtrl({
                ctrlCode: 0,
                done: this.onServiceCtrlDone,
                onAgentStatusChanged: this.onAgentStatusChanged,
                onAgentServiceInfoNotify: this.onAgentServiceInfoNotify
            });
        },
        leaveRoomFun:function (msg) {
            console.info("离开房间"+msg);
            instance.agentServiceCtrl({
                ctrlCode: 0,
                done: this.onServiceCtrlDone,
                onAgentStatusChanged: this.onAgentStatusChanged,
                onAgentServiceInfoNotify: this.onAgentServiceInfoNotify
            });

        },

    },
    components: {
        AnychatHeader
    },
    watch:{

    }
}

</script>

<style>

    body{
        overflow-x: hidden;
        font-family: 微软雅黑 !important;
        background: #eee;
    }
    .el-loading-mask{
        background-color: rgba(0, 0, 0, 0.5);
    }
    #AnyChatSDKPluginDiv{
        height: 0px;
    }
</style>
<style scoped>
    *{
        font-family: 微软雅黑 !important;
    }

    ul, li, ol {
        list-style: none;
    }
    .anychat-hall{
        background: #eee;
        height: 100%;
    }

</style>


