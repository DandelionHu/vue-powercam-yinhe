<template>
    <div class="MainWrapper" :style="styleObject">
        <el-col class="height100" :span="11">
            <div class="videoArea">
                <anychat-videoshow
                    @snapShot-finish="snapShotFinish"
                    :visibility="visibilityParent"
                    :snapRecord="snapRecordClick"></anychat-videoshow>
            </div>
            <div class="btnArea">
                <div class="videoPlay">
                    <div class="item"></div>
                    <el-button id="back" type="primary" class='result-customer-btn item' @click="snapRecord">拍照</el-button>
                    <el-button id="back" type="primary" class='result-customer-btn item' @click="finishRecord" :disabled="disabledRecord">结束录像</el-button>
                    <el-button id="back" type="primary" class='result-customer-btn item' @click="filePathUrlFun" :disabled="disabledFile">回放</el-button>
                </div>
                <div class="acceptRefuse">
                    <accept-refuse
                        :snapPicParentFinish="snapPicParentLocal"
                        :filePathUrlFinish="filePathUrlLocal"
                        @visibility-hidden="visibilityFun"
                        @pass-success="passSuccessFun"
                        @after-close="afterCloseFun"></accept-refuse>
                </div>

            </div>
            <div class="questionArea">
                <anychat-verbalinfo></anychat-verbalinfo>
            </div>

        </el-col>
        <el-col class="height100" :span="13">
            <div class="messageArea">
                <service-info :snapPicStr="snapPicParent"></service-info>
            </div>
        </el-col>
        <anychat-playback
            :videoFilePath="filePathUrl"
            :dialogSeen="dialogSeenParent"
            @before-close="beforeCloseFun"></anychat-playback>
    </div>
</template>



<script>
import ServiceInfo from '@/components/public/ServiceInfo'
import AcceptRefuse from '@/components/public/AcceptAndRefuse'
import AnychatPlayback from '@/components/public/AnychatPlayback'
import AnychatVideoshow from '@/components/public/AnychatVideoshow'
import AnychatVerbalinfo from '@/components/public/AnychatVerbalinfo'




export default {
    data() {
        return {
            styleObject: {
                height: (document.body.clientHeight - 70) + 'px',
            },
            targetId: AnyChat.clientData.userId,
            filePathUrl: '',
            filePathUrlLocal: '',
            snapPicParent: '',
            snapPicParentLocal: '',
            snapRecordClick:false,
            disabledFile:true,
            disabledRecord:false,
            dialogSeenParent: false,
            visibilityParent:'visible',
            bufferOpt: {
                onReceiveBuffer: this.onReceiveBuffer
            }
        }
    },
    props: [],
    computed: {

    },
    created:function(){
        instance.callbackFunctionRegister(this.bufferOpt);
    },
    methods: {

        filePathUrlFun: function() {
            //录像完成
            this.dialogSeenParent = true;
            this.filePathUrl = 'https://h5test.anychat.net.cn/'+this.filePathUrlLocal;
            this.visibilityParent='hidden';
        },
        snapRecord:function(){
            this.snapRecordClick=true;
        },
        snapShotFinish: function(data) {
            //拍照完成
            this.snapPicParent = data.szUrl;
            this.snapPicParentLocal = data.filePath;
            console.log(data);
            this.snapRecordClick=false;
        },
        beforeCloseFun: function(is) {
            //关闭回放
            this.filePathUrl = '';
            this.dialogSeenParent = false;
            this.visibilityParent='visible';
        },
        afterCloseFun:function(){
            //显示视频
            this.visibilityParent='visible';
        },
        visibilityFun:function (is) {
            //隐藏视频
            this.visibilityParent='hidden';
        },
        passSuccessFun:function (is) {
            //成功
            AnyChat.bus.$emit('closeVideoShow', true);
            AnyChat.bus.$emit('leaveRoom', true);
            this.snapPicParent='';
            this.snapPicParentLocal="";
            this.filePathUrlLocal='';
            instance.leaveRoom();
            this.$emit('leave-room', true);
            this.$router.push({ path: 'Overview' });

        },
        finishRecord:function () {
            var obj = {
                cmd: "CMD_Video_Finish",
                data:{
                    result: "200",
                    desc: "录像完成"
                }
            }
            var resultStr = JSON.stringify(obj);
            BRAC_TransBuffer(AnyChat.clientData.userId,resultStr);
            console.info("发送透明通道，结束录像");
        },
        onReceiveBuffer: function(data) {
            console.log('透明通道回调：' + data.msg);
            this.disabledFile=false;
            this.disabledRecord=true;
            var jsonObj = JSON.parse(decodeURIComponent(data.msg));
            if (jsonObj.cmd == "CMD_Video_Record_Result") {
                this.filePathUrlLocal = jsonObj.data.recordFilePath;
            }


        },
    },
    components: {
        ServiceInfo,
        AnychatVerbalinfo,
        AcceptRefuse,
        AnychatPlayback,
        AnychatVideoshow
    },
}
</script>

<style>
.MainWrapper .height100 {
    height: 100%;
}
</style>
<style scoped>
.videoArea {
    width: 100%;
    height: 60%;
}

.questionArea {
    width: 92%;
    padding: 0px 2%;
    background: #fff;
    border: 1px solid #eee;
    box-shadow: 1px 1px 10px #cacaca;
    margin: 0 auto;
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.btnArea {
    width: 100%;
    height: 8%;
    padding-top: 2%;
}

.messageArea {
    width: 100%;
    height: 100%;
}

.videoPlay {
    display: flex;
    width: 53%;
    text-align: right;
    float: left;
}

.item {
    flex: 1;
}

#back {
    background: #007ECE;
    padding: 6px 15px;
}

.acceptRefuse {
    display: inline-block;
    width: 39%;
    float: left;
    text-align: left;
    padding-left: 15px;
}
</style>
