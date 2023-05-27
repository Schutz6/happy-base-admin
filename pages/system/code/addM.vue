<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card title="新增模块代码" style="padding-bottom: 100px;">
				<view style="padding: 10px;">
					<uni-forms ref="form" :modelValue="dataForm" :rules="rules" label-position="top">
						<uni-forms-item label="模块代码" name="code" required>
							<uni-easyinput type="textarea" trim="both" :autoHeight="true" :maxlength="-1" v-model="dataForm.code" />
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
				dataForm: {
					code: null
				},
				rules: {
					code: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						},{
							validateFunction:function(rule,value,data,callback){
								//检查代码格式
								let code = JSON.parse(value)
								let num = 0
								for (let key in code){
									if(['mid', 'name', 'cache', 'api_json', 'table_json'].includes(key)){
										num += 1
									}
								}
								if(num > 5){
									callback('代码格式错误')
								}
								return true
							}
						}]
					}
				},
			}
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
						this.$api.post("/code/add/", JSON.parse(this.dataForm.code)).then(res => {
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

<style scoped lang="scss">
	.box{
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 5px 10px;
		
		.item{
			padding: 2px 0;
		}
	}
</style>
