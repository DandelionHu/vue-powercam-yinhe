<template>
  <div class="video-playback">
      <iframe id="dialogFrame" frameborder="0" scrolling="no" style="background-color:transparent; position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;"></iframe>
	  <el-dialog title="视频回放" :visible.sync="dialogVisible" :close-on-press-escape="false" :close-on-click-modal="false" @close="close">
          <iframe id="dialogFrame" frameborder="0" scrolling="no" style="background-color:transparent; position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;"></iframe>
          <video id="media" controls style="width: 100%;" :src="videoFilePath"></video>
	</el-dialog>
  </div>
</template>


<script>
export default {
	data() {
		return {
            dialogVisible:false,
		};
	},
	props: ['videoFilePath','dialogSeen'],
	created: function() {

	},
	methods:{
		close:function(){
			this.$emit('before-close',false);
            var Media = document.getElementById("media");
            Media.pause();
        }
	},
    watch:{
        dialogSeen(curVal,oldVal){
            console.info("dialogSeen改变");
            this.dialogVisible=this.dialogSeen;
        },
    }
}
</script>

<style scoped>
.video-playback {
	display: flex;
	width: 800px;
}
</style>

