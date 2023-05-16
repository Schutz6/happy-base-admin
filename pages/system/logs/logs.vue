<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="filter-container d-flex">
					<view class="filter-item d-flex" style="width: 210px;">
						<uni-easyinput v-model="listQuery.searchKey" trim="both" placeholder="账号/接口地址/IP地址"></uni-easyinput>
					</view>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="search">查询</button>
					</view>
					<view class="filter-item d-flex">
						<button type="warn" size="mini" style="height: 35px;line-height: 35px;" :disabled="!selectedIndexs.length" @click="showBatchDelete">批量删除</button>
					</view>
					<view class="filter-item d-flex">
						<button type="warn" size="mini" style="height: 35px;line-height: 35px;" @click="showClear">清空</button>
					</view>
				</view>
				<uni-table ref="table" :loading="listLoading" type="selection" @selection-change="selectionChange" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th align="center">账号</uni-th>
						<uni-th align="center">接口类型</uni-th>
						<uni-th align="center">接口地址</uni-th>
						<uni-th align="center" width="300">请求参数</uni-th>
						<uni-th align="center">IP地址</uni-th>
						<uni-th align="center">耗时</uni-th>
						<uni-th align="center">时间</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td align="center">{{ item.username || "--" }}</uni-td>
						<uni-td align="center">{{ item.method }}</uni-td>
						<uni-td align="center">{{item.uri}}</uni-td>
						<uni-td align="center">
							<text class="wrap">{{item.params || "--"}}</text>
						</uni-td>
						<uni-td align="center">{{item.ip}}</uni-td>
						<uni-td align="center">{{item.times}}ms</uni-td>
						<uni-td align="center"><uni-dateformat :date="item.add_time | formatDate"></uni-dateformat></uni-td>
				
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<uni-pagination show-icon show-page-size :page-size="listQuery.pageSize" :current="listQuery.currentPage"
						:total="total" @change="changeTable" @pageSizeChange="changeSize" />
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
					pageSize: 20,
					searchKey: null
				},
				selectedIndexs: [],
			}
		},
		filters: {
		    //格式化日期
		    formatDate(time){
		    	return formatDateUtc(time)
		    }
		},
		onReady() {
			// 监听消息
			// #ifdef H5
			window.addEventListener("message", this.handleMessage)
			// #endif
			//初始化
			this.init()
		},
		methods: {
			//处理消息
			handleMessage(event){
				if(event.data){
					let obj = event.data
					switch (obj.cmd) {
						case 'tips':
							//弹出提示框，点击确认回调
							if(obj.func === "clear"){
								//清空日志
								this.clear()
							}else if(obj.func === "batchDelete"){
								//批量删除
								this.batchDelete()
							}
							break;
					}
				}
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
				//清空选择
				this.clearSelection()
				//加载数据
				this.listLoading = true
				this.$api.post("/log/list/", this.listQuery).then(res => {
					this.listLoading = false
					this.tableData = res.data.results
					this.total = res.data.total
				})
			},
			//分页触发
			changeTable(e) {
				this.listQuery.currentPage = e.current
				this.getList()
			},
			//改变大小
			changeSize(pageSize) {
				this.listQuery.pageSize = pageSize
				this.listQuery.currentPage = 1
				this.$nextTick(() => {
					this.getList()
				})
			},
			//清空选择
			clearSelection(){
				if(this.selectedIndexs.length > 0){
					this.selectedIndexs.length = 0
					this.$refs.table.clearSelection()
				}
			},
			//弹出清空提示框
			showClear(){
				window.parent.postMessage({"cmd": "tips", "func": "clear", "data": {"tips": "是否清空系统日志？"}}, '*')
			},
			//清空日志
			clear(){
				uni.showLoading({
					title: '正在删除'
				})
				this.$api.get("/log/clear/").then(res => {
					uni.hideLoading()
					if(res.code == 20000){
						uni.showToast({
							title: "删除成功",
							icon: 'success'
						})
						this.getList()
					}
				})
			},
			//弹出批量删除提示框
			showBatchDelete(){
				if(this.selectedIndexs.length > 0){
					window.parent.postMessage({"cmd": "tips", "func": "batchDelete", "data": {"tips": "是否批量删除数据？"}}, '*')
				}
			},
			// 多选
			selectionChange(e) {
				this.selectedIndexs = e.detail.index
			},
			//批量删除
			batchDelete(){
				if(this.selectedIndexs.length > 0){
					let ids = this.selectedIndexs.map(i => this.tableData[i].id)
					uni.showLoading({
						title: '正在删除'
					})
					this.$api.post("/log/batchDelete/", {"ids": ids}).then(res => {
						uni.hideLoading()
						if(res.code == 20000){
							uni.showToast({
								title: "删除成功",
								icon: 'success'
							})
							this.getList()
						}
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
