<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				表格{{user}}
			</uni-card>
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
		onLoad() {
			
		},
		computed: {
			...mapGetters(['user'])
		},
		methods: {
	
		}
	}
</script>

<style scoped lang="scss">
	
</style>