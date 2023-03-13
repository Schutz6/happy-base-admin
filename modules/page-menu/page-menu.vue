<template>
	<view>
		<view class="menus" v-if="isPC">
			<uni-data-menu :localdata="menus" :unique-opened="true" :active="activeUrl" active-text-color="#409eff" @select="select"></uni-data-menu>
		</view>
		<uni-drawer v-if="isMobile" ref="menus" mode="left" :width="240">
			<uni-data-menu :localdata="menus" :unique-opened="true" :active="activeUrl" active-text-color="#409eff" @select="select"></uni-data-menu>
		</uni-drawer>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				website: "",//网址
				isPC: false, //是否电脑端
				isMobile: false, //是否手机端
				activeUrl: '/pages/index/index',
				menus: [{
					text: "首页",
					icon: 'uni-icons-home',
					value: "/pages/index/index"
				}, {
					menu_id: "demo",
					text: '静态功能演示',
					icon: '',
					value: "",
					children: [
						{
							text: '百度一下',
							value: 'http://www.bootstrapmb.com/popular'
						},
					{
						menu_id: "icons",
						text: '图标',
						icon: '',
						value: '/pages/icons'
					}, {
						menu_id: "table",
						text: '表格',
						icon: '',
						value: '/pages/table'
					}]
				}]
			}
		},
		mounted() {
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
			}
		}
	}
</script>

<style scoped lang="scss">
	.menus{
		width: 240px;
		height: calc(100vh - 44px);
		box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.08);
	}
</style>