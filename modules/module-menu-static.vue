<template>
	<view>
		<view class="menus" v-if="isPC">
			<scroll-view class="sidebar" scroll-y="true">
				<uni-data-menu :value="activeUrl" :staticMenu="menus" :unique-opened="true" active-text-color="#409eff" @select="select"></uni-data-menu>
			</scroll-view>
		</view>
		<uni-drawer v-if="isMobile" ref="menus" mode="left" :width="240">
			<uni-data-menu :value="activeUrl" :staticMenu="menus" :unique-opened="true" active-text-color="#409eff" @select="select"></uni-data-menu>
		</uni-drawer>
	</view>
</template>

<script>
	export default {
		props: {
			activeUrl: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				website: "",//网址
				isPC: false, //是否电脑端
				isMobile: false, //是否手机端
				menus: [
					{
						text: "首页概况",
						value: "/pages/index/index"
					},
					{
						text: '系统管理',
						children: [
							{
								text: '用户管理',
								value: '/pages/system/user/user'
							}, 
							{
								text: '角色管理',
								value: '/pages/system/role/role'
							},
							{
								text: '菜单管理',
								value: '/pages/system/menus/menus'
							},
							{
								text: '字典管理',
								value: '/pages/system/dict/dict'
							},
							{
								text: '参数管理',
								value: '/pages/system/param/param'
							},
							{
								text: '任务管理',
								value: '/pages/system/task/task'
							},
							{
								text: '文件管理',
								value: '/pages/system/files/files'
							},
							{
								text: '系统日志',
								value: '/pages/system/logs/logs'
							},
						]
					},
				]
			}
		},
		mounted(options) {
			//初始化网址
			this.website = location.origin+location.pathname+"#/pages/common/home/home"
			
			// #ifdef H5
			if (navigator.userAgent.indexOf('Mobile') > -1) {
				this.isMobile = true
			} else {
				this.isPC = true
			}
			// #endif
			// //获取路由地址
			// let pages = getCurrentPages()
			// if(pages.length>0){
			// 	let page = pages[pages.length - 1];
			// 	this.activeRoute = page.route
			// }
			console.log("mounted----")
			//监听方法
			uni.$on('showMenus', this.showMenus)
		},
		destroyed() {
			console.log("destroyed----")
			//移除监听
			uni.$off('showMenus', this.showMenus)
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
			showMenus(){
				this.$refs.menus.open()
			},
		}
	}
</script>

<style scoped lang="scss">
	.sidebar {
		position: fixed;
		width: 240px;
		height: calc(100vh - 44px);
		box-sizing: border-box;
	}
	/* #ifdef H5 */
	.sidebar ::-webkit-scrollbar {
		display: none;
	}
	/* #endif */
	.menus{
		width: 240px;
		height: calc(100vh - 44px);
		// box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.08);
		background-color: #fff;
	}
</style>