<template>
	<view class="container overflow-hidden width-max height-max">
		<module-header></module-header>
		<view class="d-flex">
			<module-menu :active-url="path"></module-menu>
			<view class="page">
				<!-- #ifdef H5 -->
				<iframe ref="pageFrame" v-show="!loading" :src="toPageUrl" frameborder="0" style="width: 100%;height: 100%;"></iframe>
				<!-- #endif -->
				<view v-if="loading" class="d-flex-center" style="padding: 20px;">
					<uni-load-more status="loading" :showText="false" />
				</view>
			</view>
		</view>
		
		<!-- 全局提示框 -->
		<uni-popup ref="tipsDialog" type="dialog">
			<uni-popup-dialog type="info" cancelText="取消" confirmText="确定" title="提示" :content="tips" @confirm="onTipsConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				loading: true,
				website: "",//网址
				path: "",//地址
				toPageUrl: null,//跳转页面
				pageFrame: null,//容器页面
				pageFrameMessage: {},//容器页面消息
				tips: ""
			}
		},
		computed: {
			...mapGetters(['user', 'menus'])
		},
		async onLoad(options) {
			//获系统参数设置
			let res = await this.$api.getAsync("/param/getList/")
			if(res.code == 20000){
				this.$store.commit('setParams', res.data)
			}
			//获取用户信息
			let userRes = await this.$api.getAsync("/user/")
			if(userRes.code == 20000){
				//更新用户数据
				this.$store.commit('setUser', userRes.data)
				//更新菜单数据
				this.$store.dispatch('getMenus')
			}
			//初始化网址
			this.website = location.origin+location.pathname+"#"
			if(options.path){
				this.path = options.path
			}
			//监听菜单点击页面
			uni.$on('loadPageUrl', this.loadPageUrl)
			// #ifdef H5
			//初始化容器页面
			this.pageFrame = this.$refs.pageFrame
			//监听页面是否加载完成
			this.pageFrame.addEventListener('load', this.onPageLoadEnd, true)
			this.$nextTick(() => {
				//监听消息
				window.addEventListener('message', this.handleMessage)
			})
			// #endif
			if(this.path){
				this.loadPageUrl({"url": this.path})
			}else{
				//默认加载第一个页面
				for(let i=0;i<this.menus.length;i++){
					let menu = this.menus[i]
					if(menu.value == "#"){
						let flag = false
						//查看是否有子菜单
						for(let j=0;j<menu.children.length;j++){
							let menu = menu.children[j]
							if(menu.value != "#"){
								flag = true
								//加载页面
								this.path = menu.value
								break
							}
						}
						//判断是否加载了页面
						if(flag){
							break
						}
					}else{
						//加载页面
						this.path = menu.value
						break
					}
				}
				if(this.path){
					this.loadPageUrl({"url": this.path})
				}
			}
		},
		destroyed () {
			//移除消息监听
			// #ifdef H5
			window.removeEventListener('message', this.handleMessage);
			// #endif
			
		},
		methods: {
			//处理消息
			handleMessage(event){
				if(event.data){
					this.pageFrameMessage = event.data
					let obj = event.data
					switch (obj.cmd) {
						case 'tips':
							//弹出提示框
							this.tips = obj.data.tips
							this.$refs.tipsDialog.open()
						break;
					}
				}
			},
			//加载页面
			loadPageUrl(data){
				let url = data.url
				if(url.indexOf('http') === 0){
					//内部页面打开
					// this.toPageUrl = url
					//打开新窗口
					window.open(url)
				}else{
					if(this.toPageUrl != this.website+url){
						this.loading = true
						this.toPageUrl = this.website+url
					}
				}
			},
			//页面加载完成
			onPageLoadEnd(){
				this.loading = false
			},
			//提示框点击确认
			onTipsConfirm(){
				this.pageFrame.contentWindow.postMessage(this.pageFrameMessage , '*')
			}
		}
	}
</script>

<style scoped lang="scss">
	
</style>
