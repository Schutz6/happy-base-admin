<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="filter-container d-flex">
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="toPage('/pages/system/menus/add')">新增一级菜单</button>
					</view>
				</view>
				<uni-table ref="table" :loading="listLoading" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th align="left">名称</uni-th>
						<!-- <uni-th align="center">图标</uni-th> -->
						<uni-th align="left">地址</uni-th>
						<uni-th align="center">所属角色</uni-th>
						<uni-th align="center">排序(降序)</uni-th>
						<uni-th align="center" width="190">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td align="left">
							<view v-if="item.level == 1">{{ item.name }}</view>
							<view v-else-if="item.level == 2" style="margin-left: 10px;">|-{{ item.name }}</view>
						</uni-td>
						<!-- <uni-td align="center">
							<template v-if="item.icon">
								<image :src="'../../../static'+item.icon" style="width: 20px;height: 20px;" />
							</template>
							<template v-else>--</template>
						</uni-td> -->
						<uni-td align="left">{{ item.url }}</uni-td>
						<uni-td align="center">{{formatRoles(item.roles)}}</uni-td>
						<uni-td align="center">{{item.sort}}</uni-td>
						<uni-td>
							<view class="d-flex">
								<view class="tag-view">
									<uni-tag text="编辑" type="primary" @click="toPage('/pages/system/menus/edit', item)"></uni-tag>
								</view>
								<view class="tag-view">
									<uni-tag text="删除" type="error" @click="showDeleteTips(item.id)"></uni-tag>
								</view>
								<view class="tag-view" style="min-width: 60px" v-if="item.pid==0 && item.url=='#'">
									<uni-tag text="+子菜单" type="primary" @click="toPage('/pages/system/menus/add', item)"></uni-tag>
								</view>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
			</uni-card>
		</scroll-view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				roles:[], //角色列表
				tableData: [],
				total: 0,
				listLoading: true,
				selectId: null,//选中ID
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
							if(obj.func === "deleteItem"){
								//执行删除方法
								this.deleteItem()
							}
							break;
					}
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
						res.eventChannel.emit('initData', { roles: this.roles, data: item })
					}
				})
			},
			//初始化
			init() {
				//获取角色列表
				this.getRoleList(()=>{
					//获取菜单列表
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
			//获取列表
			getList() {
				this.listLoading = true
				this.$api.get("/menu/list/").then(res => {
					this.listLoading = false
					this.tableData = res.data
				})
			},
			//显示删除提示
			showDeleteTips(id){
				this.selectId = id
				window.parent.postMessage({"cmd": "tips", "func": "deleteItem", "data": {"tips": "是否删除该数据？"}}, '*')
			},
			//删除数据
			deleteItem(){
				uni.showLoading({
					title: '正在删除'
				})
				this.$api.post("/menu/delete/", {"id": this.selectId}).then(res => {
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
			
		}
	}
</script>

<style scoped lang="scss">

</style>
