<template>
	<view class="page">
		<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="filter-container d-flex">
					<view class="filter-item d-flex" style="width: 180px;">
						<uni-easyinput v-model="listQuery.searchKey" trim="both" placeholder="账号/昵称"></uni-easyinput>
					</view>
					<view class="filter-item d-flex" style="width: 120px;">
						<uni-data-select v-model="listQuery.role" :localdata="roles" placeholder="请选择角色"></uni-data-select>
					</view>
					<view class="filter-item d-flex" style="width: 120px;">
						<uni-data-select v-model="listQuery.status" :localdata="datas.user_status_json" placeholder="请选择状态"></uni-data-select>
					</view>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="search">查询</button>
					</view>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="toPage('/pages/system/user/add')">新增</button>
					</view>
					<view class="filter-item d-flex">
						<button type="warn" size="mini" style="height: 35px;line-height: 35px;" :disabled="!selectedIndexs.length" @click="showBatchDelete">批量删除</button>
					</view>
				</view>
				<uni-table ref="table" :loading="listLoading" type="selection" @selection-change="selectionChange" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th align="center" class="pointer" sortable @sort-change="sortChange($event, '_id')">用户编号</uni-th>
						<uni-th align="center">头像</uni-th>
						<uni-th align="center" class="pointer" sortable @sort-change="sortChange($event, 'name')">账号</uni-th>
						<uni-th align="center">昵称</uni-th>
						<uni-th align="center">角色</uni-th>
						<uni-th align="center">状态</uni-th>
						<uni-th align="center">最后登录时间</uni-th>
						<uni-th align="center">最后登录IP</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td align="center">{{ item.id }}</uni-td>
						<uni-td align="center">
							<img :src="item.avatar" style="width: 40px;height: 40px;border-radius: 20px;" />
						</uni-td>
						<uni-td align="center">{{ item.username }}</uni-td>
						<uni-td align="center">{{ item.name }}</uni-td>
						<uni-td align="center">{{formatRoles(item.roles)}}</uni-td>
						<uni-td align="center">
							<view v-if="item.status==1" style="color: green;">正常</view>
							<view v-else-if="item.status==2" style="color: red;">禁用</view>
						</uni-td>
						<uni-td align="center">
							<view v-if="item.last_time"><uni-dateformat :date="item.last_time | formatDate"></uni-dateformat></view>
							<view v-else>--</view>
						</uni-td>
						<uni-td align="center">{{item.last_ip || "--"}}</uni-td>
						<uni-td align="center">
							<view class="d-flex-center">
								<view class="tag-view">
									<uni-tag text="编辑" type="primary" @click="toPage('/pages/system/user/edit', item)"></uni-tag>
								</view>
								<view class="tag-view">
									<uni-tag text="删除" type="error" @click="showDeleteTips(item.id)"></uni-tag>
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
					roles: [],//角色
					status: null,//状态
					searchKey: null
				},
				selectedIndexs: [],
				selectId: null,//选中ID
				roles:[], //角色列表
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
						}else if(data.func === "batchDelete"){
							//批量删除
							this.batchDelete()
						}
						break;
				}
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
							res.eventChannel.emit('initData', { roles: this.roles, data: JSON.parse(JSON.stringify(item)) })
						}else{
							res.eventChannel.emit('initData', { roles: this.roles })
						}
					}
				})
			},
			//初始化
			init() {
				//获取角色列表
				this.getRoleList(()=>{
					//获取用户列表
					this.getList()
				})
			},
			//角色列表
			getRoleList(callback){
				this.$api.get("/role/getList/").then(res => {
					if(res.code == 20000){
						this.roles = res.data
						callback()
					}
				})
			},
			//格式化角色
			formatRoles(roles){
				if(roles){
				  let roleNames = []
				  for(let j=0;j<roles.length;j++){
					for(let i=0;i<this.roles.length;i++){
					  if(roles[j] == this.roles[i].value){
						roleNames.push(this.roles[i].text)
						break
					  }
					}
				  }
				  if(roleNames.length>0){
					return roleNames.join("、");
				  }else {
					return "--";
				  }
				}else {
				  return "--";
				}
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
				if(this.listQuery.role){
					this.listQuery.roles = [this.listQuery.role]
				}else{
					this.listQuery.roles = []
				}
				this.$api.post("/user/list/", this.listQuery).then(res => {
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
				this.$api.post("/user/delete/", {"id": this.selectId}).then(res => {
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
			//弹出批量删除提示框
			showBatchDelete(){
				if(this.selectedIndexs.length > 0){
					uni.$emit("showOpenDialog", {"cmd": "tips", "func": "batchDelete", "tipContent": "是否批量删除数据？"})
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
					this.$api.post("/user/batchDelete/", {"ids": ids}).then(res => {
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
		}
	}
</script>

<style scoped lang="scss">

</style>
