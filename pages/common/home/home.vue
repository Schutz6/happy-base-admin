<template>
	<view class="container overflow-hidden width-max height-max">
		<page-header></page-header>
		<view class="d-flex">
			<page-menu></page-menu>
			<web-view v-if="toPageUrl" :src="toPageUrl" :webview-styles="{'progress': true}" :style="{'top': top+'px', 'left': left+'px'}"></web-view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				website: "",//网址
				toPageUrl: null,//跳转页面
				top: 44,
				left: 0,
			}
		},
		computed: {
			...mapGetters(['user', 'setting'])
		},
		onLoad() {
			//初始化网址
			this.website = location.origin+location.pathname+"#"
			// #ifdef H5
			if (navigator.userAgent.indexOf('Mobile') > -1) {
				this.left = 0
			} else {
				this.left = 240
			}
			// #endif
		},
		onShow() {
			//监听方法
			uni.$on('loadPageUrl', this.loadPageUrl)
		},
		onHide() {
			//移除监听
			uni.$off('loadPageUrl', this.loadPageUrl)
		},
		onReady() {
			//加载首页
			this.loadPageUrl({"url": "/pages/index/index"})
		},
		methods: {
			//加载页面
			loadPageUrl(data){
				let url = data.url
				if(url.startsWith("http")){
					this.toPageUrl = url
				}else{
					this.toPageUrl = this.website+url
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	
</style>
