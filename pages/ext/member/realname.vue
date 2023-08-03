<template>
	<view class="page">
		<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="filter-container d-flex">
					<view class="filter-item d-flex" style="width: 120px;">
						<uni-easyinput v-model="listQuery.uid" trim="both" placeholder="用户编号"></uni-easyinput>
					</view>
					<view class="filter-item d-flex" style="width: 120px;">
						<uni-data-select v-model="listQuery.certified" :localdata="datas.user_certified_json" placeholder="请选择状态"></uni-data-select>
					</view>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="search">查询</button>
					</view>
					<view class="filter-item d-flex">
						<button type="warn" size="mini" style="height: 35px;line-height: 35px;" :disabled="!selectedIndexs.length" @click="batchDelete()">批量删除</button>
					</view>
				</view>
				<uni-table ref="table" :loading="listLoading" type="selection" @selection-change="selectionChange" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th align="center" class="pointer" sortable @sort-change="sortChange($event, '_id')">用户编号</uni-th>
						<uni-th align="center">真实姓名</uni-th>
						<uni-th align="center">身份证号</uni-th>
						<uni-th align="center">状态</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td align="center">{{ item.id }}</uni-td>
						<uni-td align="center">{{ item.full_name || "--"}}</uni-td>
						<uni-td align="center">{{ item.id_number || "--" }}</uni-td>
						<uni-td align="center">
							<view v-if="item.certified==0">未认证</view>
							<view v-else-if="item.certified==1">已认证</view>
							<view v-else-if="item.certified==2">审核中</view>
							<view v-else-if="item.certified==3">认证失败</view>
						</uni-td>
						<uni-td align="center">
							<view class="d-flex-center">
								<view class="tag-view" v-if="item.certified==2">
									<uni-tag text="审核" type="primary" @click="showCertifiedTips(item.id)"></uni-tag>
								</view>
								<view class="tag-view">
									<uni-tag text="删除" type="error" @click="deleteItem(item.id)"></uni-tag>
								</view>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<uni-pagination show-icon show-page-size :page-size="listQuery.pageSize" :current="listQuery.currentPage"
						:total="total" @change="changeTable" @pageSizeChange="changeSize" />
				</view>
			</uni-card>
		</scroll-view>
		
		<!-- 审核提示框 -->
		<uni-popup ref="certifiedDialog" type="dialog">
			<view class="uni-popup-dialog">
				<view class="uni-dialog-title">
					<text class="uni-dialog-title-text uni-popup__info">提示</text>
				</view>
				<view class="uni-dialog-content">
					<text class="uni-dialog-content-text">请选择审核结果</text>
				</view>
				<view class="uni-dialog-button-group">
					<view class="uni-dialog-button" @click="hideDialog('certifiedDialog')">
						<text class="uni-dialog-button-text">取消</text>
					</view>
					<view class="uni-dialog-button uni-border-left" @click="certified(3)">
						<text class="uni-dialog-button-text">审核失败</text>
					</view>
					<view class="uni-dialog-button uni-border-left" @click="certified(1)">
						<text class="uni-dialog-button-text uni-button-color">审核成功</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { formatDateUtc } from '@/utils/util'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				tableData: [],
				total: 0,
				listLoading: true,
				listQuery: {
					currentPage: 1,
					pageSize: 20,
					sortField: "_id",
					sortOrder: "descending",
					uid: null,//用户编号
					certified: null,//状态
					searchKey: null,
					roles: ['user']
				},
				selectedIndexs: [],
				selectId: null,//选中ID
			}
		},
		computed: {
			...mapGetters(['datas'])
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
			//显示弹出框
			showDialog(id){
				this.$refs[id].open()
			},
			//关闭弹出框
			hideDialog(id){
				this.$refs[id].close()
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
						//初始化数据
						if(item){
							res.eventChannel.emit('initData', {data: JSON.parse(JSON.stringify(item)) })
						}else{
							res.eventChannel.emit('initData', {})
						}
					}
				})
			},
			//初始化
			init() {
				//获取用户列表
				this.getList()
			},
			//排序
			sortChange(e, name){
				if(e.order){
					this.listQuery.sortField = name
					this.listQuery.sortOrder = e.order
					this.search()
				}
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
				this.tableData = []
				//加载数据
				this.listLoading = true
				this.$api.post("/core/list/", this.listQuery, {"Mid": "User"}).then(res => {
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
							this.$api.post("/core/delete/", {"id": id}, {"Mid": "User"}).then(res => {
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
			// 多选
			selectionChange(e) {
				this.selectedIndexs = e.detail.index
			},
			//批量删除
			batchDelete(){
				if(this.selectedIndexs.length > 0){
					uni.showModal({
						title: "提示",
						content: "是否批量删除数据？",
						success: (r) => {
							if(r.confirm){
								let ids = this.selectedIndexs.map(i => this.tableData[i].id)
								uni.showLoading({
									title: '正在删除'
								})
								this.$api.post("/core/batchDelete/", {"ids": ids}, {"Mid": "User"}).then(res => {
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
				}
			},
			//打开审核提示框
			showCertifiedTips(id){
				this.selectId = id
				this.showDialog("certifiedDialog")
			},
			//提交审核结果
			certified(certified){
				uni.showLoading({
					title: '正在执行'
				})
				this.$api.post("/user/certified/", {"id": this.selectId, "certified": certified}).then(res => {
					uni.hideLoading()
					this.hideDialog('certifiedDialog')
					if(res.code == 20000){
						uni.showToast({
							title: "执行成功",
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
