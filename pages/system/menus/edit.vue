<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card title="编辑菜单">
				<view style="width: 550px;padding: 10px;">
					<uni-forms ref="form" :modelValue="dataForm" :rules="rules" label-width="100px">
						<uni-forms-item label="PID" name="pid" required>
							<uni-easyinput type="text" trim="both" v-model="dataForm.pid" disabled />
						</uni-forms-item>
						<uni-forms-item label="名称" name="name" required>
							<uni-easyinput type="text" trim="both" v-model="dataForm.name" />
						</uni-forms-item>
						<!-- <uni-forms-item label="图标" name="icon">
							<uni-easyinput type="text" trim="both" v-model="dataForm.icon" placeholder="示例: /icons/svg/content.svg" />
						</uni-forms-item> -->
						<uni-forms-item label="地址" name="url" required>
							<uni-easyinput type="text" trim="both" v-model="dataForm.url" />
						</uni-forms-item>
						<uni-forms-item label="角色" name="roles" required>
							<view class="d-flex" style="height: 100%;">
								<uni-data-checkbox multiple v-model="dataForm.roles" :localdata="roles"></uni-data-checkbox>
							</view>
						</uni-forms-item>
						<uni-forms-item label="状态" name="status" required>
							<view class="d-flex" style="height: 100%;">
								<uni-data-checkbox v-model="dataForm.status" :localdata="datas.menu_status_json"></uni-data-checkbox>
							</view>
						</uni-forms-item>
						<uni-forms-item label="排序(降序)" name="sort" required>
							<uni-easyinput type="text" trim="both" v-model="dataForm.sort" />
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
				roles:[], //角色列表
				loading: false,
				dataForm: {},
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					url: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					sort: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					roles: {
						rules: [{
							required: true,
							errorMessage: "请选择"
						}]
					},
					status: {
						rules: [{
							required: true,
							errorMessage: "请选择"
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
			    this.roles = res.roles
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
						this.$api.post("/menu/update/", this.dataForm).then(res => {
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
