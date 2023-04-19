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
	import { mapGetters } from 'vuex'
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
			}
		},
		computed: {
			...mapGetters(['menus'])
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
			//监听方法
			uni.$on('showMenus', this.showMenus)
		},
		destroyed() {
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