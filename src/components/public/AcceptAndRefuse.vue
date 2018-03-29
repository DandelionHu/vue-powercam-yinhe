<template>
	<div class="accept-container">
		<div class="accept-wrap">
			<iframe id="dialogFrame" frameborder="0" scrolling="no" style="background-color:transparent; position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;"></iframe>
			<el-button type="info" @click="checkVideo" class='result-customer-btn item'>通过</el-button>
			<el-button type="danger" @click="refuseFun" class='result-customer-btn item'>驳回</el-button>
			<div class="item"></div>
			<div class="item"></div>

			<el-dialog title="温馨提示" :visible.sync="dialogVisible" :close-on-press-escape="false" :close-on-click-modal="false" @close="close" size="tiny">
				<iframe id="dialogFrame1" frameborder="0" scrolling="no" style="background-color:transparent; position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;"></iframe>
				<span v-text="dialogVisibleSpan"></span>
				<span slot="footer" class="dialog-footer">
		            <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
		            <el-button type="primary" @click="dialogVisible = false" class="btn-confirm">确 定</el-button>
		        </span>
			</el-dialog>

			<!-- Form -->

			<el-dialog title="拒绝原因" :visible.sync="dialogFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" @close="close">
				<iframe id="dialogFrame2" frameborder="0" scrolling="no" style="background-color:transparent; position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;"></iframe>
				<el-form :model="form">
					<el-form-item label="" :label-width="formLabelWidth">
						<el-input type="textarea" id='refuse-reason' v-model="form.region" :rows='2' auto-complete="off" placeholder="请输入原因"></el-input>
					</el-form-item>
					<el-form-item label="" :label-width="formLabelWidth">

						<el-select id='select-reason' placeholder="选择常见驳回原因" v-model="form.region">
							<el-option v-for="item in refuseReason" :key="item.returnType" :label="item.returnDesc" :value="item.returnDesc">
							</el-option>
						</el-select>
					</el-form-item>

				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="refuseConfirm" class="btn-confirm">确 定</el-button>
				</div>
			</el-dialog>

		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dialogVisible: false,
                dialogVisibleSpan:'',
				dialogFormVisible: false,
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				data: {
					Status: 3,
					returnDesc: 'reason',
					returnType: 2
				},
				refuseReason:[
                    {
                        'returnType':0,
                        'returnDesc':'视频画面不清晰'

                    },
                    {
                        'returnType':1,
                        'returnDesc':'录像时间太短'

                    }
                ],
				refuseConfirmFlag:0,
				formLabelWidth: '10px'
			};
		},
		created: function() {

		},
		props: [ 'snapPicParentFinish','filePathUrlFinish'],
		methods: {
			checkVideo: function() {
			    //通过
                console.info(this.snapPicParentFinish);
                console.info(this.filePathUrlFinish);

                if(!this.snapPicParentFinish || !this.filePathUrlFinish) {
                    this.dialogVisible = true;
                    this.dialogVisibleSpan='请先完成录像与拍照';
                } else {
                    this.pass();
                }
				this.$emit('visibility-hidden', true);

			},
			refuseFun: function() {
			    //驳回
				this.dialogFormVisible = true;
				this.$emit('visibility-hidden', true);
			},
			close: function() {
                this.$emit('after-close', false);
			},

			//通过方法
			pass: function() {
                console.log("通过成功");
                this.$emit('pass-success', true);
				var obj = {
					cmd: "CMD_Video_Result_Pass",
					data:{
						result: "200",
						desc: "通过"
					}
				}
				var resultStr = encodeURI(obj);

                BRAC_TransBuffer(AnyChat.clientData.userId,resultStr);
                console.info("发送透明通道，通过")
			},
			//驳回方法
			refuse: function() {
                console.log("驳回成功");
                this.$emit('pass-success', true);

				var obj = {
					cmd: "CMD_Video_Result",
					data:{
						result: "500",
						desc: "驳回",
						reason: this.form.region
					}
				}
				var resultStr = encodeURI(obj);
                BRAC_TransBuffer(AnyChat.clientData.userId,resultStr);
                console.info("发送透明通道，驳回")
			},
			refuseConfirm: function() {
			    //驳回原因
				this.dialogFormVisible=false;
                this.refuse();
			},

		}
	};
</script>
<style scoped>
	.accept-container {
		display: block;
		/*width: 100%;*/
		justify-content: center;
		align-items: center;
		text-align: left;
	}

	.accept-container .accept-wrap {
		display: flex;
	}

	.item {
		flex: 1;
	}

	.el-form-item__content {
		margin-left: 0 !important;
	}

	#select-reason {
		width: 100%;
	}

	.btn-confirm {
		color: #fff;
		background-color: #337ab7;
		border-color: #2e6da4;
	}

	#back {
		background: #007ECE;
	}

	.result-customer-btn {
		padding: 6px 15px;
	}
</style>
