<template>
	<view class="page">
		<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="filter-container d-flex">
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="search()">刷新</button>
					</view>
					<view class="filter-item d-flex">
						<button type="warn" size="mini" style="height: 35px;line-height: 35px;" @click="dumpDatabase()">备份数据库</button>
					</view>
				</view>
				<uni-table ref="table" :loading="listLoading" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th align="center">备份目录</uni-th>
						<uni-th align="center">备份时间</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td align="center">{{ item.directory }}</uni-td>
						<uni-td align="center"><uni-dateformat :date="item.add_time | formatDate"></uni-dateformat></uni-td>
						<uni-td align="center">
							<view class="d-flex-center">
								<view class="tag-view">
									<uni-tag text="恢复" type="primary" @click="restoreDatabase(item.id)"></uni-tag>
								</view>
								<view class="tag-view">
									<uni-tag text="删除" type="error" @click="deleteItem(item.id)"></uni-tag>
								</view>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<uni-pagination show-icon :page-size="listQuery.pageSize" :current="listQuery.currentPage"
						:total="total" @change="changeTable" />
				</view>
			</uni-card>
		</scroll-view>

	</view>
</template>

<script>
	import { formatDateUtc } from '@/utils/util'
	export default {
		data() {
			return {
				tableData: [],
				total: 0,
				listLoading: true,
				listQuery: {
					currentPage: 1,
					pageSize: 20
				},
			}
		},
		filters: {
		    //格式化日期
		    formatDate(time){
		    	return formatDateUtc(time)
		    }
		},
		onReady() {
			//初始化
			this.init()
		},
		methods: {
			//初始化
			init() {
				this.getList()
			},
			//查询
			search(){
				this.listQuery.currentPage = 1
				this.getList()
			},
			//获取列表
			getList() {
				this.listLoading = true
				this.$api.post("/backup/list/", this.listQuery).then(res => {
					this.listLoading = false
					this.tableData = res.data.results
					this.total = res.data.total
				})
			},
			// 分页触发
			changeTable(e) {
				this.listQuery.currentPage = e.current
				this.getList()
			},
			//删除数据
			deleteItem(id){
				uni.showModal({
					title: "提示",
					content: "是否删除该数据？",
					success: (r) => {
						if(r.confirm){
							uni.showLoading({
								title: '正在删除'
							})
							this.$api.post("/backup/delete/", {"id": id}).then(res => {
								uni.hideLoading()
								if(res.code == 20000){
									uni.showToast({
										title: "删除成功",
										icon: 'success'
									})
									this.getList()
								}else{
									uni.showToast({
										title: res.message,
										icon: 'error'
									})
								}
							})
						}
					}
				})
			},
			//执行备份
			dumpDatabase(){
				uni.showModal({
					title: "提示",
					content: "是否备份数据库？",
					success: (r) => {
						if(r.confirm){
							uni.showLoading({
								title: '正在备份'
							})
							this.$api.post("/backup/dump/").then(res => {
								uni.hideLoading()
								if(res.code == 20000){
									uni.showToast({
										title: "备份成功",
										icon: 'success'
									})
									this.getList()
								}else{
									uni.showToast({
										title: "备份失败",
										icon: 'error'
									})
								}
							})
						}
					}
				})
			},
			//执行恢复
			restoreDatabase(id){
				uni.showModal({
					title: "提示",
					content: "是否恢复该数据库？",
					success: (r) => {
						if(r.confirm){
							uni.showLoading({
								title: '正在恢复'
							})
							this.$api.post("/backup/restore/", {"id": id}).then(res => {
								uni.hideLoading()
								if(res.code == 20000){
									uni.showToast({
										title: "恢复成功",
										icon: 'success'
									})
								}else{
									uni.showToast({
										title: "恢复失败",
										icon: 'error'
									})
								}
							})
						}
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">

</style>
