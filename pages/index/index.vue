<template>
	<view class="page">
	<!-- 	<uni-breadcrumb separator="/">
		  <uni-breadcrumb-item v-for="(route,index) in routes" :key="index" :to="route.to">
		    {{route.name}}
		  </uni-breadcrumb-item>
		</uni-breadcrumb> -->
		<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<uni-section title="会注册统计" type="line"></uni-section>
				<uni-row :gutter="4">
					<uni-col :span="6">
						<uni-card title="总会员数" :is-shadow="false">
							{{user_statistics.total_users}}
						</uni-card>
					</uni-col>
					<uni-col :span="6">
						<uni-card title="今日新增会员数" :is-shadow="false">
							{{user_statistics.today_users}}
						</uni-card>
					</uni-col>
					<uni-col :span="6">
						<uni-card title="昨日新增会员数" :is-shadow="false">
							{{user_statistics.yesterday_users}}
						</uni-card>
					</uni-col>
					<uni-col :span="6">
						<uni-card title="本月新增会员数" :is-shadow="false">
							{{user_statistics.month_users}}
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
				routes: [],
				user_statistics: {
					"total_users": 0,
					"today_users": 0,
					"yesterday_users": 0,
					"month_users": 0
				},
			}
		},
		onLoad() {
			this.init()
		},
		computed: {
			...mapGetters(['user'])
		},
		methods: {
			init() {
				//获取会员统计数据
				this.$api.get("/statistics/user/").then(res => {
					if (res.code == 20000) {
						this.user_statistics = res.data
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
