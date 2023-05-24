<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="filter-container d-flex">
					<view class="filter-item d-flex" style="width: 210px;">
						<uni-easyinput v-model="listQuery.searchKey" trim="both" placeholder="关键字"></uni-easyinput>
					</view>
					<template v-if="module.table_json != null">
						<view v-for="(table, tableIndex) in module.table_json" :key="tableIndex" v-if="table.type==5 && table.query">
							<view class="filter-item d-flex" style="width: 120px;">
								<uni-data-select v-model="listQuery[table.name]" :localdata="getDict(table.dict)" :placeholder="'请选择'+table.remarks"></uni-data-select>
							</view>
						</view>
					</template>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="search">查询</button>
					</view>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="toPage('/pages/core/add')">新增</button>
					</view>
					<view class="filter-item d-flex">
						<button type="warn" size="mini" style="height: 35px;line-height: 35px;" :disabled="!selectedIndexs.length" @click="showBatchDelete">批量删除</button>
					</view>
				</view>
				<uni-table ref="table" :loading="listLoading" type="selection" @selection-change="selectionChange" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<template v-if="module.table_json != null">
							<uni-th align="center" v-for="(table, tableIndex) in module.table_json" :key="tableIndex" v-if="table.show">{{table.remarks}}</uni-th>
						</template>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<template v-if="module.table_json != null">
							<uni-td align="center" v-for="(table, tableIndex) in module.table_json" :key="tableIndex" v-if="table.show">
							<template v-if="table.type==4" i="列表">
								{{ showDicts(table.dict, item[table.name]) }}
							</template>
							<template v-else-if="table.type==5" i="字典">
								{{ showDict(table.dict, item[table.name]) }}
							</template>
							<template v-else-if="table.type==6" i="图片">
								<img @click="showImage(item[table.name])" :src="item[table.name]" class="pointer" style="width: 40px;height: 40px;" />
							</template>
							<template v-else i="其他">
								{{ item[table.name] }}
							</template>
							</uni-td>
						</template>
						<uni-td align="center">
							<view class="d-flex-center">
								<view class="tag-view">
									<uni-tag text="编辑" type="primary" @click="toPage('/pages/core/edit', item)"></uni-tag>
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
				mid: null,//模块ID
				module: {},//模块
				dict: {},//字典
				tableData: [],
				total: 0,
				listLoading: true,
				listQuery: {
					currentPage: 1,
					pageSize: 20,
					searchKey: null
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
		},
		onLoad(options) {
			this.mid = options.mid
			if(this.mid){
				//初始化
				this.init()
			}
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
							res.eventChannel.emit('initData', { "module": this.module, "dict": this.dict, data: JSON.parse(JSON.stringify(item)) })
						}else{
							res.eventChannel.emit('initData', { "module": this.module, "dict": this.dict })
						}
					}
				})
			},
			//预览图片
			showImage(img){
				uni.previewImage({"urls": [img]})
			},
			//初始化
			init() {
				//获取模块信息
				this.getModule(()=>{
					//获取用户列表
					this.getList()
				})
			},
			//获取模块信息
			getModule(callback){
				this.$api.post("/code/getModule/", {"mid": this.mid}).then(async (res) => {
					if(res.code == 20000){
						this.module = res.data
						//获取字典
						for(let i=0;i<this.module.table_json.length;i++){
							let item = this.module.table_json[i]
							if(item.type==4 || item.type==5){
								if(item.dict){
									await this.initDict(item.dict)
								}
							}
						}
						callback()
					}
				})
			},
			//初始化字典
			async initDict(name){
				let res = await this.$api.postAsync("/dict/getList/", {"name": name})
				if(res.code == 20000){
					this.dict[name] = res.data
				}
			},
			//获取字典
			getDict(name){
				return this.dict[name]
			},
			//显示字典
			showDict(name, value){
				let list = this.dict[name]
				let names = "--"
				for(let i=0;i<list.length;i++){
					if(value == list[i].value){
						names = list[i].text
						break
					}
				}
				return names
			},
			//显示字典
			showDicts(name, values){
				let list = this.dict[name]
				let names = []
				for(let i=0;i<list.length;i++){
					if(values.includes(list[i].value)){
						names.push(list[i].text)
					}
				}
				return names.join(",")
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
				this.$api.post("/core/list/", this.listQuery, {"Mid": this.mid}).then(res => {
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
				this.$api.post("/core/delete/", {"id": this.selectId}, {"Mid": this.mid}).then(res => {
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
					this.$api.post("/core/batchDelete/", {"ids": ids}, {"Mid": this.mid}).then(res => {
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
