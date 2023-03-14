<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="filter-container d-flex">
					<view class="filter-item d-flex" style="width: 210px;">
						<uni-easyinput v-model="listQuery.searchKey" trim="both" placeholder="账号/昵称"></uni-easyinput>
					</view>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="search">查询</button>
					</view>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="toPage('/pages/system/user/add')">新增</button>
					</view>
				</view>
				<uni-table ref="table" :loading="listLoading" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th align="center">账号</uni-th>
						<uni-th align="center">昵称</uni-th>
						<uni-th align="center">邮箱</uni-th>
						<uni-th align="center">角色</uni-th>
						<uni-th align="center">状态</uni-th>
						<uni-th align="center">最后登录时间（IP）</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td align="center">{{ item.username }}</uni-td>
						<uni-td align="center">{{ item.name }}</uni-td>
						<uni-td align="center">{{item.email || "--"}}</uni-td>
						<uni-td align="center">{{formatRoles(item.roles)}}</uni-td>
						<uni-td align="center">
							<view v-if="item.status==1">正常</view>
							<view v-if="item.status==2">禁用</view>
						</uni-td>
						<uni-td align="center"><uni-dateformat :date="item.last_time"></uni-dateformat>（{{item.last_ip}})</uni-td>
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
				selectId: null,//选中ID
				roles:[], //角色列表
			}
		},
		onReady() {
			this.init()
		},
		methods: {
			//初始化
			init() {
				//获取角色列表
				this.getRoleList()
				//获取用户列表
				this.getList()
			},
			//角色列表
			getRoleList(){
				this.$api.get("/role/getList/").then(res => {
					if(res.code == 20000){
						this.roles = res.data
					}
				})
			},
			//格式化角色
			formatRoles(roles){
				if(roles != undefined){
				  let roleNames = []
				  for(let j=0;j<roles.length;j++){
					for(let i=0;i<this.roles.length;i++){
					  if(roles[j] == this.roles[i].name){
						roleNames.push(this.roles[i].describe)
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
			//查询
			search(){
				this.listQuery.currentPage = 1
				this.getList()
			},
			//获取列表
			getList() {
				this.listLoading = true
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
			//显示删除提示
			showDeleteTips(id){
				this.selectId = id
				this.$refs.deleteDialog.open()
			},
			//删除数据
			deleteItem(){
				this.$api.post("/user/delete/", {"id": this.selectId}).then(res => {
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
						//初始化数据
						res.eventChannel.emit('initData', { roles: this.roles, data: item })
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
