<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="filter-container d-flex">
					<view class="filter-item d-flex" style="width: 210px;">
						<uni-easyinput v-model="listQuery.searchKey" trim="both" placeholder="文件名称"></uni-easyinput>
					</view>
					<view class="filter-item d-flex" style="width: 120px;">
						<uni-data-select v-model="listQuery.type" :localdata="datas.file_type_json" placeholder="请选择文件类型"></uni-data-select>
					</view>
					<view class="filter-item d-flex" style="width: 120px;">
						<uni-data-select v-model="listQuery.status" :localdata="datas.file_status_json" placeholder="请选择文件状态"></uni-data-select>
					</view>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="search">查询</button>
					</view>
					<view class="filter-item d-flex">
						<uni-file-picker ref="files" limit="1" file-mediatype="all" @select="selectFile" :auto-upload="false">
							<button type="primary" size="mini" style="height: 35px;line-height: 35px;margin-top: 7px;">上传文件</button>
						</uni-file-picker>
					</view>
					<view class="filter-item d-flex">
						<button type="warn" size="mini" style="height: 35px;line-height: 35px;" :disabled="!selectedIndexs.length" @click="showBatchDelete">批量删除</button>
					</view>
				</view>
				<uni-table ref="table" :loading="listLoading" type="selection" @selection-change="selectionChange" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th align="center">文件名称</uni-th>
						<uni-th align="center">文件类型</uni-th>
						<uni-th align="center" width="220">下载地址</uni-th>
						<uni-th align="center" width="220">存储地址</uni-th>
						<uni-th align="center">文件大小</uni-th>
						<uni-th align="center">MD5值</uni-th>
						<uni-th align="center">文件状态</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<uni-td align="center">{{ item.name }}</uni-td>
						<uni-td align="center">
							<view v-if="item.type==2">图片</view>
							<view v-else-if="item.type==3">文件</view>
							<view v-else-if="item.type==4">语音</view>
							<view v-else-if="item.type==5">视频</view>
						</uni-td>
						<uni-td align="center">
							<text class="wrap">
								<uni-link :href="item.download_path" :text="item.download_path"></uni-link>
							</text>
						</uni-td>
						<uni-td align="center">
							<text class="wrap">{{item.store_path}}</text>
						</uni-td>
						<uni-td align="center">{{item.size}}</uni-td>
						<uni-td align="center">{{item.md5 || "--"}}</uni-td>
						<uni-td align="center">
							<view v-if="item.status==1">临时</view>
							<view v-else-if="item.status==2">永存</view>
						</uni-td>
						<uni-td align="center">
							<view class="d-flex-center">
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
					type: "",
					status: "",
					searchKey: ""
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
				this.$api.post("/file/list/", this.listQuery).then(res => {
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
				window.parent.postMessage({"cmd": "tips", "func": "deleteItem", "data": {"tips": "是否删除该数据？"}}, '*')
			},
			//删除数据
			deleteItem(){
				uni.showLoading({
					title: '正在删除'
				})
				this.$api.post("/file/delete/", {"id": this.selectId}).then(res => {
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
					this.$api.post("/file/batchDelete/", {"ids": ids}).then(res => {
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
			},
			//选择文件后触发
			selectFile(e){
				uni.showLoading({
					title: '正在上传'
				})
				this.$api.uploadFile('/file/upload/', e.tempFilePaths[0]).then(res => {
					uni.hideLoading()
					this.$refs.files.clearFiles()
					if(res.code == 20000){
						uni.showToast({
							title: "上传成功",
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
