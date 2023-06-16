<template>
	<view>
		<view class="menus" v-if="showMenus">
			<scroll-view class="sidebar" scroll-y="true">
				<uni-data-menu :value="activeUrl" :staticMenu="menus" :unique-opened="true" active-text-color="#409eff" @select="select"></uni-data-menu>
			</scroll-view>
		</view>
		<uni-drawer ref="menus" mode="left" :width="180">
			<uni-data-menu :value="activeUrl" :staticMenu="menus" :unique-opened="true" active-text-color="#409eff" @select="select"></uni-data-menu>
		</uni-drawer>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				showMenus: false,//显示菜单
				activeUrl: null,//当前地址
			}
		},
		computed: {
			...mapGetters(['menus'])
		},
		watch: {
			$route(to, form){
				if(to.path != "/pages/common/login/login"){
					this.activeUrl = to.path
				}
			}
		},
		mounted() {
			//获取当前地址
			let route = location.hash.replace("#", "")
			if(route != "/" || route != "/pages/common/login/login"){
				this.activeUrl = route
			}
			//获取页面大小
			uni.getSystemInfo({
				success: (res)=> {
					if(res.windowWidth >= 500){
						this.showMenus = true
					}
				}
			})
			//监听页面大小
			uni.onWindowResize((res) => {
				if(res.size.windowWidth >= 500){
					this.showMenus = true
				}else{
					this.showMenus = false
				}
			})
			//监听方法
			uni.$on('showLeftMenus', this.showLeftMenus)
		},
		destroyed() {
			//移除监听
			uni.$off('showLeftMenus', this.showLeftMenus)
		},
		methods: {
			//跳转页面
			toPage(page){
				//加载新页面
				history.pushState(null, null, this.website+"?path="+page)
				uni.$emit("loadPageUrl", {"url": page})
				if(this.isMobile){
					//关闭弹框
					this.$refs.menus.close()
				}
			},
			//点击菜单
			select(e) {
				this.toPage(e.value)
			},
			//显示菜单
			showLeftMenus(){
				this.$refs.menus.open()
			},
		}
	}
</script>

<style scoped lang="scss">
	.sidebar {
		width: 180px;
		height: calc(100vh - 44px);
		box-sizing: border-box;
	}
	/* #ifdef H5 */
	.sidebar ::-webkit-scrollbar {
		display: none;
	}
	/* #endif */
	.menus{
		width: 180px;
		height: calc(100vh - 44px);
		// box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.08);
		background-color: #fff;
	}
</style>