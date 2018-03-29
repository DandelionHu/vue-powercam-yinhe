<template>
    <!--视频区域-->
    <div id="Agent-Client-Box" class="video-area">
        <!--客户视频画面-->
        <div id="Client-Area"></div>
        <!--座席视频画面-->
        <div id="Agent-Area-Box" class="agent-area">
            <div id="Agent-Area" class="agent-video">
                <!-- 坐席 -->
            </div>
                <iframe id="dialogFrame" frameborder="0" scrolling="no" style="background-color:transparent; position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;"></iframe>
        </div>
        <!--录制拍照按钮-->
        <!--<div class="active-Area">-->
            <!--<span id="btn-take-photo" class="photo" @click="snapShot"></span>-->
            <!--<span id="btn-record-video" class="record" @click="changeRecordStatus"></span>-->
            <!--<span id="btn-set-device" class="config" @click="showDevices" :disabled="deviceVisible"></span>-->
            <!--<ul id="EnumDevices" class="camera-list" v-if="seen">-->
                <!--<li :key="index" v-for="(camera,index) in cameras" @click="startLocalVideo(index)">{{camera.deviceName}} </li>-->
            <!--</ul>-->
        <!--</div>-->
    </div>
</template>

<script>
export default {
    data() {
        return {
            deviceVisible: false,
            seen: false,
            isRecord: false,
            microphones: [], //本地音频设备列表
            cameras: [],  //本地视频设备列表
            userList: [],  //房间内用户列表
            mTargetUserId: "",  //远程用户ID
            mSelfUserId: "",     //当前用户ID
            remoteStreamIndex: 0,   //远程用户摄像头编号
            roomOpt: {
                //用户进出房间通知事件
                onRoomUserInAndOut: this.onAnyChatUserAtRoom,
                //房间用户数变化通知事件
                onRoomUserChanged: this.onAnyChatRoomOnlineUser,
                //房间用户文字交流通知事件
                onRoomUserMsgReceived: this.onAnyChatUserMsgAtRoom
            }
        };
    },
    props: ['visibility','snapRecord'],
    created: function() {
        instance.callbackFunctionRegister(this.roomOpt);
        this.userList = instance.getRoomUsers();
        this.microphones = instance.getMicrophones();
        this.cameras = instance.getCameras();
    },
    mounted: function() {
        var that=this;
        AnyChat.bus.$off('leaveRoomError');
        AnyChat.bus.$off('closeVideoShow');
        AnyChat.bus.$on('leaveRoomError', function (msg) {
            if(msg){
                console.info("网络断线关闭摄像头")
                that.closeLocalVideo();
                that.closeRemoteVideo(that.userList[0]);
            }
        });
        AnyChat.bus.$on('closeVideoShow', function (msg) {
            if(msg){
                console.info("业务结束关闭摄像头")
                that.closeLocalVideo();
                that.closeRemoteVideo(that.userList[0]);
            }
        })
    },
    methods: {
        onAnyChatUserAtRoom: function(data) {
            var tips = data.action == 1 ? "进入房间" : "退出房间";
            console.log(data.userId + tips + data.roomId);

            if (data.action) {
                this.mTargetUserId = data.userId;
                console.info("对方后进id"+this.mTargetUserId);
                this.startRemoteVideo(data.userId);

            } else {
//                this.$message.error('用户退出房间');
//                this.mTargetUserId = "";
//                this.closeRemoteVideo(data.userId);
            }
        },
        onAnyChatRoomOnlineUser: function(data) {
            console.log("当前房间人数" + data.userNum);
        },
        onAnyChatUserMsgAtRoom: function(data) {
            console.log(data);
            //data.userId :发送方用户ID
            //data.msg : 消息内容
        },
        startLocalVideo: function(index) {
            var videoDeviceList = this.cameras;
            for (var i = 0; i < videoDeviceList.length; i++) {
                if (i == index) {
                    console.log('打开自己摄像头');
                    var errorCode = videoDeviceList[i].open({
                        id: "Agent-Area",
                        streamIndex: videoDeviceList[i].streamIndex
                    });
                    if (errorCode == 0) {
                        this.deviceVisible = true;
                        this.seen = false;
                    }
                    break;
                }
            }
            var audioDeviceList = this.microphones;
            for (var i = 0; i < audioDeviceList.length; i++) {
                var errorCode = audioDeviceList[0].open();
            }
        },
        closeLocalVideo: function() {
            console.log('关闭自己摄像头');
            var videoDeviceList = this.cameras;
            for (var i = 0; i < videoDeviceList.length; i++) {
                if (videoDeviceList[i].isOpen) {
                    var errorCode = videoDeviceList[i].close();
                }
            }

            var audioDeviceList = this.microphones;
            for (var i = 0; i < audioDeviceList.length; i++) {
                var errorCode = audioDeviceList[0].close();
            }
        },
        startRemoteVideo: function(userId) {
            console.info("打开对方视频和音频" + userId);
            instance.getRemoteAudioStream({
                remoteUserId: userId
            });
            instance.getRemoteVideoStream({
                remoteUserId: userId,
                streamIndex: this.remoteStreamIndex,
                renderId: "Client-Area"
            });

            // 打开第一个摄像头
             this.startLocalVideo(0);
        },
        closeRemoteVideo: function(userId) {
            console.log('关闭用户摄像头');
            instance.cancelRemoteAudioStream({
                remoteUserId: userId
            });
            var errorCode = instance.cancelRemoteVideoStream({
                remoteUserId: userId,
                streamIndex: this.remoteStreamIndex
            });
            if (errorCode == 0) {
                document.getElementById("Client-Area").innerHTML='';
            }
        },
        snapShot: function() {
            var snapShotSetting = {
                userId: this.mTargetUserId,
                streamIndex: this.remoteStreamIndex,
                mode: 1,
                localFilePath: "d:\\snapshot",
                done: this.onSnapshotDone
            };
            instance.takeSnapShot(snapShotSetting);
        },
        onSnapshotDone: function(result, data) {
            if (result.code == 0) {
                console.log("照片的保存地址:" + data.filePath);
                var szUrl = instance.turnPathToUrl({ path: data.filePath });
                var obj = {
                    szUrl: szUrl,
                    filePath: data.filePath
                }
            	console.dir(obj)
                this.$emit('snapShot-finish', obj);
            }
        },

//        changeRecordStatus: function() {
//            if (!this.isRecord) {
//                this.startRecord();
//                this.isRecord = true;
//                document.getElementById("btn-record-video").className = "record recording";
//            } else {
//                this.stopRecord();
//                this.isRecord = false;
//                document.getElementById("btn-record-video").className = "record";
//            }
//        },
//        startRecord: function() {
//            var recordSetting = {
//                layout: 3,
//                layoutStreams: [{
//                    userid: this.mSelfUserId,
//                    streamindex: 0,
//                    recordindex: 0
//                },
//                {
//                    userid: this.mTargetUserId,
//                    streamindex: 0,
//                    recordindex: 1
//                }],
//                mode: 1,
//                content: 1,
//                fileType: 0,
//                clipMode: 2,
//                width: 320,
//                height: 240,
//                localFilePath: "d:\\video",
//                done: this.onRecordDone
//            };
//            instance.startRecord(recordSetting);
//        },
//        stopRecord: function() {
//            instance.stopRecord();
//        },
//        onRecordDone: function(result, data) {
//            if (result.code == 0) {
//                console.log("录制文件的保存地址:" + data.filePath);
//                console.log("录像时长:" + data.elapse + "秒");
//                var szUrl = instance.turnPathToUrl({ path: data.filePath });
//                var obj = {
//                    szUrl: szUrl,
//                    filePath: data.filePath
//                }
//				console.dir(obj);
//                this.$emit('videorecord-finish', obj);
//            }
//        },
//        showDevices: function() {
//            this.seen = true;
//        }
    },
    watch:{
        visibility(curVal,oldVal){
            console.info("visibility改变");
            console.info(curVal);
            document.getElementById("Client-Area").firstChild.style.visibility=curVal;
            document.getElementById("Agent-Area").firstChild.style.visibility=curVal;

        },
        userList(curVal,oldVal){
            console.info("进入房间数据改变"+this.userList);
            var that=this;
            if (this.userList.length > 1) {
                this.startRemoteVideo(this.userList[0]);
                this.mTargetUserId = this.userList[0];
                console.info("对方id"+this.mTargetUserId);
            }
            this.mSelfUserId = this.userList[this.userList.length - 1];
        },
        snapRecord(curVal,oldVal){
            if(curVal){
                this.snapShot()
            }
        }
    }
};
</script>
<style scoped>
.video-area {
    width: 98%;
    height: 100%;
    position: relative;
}

