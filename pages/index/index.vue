<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<uni-section title="首页概况" type="line"></uni-section>
				<uni-row :gutter="4">
					<uni-col :span="6">
						<uni-card title="总用户数" :is-shadow="false">
							1000人
						</uni-card>
					</uni-col>
					<uni-col :span="6">
						<uni-card title="今日新增用户数" :is-shadow="false">
							100人
						</uni-card>
					</uni-col>
					<uni-col :span="6">
						<uni-card title="总访问量" :is-shadow="false">
							10000次
						</uni-card>
					</uni-col>
					<uni-col :span="6">
						<uni-card title="今天访问量" :is-shadow="false">
							1000次
						</uni-card>
					</uni-col>
				</uni-row>
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