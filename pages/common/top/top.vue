<template>
	<view>
		<view class="header d-flex between">
			<view class="d-flex" v-if="user && user.roles.includes('user')">
				<view class="title">
					{{projects[0].text}}
				</view>
			</view>
			<view class="d-flex" v-else>
				<uni-icons v-show="showBars" class="pointer" @click="showLeftMenus" type="bars" size="24" color="#fff"></uni-icons>
				<view v-if="project">
					<view v-if="projects.length>1" class="d-flex-center pointer" @click="showDialog('showProjectLeft', false)">
						<view class="d-flex-center title">{{project.text}}</view>
						<uni-icons type="bottom" size="19" color="#ffffff" style="margin-left: 5px;"></uni-icons>
					</view>
					<view v-else class="title">
						{{project.text}}
					</view>
				</view>
			</view>
			<view class="d-flex" v-if="user">
				<view class="d-flex-center pointer" @click="showDialog('showMenuRight', false)">
					<view class="d-flex-center username">{{user.name}}</view>
					<uni-icons type="bottom" size="19" color="#ffffff"></uni-icons>
				</view>
			</view>
		</view>
		
		<!-- 修改密码弹框 -->
		<uni-popup ref="updatePasswordDialog" type="center" :mask-click="false" :animation="false">
			<uni-card title="修改密码">
				<uni-forms ref="form" :modelValue="passwordForm" :rules="passwordRules">
					<uni-forms-item name="oldPassword">
						<uni-easyinput type="password" trim="both" v-model="passwordForm.oldPassword" placeholder="原密码" />
					</uni-forms-item>
					<uni-forms-item name="newPassword">
						<uni-easyinput type="password" trim="both" v-model="passwordForm.newPassword" placeholder="新密码" />
					</uni-forms-item>
				</uni-forms>
				<view class="d-flex-center" style="width: 240px;margin: 0 auto;padding-top: 10px;">
					<button type="primary" :loading="loading" @click="updatePassword" style="font-size: 14px;width: 100px;">修改</button>
					<button type="default" :loading="loading" @click="hideDialog('updatePasswordDialog')" style="font-size: 14px;width: 100px;">取消</button>
				</view>
			</uni-card>
		</uni-popup>
		
		<!-- 右侧弹出菜单 -->
		<uni-popup ref="showMenuRight" type="right" mask-background-color="rgba(0,0,0,0)">
			<view class="d-flex flex-column popup-box" style="margin-right: 20px;">
				<view class="item pointer" @click="showDialog('updatePasswordDialog', true)">修改密码</view>
				<view class="item pointer" @click="showDialog('logoutDialog', true)">退出登录</view>
			</view>
		</uni-popup>
		
		<!-- 左侧弹出项目 -->
		<uni-popup ref="showProjectLeft" type="left" mask-background-color="rgba(0,0,0,0)">
			<view class="d-flex flex-column popup-box" style="margin-left: 20px;">
				<view class="item pointer" v-for="(item, index) in projects" :key="index" @click="switchProject(index)">{{item.text}}</view>
			</view>
		</uni-popup>
		
		<!-- 确认退出框 -->
		<uni-popup ref="logoutDialog" type="dialog">
			<uni-popup-dialog type="info" cancelText="取消" confirmText="确定" title="提示" content="是否退出登录？" @confirm="logout"></uni-popup-dialog>
		</uni-popup>
		
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				showBars: false,
				loading: false,
				passwordForm: {
					type: 1,
					oldPassword: '',
					newPassword: ''
				},
				passwordRules: {
					oldPassword: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					newPassword: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					}
				}
			}
		},
		computed: {
		    ...mapGetters(['user', 'params', 'project', 'projects'])
		},
		mounted() {
			//获取页面大小
			uni.getSystemInfo({
				success: (res)=> {
					if(res.windowWidth < 768){
						this.showBars = true
					}
				}
			})
			//监听页面大小
			uni.onWindowResize((res) => {
				if(res.size.windowWidth >= 768){
					this.showBars = false
				}else{
					this.showBars = true
				}
			})
		},
		methods: {
			//切换项目
			switchProject(index){
				this.hideDialog('showProjectLeft')
				//设置当前项目
				this.$store.commit('setProject', this.projects[index])
				this.$store.commit('filterMenus')
				//刷新页面
				uni.reLaunch({
					url: "/"
				});
			},
			//显示左侧菜单
			showLeftMenus(){
				uni.$emit("showLeftMenus", {})
			},
			//显示弹出框
			showDialog(id, flag){
				if(flag){
					this.$refs["showMenuRight"].close()
				}
				this.$refs[id].open()
			},
			//关闭弹出框
			hideDialog(id){
				this.$refs[id].close()
			},
			//退出登录
			logout(){
				this.$api.get("/logout/")
				//跳转到登陆
				uni.reLaunch({
					url: '/pages/common/login/login'
				})
			},
			//修改密码
			updatePassword(){
				this.$refs.form.validate().then(res => {
					if (!this.loading) {
						this.loading = true
						uni.showLoading({
							title: '正在登录'
						})
						this.$api.post("/changePwd/", this.passwordForm).then(res => {
							this.loading = false
							uni.hideLoading()
							if (res.code == 20000) {
								this.hideDialog("updatePasswordDialog")
								uni.showToast({
									title: "修改成功",
									icon: 'success'
								})
								setTimeout(()=>{
									uni.reLaunch({
										url: '/pages/common/login/login'
									});
								}, 500)
							}else if(res.code == 10005){
								uni.showToast({
									title: "用户不存在",
									icon: 'error'
								})
							}else if(res.code == 10006){
								uni.showToast({
									title: "密码错误",
									icon: 'error'
								})
							}else{
								uni.showToast({
									title: "账号错误",
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
	.header{
		background-color: #2b2f3a;
		box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.08);
		color: #fff;
		height: 44px;
		padding: 0 20px;
		
		.title{
			font-size: 16px;
			font-weight: bold;
		}
		
		.username{
			padding-right: 5px;
			font-size: 14px;
		}
		
		.logout{
			color: #409eff;
			font-size: 14px;
			cursor: pointer;
		}
	}
	
	.popup-box{
		background-color: #ffffff;
		box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.1);
		
		.item{
			font-size: 14px;
			padding: 10px 20px;
			border-bottom: 1px solid #f7f7f7;
		}
		.item:hover{
			color: #409eff;
		}
		.item:last-child{
			border-bottom: none;
		}
	}
	
</style>