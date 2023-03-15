<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true">
			
		</scroll-view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		computed: {
			...mapGetters(['user'])
		},
		onLoad() {
			
		},
		methods: {
	
		}
	}
</script>

<style scoped lang="scss">
	
</style>