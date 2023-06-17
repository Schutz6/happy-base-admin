<template>
	<view class="page">
		<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
			<uni-card title="编辑参数">
				<view style="width: 550px;padding: 10px;">
					<uni-forms ref="form" :modelValue="dataForm" :rules="rules" label-width="100px">
						<uni-forms-item label="唯一ID" name="key" required>
							<uni-easyinput type="text" trim="both" v-model="dataForm.key" disabled />
						</uni-forms-item>
						<uni-forms-item label="参数值" name="value" required>
							<uni-easyinput type="textarea" :auto-height="true" trim="both" v-model="dataForm.value" />
						</uni-forms-item>
						<uni-forms-item label="备注" name="remarks" required>
							<uni-easyinput type="textarea" :auto-height="true" trim="both" v-model="dataForm.remarks" />
						</uni-forms-item>
						<uni-forms-item label="状态" name="status" required>
							<view class="d-flex" style="height: 100%;">
								<uni-data-checkbox v-model="dataForm.status" :localdata="datas.param_status_json"></uni-data-checkbox>
							</view>
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
				dataForm: {},
				rules: {
					key: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					value: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					remarks: {
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
						this.$api.post("/param/update/", this.dataForm).then(res => {
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
