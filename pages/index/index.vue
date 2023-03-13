<template>
	<view class="container overflow-hidden width-max height-max">
		<page-header></page-header>
		<view class="d-flex">
			<page-menu v-if="isPC"></page-menu>
			<view class="page">
				<scroll-view class="scroll-view-box" :scroll-y="true">
					
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				isPC: false, //是否电脑端
				isMobile: false, //是否手机端
				
			}
		},
		computed: {
			...mapGetters(['user', 'setting'])
		},
		onLoad() {
			// #ifdef H5
			if (navigator.userAgent.indexOf('Mobile') > -1) {
				this.isMobile = true
			} else {
				this.isPC = true
			}
			// #endif
		},
		onReady() {
			
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	.box {
		height: 110px;
		width: 130px;
	}
</style>
