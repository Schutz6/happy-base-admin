<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card title="新增任务">
				<view style="width: 550px;padding: 10px;">
					<uni-forms ref="form" :modelValue="dataForm" :rules="rules" label-width="100px">
						<uni-forms-item label="任务名称" name="name" required>
							<uni-easyinput type="text" trim="both" v-model="dataForm.name" />
						</uni-forms-item>
						<uni-forms-item label="执行方法" name="func" required>
							<uni-easyinput type="text" trim="both" v-model="dataForm.func" placeholder="core.tasks.tasks:test" />
						</uni-forms-item>
						<uni-forms-item label="任务类型" name="type" required>
							<view class="d-flex" style="height: 100%;">
								<uni-data-checkbox v-model="dataForm.type" :localdata="datas.task_type_json"></uni-data-checkbox>
							</view>
						</uni-forms-item>
						<uni-forms-item v-if="dataForm.type==2" label="cron指令" name="exec_cron" required>
							<view style="font-size: 12px;color: red;">
								<view>指令说明：</view>
								<view>每天一点执行：1:00D</view>
							</view>
							<uni-easyinput type="text" trim="both" v-model="dataForm.exec_cron" />
						</uni-forms-item>
						<uni-forms-item v-if="dataForm.type==3" label="间隔指令" name="exec_interval" required>
							<view style="font-size: 12px;color: red;">
								<view>指令说明：</view>
								<view>间隔秒触发 1S（S表示秒）</view>
								<view>间隔分钟触发 1M（M表示分钟）</view>
								<view>间隔小时触发 1H（H表示小时）</view>
								<view>间隔天触发 1D（D表示天）</view>
								<view>间隔周触发 1W（W表示周）</view>
							</view>
							<uni-easyinput type="text" trim="both" v-model="dataForm.exec_interval" />
						</uni-forms-item>
						<uni-forms-item label="配置参数" name="options">
							<uni-easyinput type="text" trim="both" v-model="dataForm.options" />
						</uni-forms-item>
					</uni-forms>
					<view class="d-flex-center" style="width: 240px;margin: 0 auto;padding-top: 20px;">
						<button type="primary" :loading="loading" @click="submit" style="font-size: 14px;width: 100px;">提交</button>
						<button type="default" :loading="loading" @click="back" style="font-size: 14px;width: 100px;">返回</button>
					</view>
				</view>
			</uni-card>
		</scroll-view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				eventChannel: null,
				loading: false,
				dataForm: {
					name: '',
					func: '',
					type: 3,
					exec_cron: "",
					exec_interval: "",
					status: 0,
					options: ""
				},
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					func: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					exec_cron: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					exec_interval: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					}
				},
			}
		},
		computed: {
			...mapGetters(['datas'])
		},
		onLoad() {
			this.eventChannel = this.getOpenerEventChannel()
		},
		methods: {
			//返回
			back(){
				uni.navigateBack()
			},
			//提交
			submit(){
				this.$refs.form.validate().then(res => {
					if (!this.loading) {
						this.loading = true
						uni.showLoading({
							title: '正在提交'
						})
						this.$api.post("/task/add/", this.dataForm).then(res => {
							this.loading = false
							uni.hideLoading()
							if(res.code == 20000){
								uni.showToast({
									title: "提交成功",
									icon: 'success'
								})
								setTimeout(()=>{
									this.back()
									this.eventChannel.emit("updateData", {})
								}, 600)
							}else{
								uni.showToast({
									title: res.message,
									icon: 'error'
								})
							}
						})
					}
				})
			}
		}
	}
</script>

<style>

</style>
