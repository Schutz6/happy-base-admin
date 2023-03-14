<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="filter-container d-flex">
					<view class="filter-item d-flex" style="width: 210px;">
						<uni-easyinput v-model="listQuery.searchKey" trim="both" placeholder="唯一ID/角色名称"></uni-easyinput>
					</view>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="search">查询</button>
					</view>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="toPage('/pages/system/role/add')">新增</button>
					</view>
				</view>
				<uni-table ref="table" :loading="listLoading" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th align="center">唯一ID</uni-th>
						<uni-th align="center">角色名称</uni-th>
						<uni-th align="center">备注</uni-th>
						<uni-th align="center">时间</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td align="center">{{ item.name }}</uni-td>
						<uni-td align="center">{{ item.describe }}</uni-td>
						<uni-td align="center">{{item.remarks}}</uni-td>
						<uni-td align="center"><uni-dateformat :date="item.add_time"></uni-dateformat></uni-td>
						<uni-td align="center">
							<view class="d-flex-center">
								<view class="tag-view">
									<uni-tag text="编辑" type="primary" @click="toPage('/pages/system/role/edit', item)"></uni-tag>
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
		
		<uni-popup ref="deleteDialog" type="dialog">
			<uni-popup-dialog type="info" cancelText="取消" confirmText="确定" title="提示" content="是否删除该数据？" @confirm="deleteItem"></uni-popup-dialog>
		</uni-popup>
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
					pageSize: 15,
					searchKey: ""
				},
				dialogData:{}
			}
		},
		onReady() {
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
				this.$api.post("/role/list/", this.listQuery).then(res => {
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
				this.dialogData.id = id
				this.$refs.deleteDialog.open()
			},
			//删除数据
			deleteItem(){
				this.$api.post("/role/delete/", {"id": this.dialogData.id}).then(res => {
					uni.showToast({
						title: "删除成功",
						icon: 'success'
					})
					this.getList()
				})
			},
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
							res.eventChannel.emit('initData', { data: item })
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
