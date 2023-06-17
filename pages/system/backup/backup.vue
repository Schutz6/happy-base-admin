<template>
	<view class="page">
		<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="filter-container d-flex">
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="search()">刷新</button>
					</view>
					<view class="filter-item d-flex">
						<button type="warn" size="mini" style="height: 35px;line-height: 35px;" @click="showDumpTips()">备份数据库</button>
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
									<uni-tag text="恢复" type="primary" @click="showRestoreTips(item.id)"></uni-tag>
								</view>
								<view class="tag-view">
									<uni-tag text="删除" type="error" @click="showDeleteTips(item.id)"></uni-tag>
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
				selectId: null,//选中ID
			}
		},
		filters: {
		    //格式化日期
		    formatDate(time){
		    	return formatDateUtc(time)
		    }
		},
		onShow() {
			// 监听消息
			uni.$on('onHandleMessage', this.onHandleMessage)
		},
		onHide() {
			// 移除消息
			uni.$off('onHandleMessage', this.onHandleMessage)
		},
		onReady() {
			//初始化
			this.init()
		},
		methods: {
			//处理消息
			onHandleMessage(data){
				switch (data.cmd) {
					case 'tips':
						//弹出提示框，点击确认回调
						if(data.func === "deleteItem"){
							//执行删除方法
							this.deleteItem()
						}else if(data.func === "dumpDatabase"){
							//备份数据库
							this.dumpDatabase()
						}else if(data.func === "restoreDatabase"){
							//恢复数据库
							this.restoreDatabase()
						}
						break;
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
			//显示删除提示
			showDeleteTips(id){
				this.selectId = id
				uni.$emit("showOpenDialog", {"cmd": "tips", "func": "deleteItem", "tipContent": "是否删除该数据？"})
			},
			//删除数据
			deleteItem(){
				uni.showLoading({
					title: '正在删除'
				})
				this.$api.post("/backup/delete/", {"id": this.selectId}).then(res => {
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
			},
			//显示是否备份数据库
			showDumpTips(){
				uni.$emit("showOpenDialog", {"cmd": "tips", "func": "dumpDatabase", "tipContent": "是否备份数据库？"})
			},
			//执行备份
			dumpDatabase(){
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
			},
			//显示是否恢复数据库
			showRestoreTips(id){
				this.selectId = id
				uni.$emit("showOpenDialog", {"cmd": "tips", "func": "restoreDatabase", "tipContent": "是否恢复该数据库？"})
			},
			//执行恢复
			restoreDatabase(){
				uni.showLoading({
					title: '正在恢复'
				})
				this.$api.post("/backup/restore/", {"id": this.selectId}).then(res => {
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
			},
		}
	}
</script>

<style scoped lang="scss">

</style>
