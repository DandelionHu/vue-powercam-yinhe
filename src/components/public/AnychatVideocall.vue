<template>
    <div class="anychat-videocall">
        <!-- 发送呼叫对话框 -->
        <el-dialog id="sendRequestDialop" title="呼叫提示" :visible.sync="senddialogVisible" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
            <p>正在呼叫坐席
                <span>{{userId}}</span>
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelVideoCall">取消呼叫</el-button>
            </span>
        </el-dialog>

        <!-- 收到呼叫对话框 -->
        <el-dialog id="receiveRequestDialop" title="呼叫提示" :visible.sync="receivedialogVisible" :close-on-press-escape="false" @open="openFun" :close-on-click-modal="false" :show-close="false">
            <p>用户
                <span>{{userName}}</span> 正在向您请求呼叫，请选择“拒绝”或“同意”</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rejectVideoCall">拒 绝</el-button>
                <el-button type="primary" @click="acceptVideoCall" class="btn-confirm">同 意</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            senddialogVisible: false,
            receivedialogVisible: false,
            userId: "",
            userName:'',
            videoCallOpt: {
                //接收视频呼叫请求通知
                onReceiveVideoCallRequest: this.onReceiveVideoCallRequest,
                //接收视频呼叫开始通知
                onReceiveVideoCallStart: this.onReceiveVideoCallStart,
                //接收视频呼叫结束通知
                onReceiveVideoCallFinish: this.onReceiveVideoCallFinish,
                //接收视频呼叫异常通知
                onReceiveVideoCallError: this.onReceiveVideoCallError
            },
            agentStatus:true,
            roomId:'',
        };
    },
    props: [],
    created: function() {
        instance.callbackFunctionRegister(this.videoCallOpt);
    },
    mounted(){
        var that=this;
        AnyChat.bus.$off('leaveRoom');
        AnyChat.bus.$off('status');
        AnyChat.bus.$on('leaveRoom', function (msg) {
            if(msg){
                console.info("业务结束挂断视频");
                that.hangupVideoCall();
                that.receivedialogVisible = false;
                that.senddialogVisible = false;

            }
        });
        AnyChat.bus.$on('status',function (msg) {
            console.info(msg);
            if(msg==1){
                that.agentStatus=true;
            }else if(msg==2){
                that.agentStatus=true;
            }else{
                that.agentStatus=false;
            }
            console.info('this.agentStatus'+that.agentStatus);
        });
    },
    methods: {
        //接收视频呼叫请求通知
        onReceiveVideoCallRequest: function(data) {
            console.log("视频呼叫请求");
            this.userName = instance.getUserName({
                userId: data.userId
            });
            console.info('this.status'+this.agentStatus);
            if(!this.agentStatus){
                this.rejectVideoCall();
            }else{
                this.receivedialogVisible = true;
            }


            this.roomId=JSON.parse(data.userStr).roomId;
            AnyChat.bus.$emit('roomId', this.roomId);
            this.userId=data.userId;
            AnyChat.clientData={};
            AnyChat.clientData.userId=data.userId;

        },
        openFun:function () {
            console.info("打开了")
        },
        //接收视频呼叫开始通知
        onReceiveVideoCallStart: function(data) {
            console.log("接收视频呼叫开始通知");
            this.receivedialogVisible = false;
            this.$emit('videocall-start', data);
        },
        //接收视频呼叫结束通知
        onReceiveVideoCallFinish: function(result,data) {
            console.log("接收视频呼叫结束通知"+result.code);
            if(result.code==100106){
                this.$message.error(result.msg);
                //关闭摄像头
                AnyChat.bus.$emit('leaveRoomError', true);
                //挂断视频
                this.hangupVideoCall();
                this.receivedialogVisible = false;
                this.senddialogVisible = false;
                //离开房间
                instance.leaveRoom();
                //改变坐席状态
                this.$emit('videocall-error', true);

                this.$router.push({ path: '/Home/Overview' })
            }

        },
        //接收视频呼叫异常通知
        onReceiveVideoCallError: function(result) {
            console.log("接收视频呼叫异常通知"+result.code);
            this.receivedialogVisible = false;
            if(result.code==100101){
                this.$message.error('客户放弃视频会话');
            }else if(result.code==100105){
                this.$message.error('会话请求超时');
                this.hangupVideoCall();
            }
            this.$emit('videocall-reject', '1');


        },
        //发起呼叫结果事件
        onRequestVideoCallDone: function(result, data){
            console.log("视频呼叫异常");
            var callResult = {
                code: result.code,
                msg: result.msg,
                userId: data.userId
            };
            if(result.code!=0){
                this.$message.error('视频呼叫异常');
                this.$emit('videocall-reject', '1');
            }

        },

        //发送呼叫请求
        requestVideoCall: function() {
            instance.requestVideoCall({
                userId: this.userId,//被呼叫方用户ID
                done: this.onRequestVideoCallDone
            });
        },
        //点击同意按钮，接受呼叫
        acceptVideoCall: function() {
            instance.acceptVideoCall({
                userId: this.userId
            });
            this.receivedialogVisible = false;
            console.log("同意呼叫");
        },
        //点击拒绝按钮，拒绝呼叫
        rejectVideoCall: function() {
            instance.rejectVideoCall({
                userId: this.userId
            });
            this.receivedialogVisible = false;
            this.hangupVideoCall();
            console.log("拒绝呼叫");
            this.$emit('videocall-reject', '1');
        },
        //点击取消呼叫按钮
        cancelVideoCall: function() {
            instance.cancelVideoCall({
                userId: this.userId
            });
        },
        //挂断视频呼叫
        hangupVideoCall: function() {
            console.info('挂断视频呼叫');
            instance.hangupVideoCall({
                userId: this.userId
            });

        }
    }
}
</script>

<style scoped>
.anychat-videocall {
    display: flex;
    width: 50%;
}
p {
    font-size: 18px;
}
p>span {
    /* color: #00A0E9; */
    color: #FF3333;
}
</style>