#Agent-Client-Box {
    padding: 1%;
}

#AnyChatApp.PC-Video #Agent-Client-Box {
    width: 80%;
    margin: 0 auto;
}

.video-area #Client-Area {
    height: 99%;
    background:#004790 url("../../assets/img/video_wrap_bg.png") no-repeat scroll center center
}

.video-area .agent-area {
    width: 165px;
    height: 120px;
    position: absolute;
    bottom: 10px;
    right: 6px;
    /* background-color: #004790; */
    z-index: 9999;
}
#Agent-Area{
    display: block;
    height: 100%;
    width: 100%;
}

.video-area .active-Area {
    position: absolute;
    bottom: 11px;
    left: 1%;
    width: 98%;
    height: 40px;
    background-color: #004790;
    text-align: center;
}

.video-area .active-Area .photo {
    width: 32px;
    height: 35px;
    display: block;
    float: left;
    margin-top: 5px;
    margin-left: 49%;
    background-image: url("../../assets/img/img.png");
    background-repeat: no-repeat;
    background-position: 0 -82px;
    cursor: pointer;
}

.agent-queue-info .nav-pills .dropdown-box {
    border: #367CB8 2px solid;
    border-radius: 4px;
}

.video-area .active-Area .record {
    width: 50px;
    height: 50px;
    display: block;
    float: left;
    margin-left: 20px;
    background-image: url("../../assets/img/img.png");
    background-repeat: no-repeat;
    background-position: 0 -270px;
    cursor: pointer;
}

#btn-record-video.recording {
    background-position: 0 -220px;
}

.video-area .active-Area .config {
    width: 32px;
    height: 35px;
    display: block;
    float: left;
    margin-top: 5px;
    margin-left: 20px;
    background-image: url("../../assets/img/img.png");
    background-repeat: no-repeat;
    background-position: 0 -116px;
    cursor: pointer;
}

.camera-list {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 200px;
    background: #fff;
}

#EnumDevices>li {
    color: #000;
    font-size: 14px;
    width: 100%;
    line-height: 20px;
    cursor: pointer;
}
</style>
