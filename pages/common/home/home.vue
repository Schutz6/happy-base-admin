<template>
	<view class="container overflow-hidden width-max height-max">
		<page-header></page-header>
		<view class="d-flex">
			<page-menu></page-menu>
			<view class="page">
				<iframe v-if="toPageUrl" :src="toPageUrl" frameborder="0" style="width: 100%;height: 100%;"></iframe>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				website: "",//网址
				path: "/pages/index/index",//地址
				toPageUrl: null,//跳转页面
			}
		},
		computed: {
			...mapGetters(['user', 'setting'])
		},
		onLoad(options) {
			//初始化网址
			this.website = location.origin+location.pathname+"#"
			if(options.path){
				this.path = options.path
			}
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
			this.loadPageUrl({"url": this.path})
			
		},
		methods: {
			//加载页面
			loadPageUrl(data){
				let url = data.url
				if(url.indexOf('http') === 0){
					//内部页面打开
					// this.toPageUrl = url
					//打开新窗口
					window.open(url)
				}else{
					this.toPageUrl = this.website+url
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	
</style>
