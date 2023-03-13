<template>
	<view class="page">
		<scroll-view class="scroll-view-box" :scroll-y="true">
			表格{{user}}
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