<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="filter-container d-flex">
					<view class="filter-item d-flex" style="width: 210px;">
						<uni-easyinput v-model="listQuery.searchKey" trim="both" placeholder="唯一ID/参数值/备注"></uni-easyinput>
					</view>
					<view class="filter-item d-flex" style="width: 120px;">
						<uni-data-select v-model="listQuery.status" :localdata="datas.param_status_json" placeholder="请选择状态"></uni-data-select>
					</view>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="search">查询</button>
					</view>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="toPage('/pages/system/param/add')">新增</button>
					</view>
				</view>
				<uni-table ref="table" :loading="listLoading" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th align="center">唯一ID</uni-th>
						<uni-th align="center" width="400">参数值</uni-th>
						<uni-th align="center" width="50">状态</uni-th>
						<uni-th align="center">备注</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td align="center">{{ item.key }}</uni-td>
						<uni-td align="center">
							<text class="wrap">{{ item.value }}</text>
						</uni-td>
						<uni-td align="center" width="50">
							<view v-if="item.status==0">公共</view>
							<view v-else style="color: red;">私有</view>
						</uni-td>
						<uni-td align="center">{{item.remarks}}</uni-td>
						<uni-td align="center">
							<view class="d-flex-center">
								<view class="tag-view">
									<uni-tag text="编辑" type="primary" @click="toPage('/pages/system/param/edit', item)"></uni-tag>
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
					searchKey: null,
					status: null
				},
				selectId: null,//选中ID
			}
		},
		computed: {
			...mapGetters(['datas'])
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
				this.$api.post("/param/list/", this.listQuery).then(res => {
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
				window.parent.postMessage({"cmd": "tips", "func": "deleteItem", "data": {"tips": "是否删除该数据？"}}, '*')
			},
			//删除数据
			deleteItem(){
				this.$api.post("/param/delete/", {"id": this.selectId}).then(res => {
					uni.showToast({
						title: "删除成功",
						icon: 'success'
					})
					this.getList()
				})
			},
			
		}
	}
</script>

<style scoped lang="scss">

</style>
