 <template>
    <div class="agent-box">
            <div class="busy-box">
                <ul>
                    <li class="busy-icon">
                        <img src="../../assets/img/busy.png"></li>
                    <li class="mt10">
                        示忙:
                        <span id="busyagentcount" class="color_m" v-text="busyAgentCountNum"></span>
                        人
                    </li>
                </ul>
            </div>
            <div class="queue-box">
                <div class="cur-time-area">
                    <img src="../../assets/img/queue.png">
                </div>
                <div class="tip-area mt10">
                    <p>当前有
                        <!-- <span id="the_number_of_line" class="color_m" v-text="queningUserCountOverview"></span> -->
                        <span id="the_number_of_line" class="color_m" v-text="queningUserCountNum"></span>
                        位用户正在排队办理
                    </p>
                    <!--<p>今天已办理了-->
                        <!--<span id="business_num" class="color_m"></span>-->
                        <!--笔业务-->
                    <!--</p>-->
                </div>
                 <!--<el-button type="primary" @click="enterRoom('111')">进入房间</el-button>-->
            </div>
            <div class="free-box">
                <ul>
                    <li class="free-icon">
                        <img src="../../assets/img/free.png">
                    </li>
                    <li class="mt10">
                        示闲:
                        <!-- <span id="idleagentcount" class="color_m" v-text="idleAgentCountOverview"></span> -->
                        <span id="idleagentcount" class="color_m" v-text="idleAgentCountNum"></span>
                        人
                    </li>
                </ul>
            </div>
        <anychat-videocall
            @videocall-start="videoCallStart"
            @videocall-error="videocallError"
            @videocall-reject="videoCallReject"></anychat-videocall>
    </div>
</template>

<script>
import { Loading } from 'element-ui';
import AnychatVideocall from '@/components/public/AnychatVideocall'
// let loadingInstance1 = Loading.service({ fullscreen: true });
export default {
  data() {
    return {
        currentFileId:"",   //pptID
        currentPPTtask:"",
        downloadErrorcode:-1,
        video_recording_address:"d:\\video", //视频保存路径
        verbalDesc:"",
        clientInformation:'',
        busyAgentCountOverview:'1',
        queningUserCountOverview:'1',
        idleAgentCountOverview:'1',
        RoomId:''
    }
  },
  props:['idleAgentCountNum','queningUserCountNum','busyAgentCountNum'],
  computed:{

  },
  components: {
      AnychatVideocall
  },
  mounted(){
      var that=this;
      AnyChat.bus.$off('roomId');
      AnyChat.bus.$on('roomId', function (msg) {
            if(msg){
                that.RoomId = msg;
            }
        });
  },
  methods: {
      enterRoom:function (roomId) {
          console.log("进入房间");
          instance.enterRoom({
              roomId:roomId,
              password: '',
              done: this.onAnyChatEnterRoom
          });
      },
      onAnyChatEnterRoom:function (result,data) {
          //进入房间的回调
          if(result.code==0){
              console.log("进入房间成功");
              this.$router.push({ path: 'BusinessAccount'});
          }
      },
      videoCallStart: function(data) {
          //呼叫同意
          console.log("roomId: "+this.RoomId);
          AnyChat.roomId = this.RoomId;
          this.enterRoom(this.RoomId);
      },
      videoCallReject:function (msg) {
          //呼叫拒绝
          if(msg==1){
              console.info("拒绝"+msg)
              this.$emit('video-reject', '2');
          }
      },
      videocallError:function () {
          instance.agentServiceCtrl({
              ctrlCode: 1,
          });
          instance.agentServiceCtrl({
              ctrlCode: 0,
          });
      },
  },
  watch:{
      busyAgentCountOverview(curVal,oldVal){
          console.info('示忙人数'+curVal)
      },
      queningUserCountOverview(curVal,oldVal){
          console.info('排队人数'+curVal)
      },
      idleAgentCountOverview(curVal,oldVal){
          console.info('示闲人数'+curVal)
      },
  }
}
</script>

<style scoped>
  .agent-box{
        width: 96%;
        border: 1px solid #EAEAEA;
        text-align: center;
        background: #fff;
        margin: 2%;
        font-size: 18px;
        position: relative;
        margin-bottom: 0px;
        height: calc(100vh - 180px);
    }
    .agent-box .busy-box{
        position: absolute;
        left: 80px;
        top: 150px;
    }
    .agent-box .busy-box img{
        padding: 38px;
    }
    .agent-box .free-box {
        position: absolute;
        right: 80px;
        top: 150px;
    }
    .agent-box .free-box img{
        padding: 38px;
    }
    .agent-box .queue-box {
        display: inline-block;
        margin-top: 123px;
        margin-bottom: 40px;
    }
    .agent-box .queue-box img{
        padding: 47px;
    }
    .busy-box ul >li.busy-icon, .free-box ul >li.free-icon {
        width: 150px;
        height: 150px;
        background: red;
        border-radius: 50%;
        padding: 0px;
    }
    .mt10 {
        margin-top: 10px;
    }
    .queue-box > .cur-time-area {
        width: 220px;
        height: 220px;
        background-color: #27AACF;
        border-radius: 50%;
        margin: 0 auto;
    }
    .free-box ul >li.free-icon {
        background: limegreen;
    }
    .color_m {
        color: #00A0E9;
    }
    img {
        max-width: 100%;
    }
</style>



