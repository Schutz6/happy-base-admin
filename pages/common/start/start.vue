<template>
	<view class="container overflow-hidden width-max height-max">
		<view class="d-flex-center height-max">
			<uni-load-more status="loading" :showText="false" />
		</view>
	</view>
</template>

<script>
	import { getTitle } from '@/utils/auth'
	export default {
		onLoad() {
			uni.setNavigationBarTitle({
				title: getTitle()
			})
			//获取用户信息
			this.$store.dispatch('getUserInfo').then(res => {
				if (res.code == 20000) {
					uni.reLaunch({
						url: '/pages/common/home/home'
					})
				}else{
					uni.reLaunch({
						url: '/pages/common/login/login'
					})
				}
			})
		}
	}
</script>

<style>

</style>
