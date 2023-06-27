<template>
	<view class="page">
		<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
			<uni-card title="新增字典" style="width: 750px;">
				<view style="width: 550px;padding: 10px;">
					<uni-forms ref="form" :modelValue="dataForm" :rules="rules" label-width="100px">
						<uni-forms-item label="字典ID" name="name" required>
							<uni-easyinput type="text" trim="both" v-model="dataForm.name" />
						</uni-forms-item>
						<uni-forms-item label="字典说明" name="describe" required>
							<uni-easyinput type="text" trim="both" v-model="dataForm.describe" />
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
	export default {
		data() {
			return {
				eventChannel: null,
				loading: false,
				dataForm: {},
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					describe: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					}
				},
			}
		},
		onLoad() {
			this.eventChannel = this.getOpenerEventChannel()
			//初始化数据
			this.eventChannel.on('initData', (res)=> {
			    this.dataForm = res.data
			})
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
						this.$api.post("/dict/typeAdd/", this.dataForm).then(res => {
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
