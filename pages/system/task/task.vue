<template>
	<view class="page">
		<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="container">
					<view class="filter-container d-flex">
						<view class="filter-item d-flex" style="width: 180px;">
							<uni-easyinput v-model="listQuery.searchKey" trim="both" placeholder="任务名称"></uni-easyinput>
						</view>
						<view class="filter-item d-flex">
							<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="search">查询</button>
						</view>
						<view class="filter-item d-flex">
							<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="toPage('/pages/system/task/add')">新增</button>
						</view>
					</view>
					<uni-table ref="table" :loading="listLoading" border stripe emptyText="暂无更多数据">
						<uni-tr>
							<uni-th align="center">任务名称</uni-th>
							<uni-th align="center">执行方法</uni-th>
							<uni-th align="center">任务类型</uni-th>
							<uni-th align="center">任务执行计划</uni-th>
							<uni-th align="center">任务状态</uni-th>
							<uni-th align="center">配置参数</uni-th>
							<uni-th align="center">操作</uni-th>
						</uni-tr>
						<uni-tr v-for="(item, index) in tableData" :key="index">
							<uni-td align="center">{{ item.name }}</uni-td>
							<uni-td align="center">{{ item.func }}</uni-td>
							<uni-td align="center">
								<view v-if="item.type == 2">cron任务</view>
								<view v-else-if="item.type == 3">间隔任务</view>
							</uni-td>
							<uni-td align="center">
								<view v-if="item.type == 2">{{item.exec_cron}}</view>
								<view v-else-if="item.type == 3">{{item.exec_interval}}</view>
							</uni-td>
							<uni-td align="center">
								<view v-if="item.status == 0">待启动</view>
								<view v-else-if="item.status == 1" style="color: green;">已启动</view>
								<view v-else-if="item.status == 2" style="color: red;">已停止</view>
							</uni-td>
							<uni-td align="center">{{item.options || "--"}}</uni-td>
							<uni-td align="center">
								<view class="d-flex-center">
									<view class="tag-view" v-if="item.status == 0 || item.status == 2">
										<uni-tag text="启动" type="success" @click="taskStart(item.id)"></uni-tag>
									</view>
									<view class="tag-view" v-if="item.status == 1">
										<uni-tag text="停止" type="error" @click="taskStop(item.id)"></uni-tag>
									</view>
									<view class="tag-view" v-if="item.status == 0 || item.status == 2">
										<uni-tag text="编辑" type="primary" @click="toPage('/pages/system/task/edit', item)"></uni-tag>
									</view>
									<view class="tag-view" v-if="item.status == 0 || item.status == 2">
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
				</view>
			</uni-card>
		</scroll-view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				total: 0,
				listLoading: true,
				listQuery: {
					currentPage: 1,
					pageSize: 20,
					searchKey: null
				},
			}
		},
		onReady() {
			//初始化
			this.init()
		},
		methods: {
			//跳转页面
			toPage(path, item){
				uni.navigateTo({
					url: path,
					events: {
						//更新数据
						updateData: (res)=>{
							this.getList()
						}
					},
					success: (res)=>{
						if(item){
							//初始化数据
							res.eventChannel.emit('initData', { data: JSON.parse(JSON.stringify(item)) })
						}
					}
				})
			},
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
				this.$api.post("/task/list/", this.listQuery).then(res => {
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
							this.$api.post("/task/delete/", {"id": id}).then(res => {
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
			//开启任务
			taskStart(id){
				uni.showLoading({
					title: '正在启动'
				})
				this.$api.post("/task/start/", {"id": id}).then(res => {
					uni.hideLoading()
					if(res.code == 20000){
						uni.showToast({
							title: "已启动",
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
			},
			//停止任务
			taskStop(id){
				uni.showLoading({
					title: '正在停止'
				})
				this.$api.post("/task/end/", {"id": id}).then(res => {
					uni.hideLoading()
					if(res.code == 20000){
						uni.showToast({
							title: "已停止",
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
	}
</script>

<style scoped lang="scss">

</style>
