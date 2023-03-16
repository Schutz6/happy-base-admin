<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true">
			
		</scroll-view>
	</view>
</template>

<script>
	import { formatDateUtc } from '@/utils/util'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		computed: {
			...mapGetters(['user'])
		},
		filters: {
		    //格式化日期
		    formatDate(time){
				return formatDateUtc(time)
		    }
		},
		onLoad() {
			
		},
		methods: {
	
		}
	}
</script>

<style scoped lang="scss">
	
</style>