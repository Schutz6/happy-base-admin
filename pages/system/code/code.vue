<template>
	<view class="page">
		<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="filter-container d-flex">
					<view class="filter-item d-flex" style="width: 180px;">
						<uni-easyinput v-model="listQuery.searchKey" trim="both" placeholder="模块ID/模块名称"></uni-easyinput>
					</view>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="search">查询</button>
					</view>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="toPage('/pages/system/code/add')">新增</button>
					</view>
					<view class="filter-item d-flex">
						<button type="warn" size="mini" style="height: 35px;line-height: 35px;" @click="toPage('/pages/system/code/addM')">新增模块</button>
					</view>
				</view>
				<uni-table ref="table" :loading="listLoading" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th align="center" width="150">模块ID</uni-th>
						<uni-th align="center" width="150">模块名称</uni-th>
						<uni-th align="center" width="100">使用缓存</uni-th>
						<uni-th align="center">激活接口</uni-th>
						<uni-th align="center" width="200">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td align="center">{{ item.mid }}</uni-td>
						<uni-td align="center">{{ item.name }}</uni-td>
						<uni-td align="center">
							<view v-if="item.cache == 1">是</view>
							<view v-else-if="item.cache == 0">否</view>
						</uni-td>
						<uni-td align="center">
							{{ formatApi(item.api_json.filter(data => {return data.status})) }}
						</uni-td>
						<uni-td align="center">
							<view class="d-flex-center">
								<view class="tag-view">
									<uni-tag text="编辑" type="primary" @click="toPage('/pages/system/code/edit', item)"></uni-tag>
								</view>
								<view class="tag-view">
									<uni-tag text="删除" type="error" @click="showDeleteTips(item.id)"></uni-tag>
								</view>
								<view class="tag-view">
									<uni-tag text="复制模块" type="warning" @click="copy(item)"></uni-tag>
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
				selectId: null,//选中ID
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
			//显示接口列表
			formatApi(apis){
				let apiList = []
				for(let i=0;i<apis.length;i++){
					apiList.push(apis[i].name)
				}
				if(apiList.length>0){
					return apiList.join("、");
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
				this.$api.post("/code/list/", this.listQuery).then(res => {
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
				this.$api.post("/code/delete/", {"id": this.selectId}).then(res => {
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
			//复制模块
			copy(item){
				let code = JSON.parse(JSON.stringify(item))
				//删除多余字段
				delete code["id"]
				//复制代码
				uni.setClipboardData({
					data: JSON.stringify(code),
					success: ()=> {
						uni.showToast({
							title: "复制成功",
							icon: 'success'
						})
					}
				});
			},
		}
	}
</script>

<style scoped lang="scss">

</style>
