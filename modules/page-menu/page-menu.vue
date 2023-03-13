<template>
	<view class="menu">
		<view class="menu-item" @click="toPage('/pages/index/index')" :class="activeRoute==='pages/index/index'?'active':''">
			<view class="d-flex">
				<uni-icons type="bars" size="20" color="#fff"></uni-icons>
				<view class="pdl5">首页</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeRoute: "pages/index/index"
			}
		},
		mounted() {
			//获取路由地址
			let pages = getCurrentPages()
			if(pages.length>0){
				let page = pages[pages.length - 1];
				this.activeRoute = page.route
			}
		},
		methods: {
			//跳转页面
			toPage(page){
				uni.redirectTo({
					url: page
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.menu{
		width: 180px;
		height: calc(100vh - 44px);
		background-color: #304156;
		color: #fff;
		
		.menu-item{
			padding: 20px;
			font-size: 14px;
			cursor: pointer;
		}
		.menu-item:hover{
			background-color: #263445;
		}
		.active{
			color: #409eff;
		}
		.active .uni-icons{
			color: #409eff !important;
		}
	}
</style>