<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="filter-container d-flex">
					<view class="filter-item d-flex" style="width: 180px;">
						<uni-easyinput v-model="listQuery.searchKey" trim="both" placeholder="关键字"></uni-easyinput>
					</view>
					<template v-if="module.table_json != null">
						<view v-for="(table, tableIndex) in module.table_json" :key="tableIndex" v-if="table.query">
							<view v-if="table.type==9" class="filter-item d-flex" style="width: 120px;">
								<uni-easyinput v-model="listQuery[table.name]" trim="both" :placeholder="table.remarks"></uni-easyinput>
							</view>
							<view v-if="table.type==5" class="filter-item d-flex" style="width: 120px;">
								<uni-data-select v-model="listQuery[table.name]" :localdata="getDict(table.key)" :placeholder="table.remarks"></uni-data-select>
							</view>
							<view v-if="table.type==10" class="filter-item d-flex" style="width: 180px;">
								<uni-data-picker v-model="listQuery[table.name]" :localdata="getCategory(table.key)" @change="onCategoryChange($event, table.name)"></uni-data-picker>
							</view>
						</view>
					</template>
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="search">查询</button>
					</view>
					<template v-if="module.api_json != null">
						<view class="filter-item d-flex" v-if="checkRole(module.api_json[0].roles) && module.api_json[0].show">
							<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="toPage('/pages/core/add')">新增</button>
						</view>
						<view class="filter-item d-flex" v-if="checkRole(module.api_json[0].roles) && module.api_json[5].show">
							<button type="primary" size="mini" style="height: 35px;line-height: 35px;" :disabled="!selectedIndexs.length" @click="showBatchUpdate">批量修改</button>
						</view>
						<view class="filter-item d-flex" v-if="checkRole(module.api_json[0].roles) && module.api_json[4].show">
							<button type="warn" size="mini" style="height: 35px;line-height: 35px;" :disabled="!selectedIndexs.length" @click="showBatchDelete">批量删除</button>
						</view>
						<view class="filter-item d-flex" v-if="checkRole(module.api_json[0].roles) && module.api_json[10].show">
							<uni-file-picker ref="files" limit="1" file-mediatype="all" @select="importData" :auto-upload="false">
								<button type="primary" size="mini" style="height: 35px;line-height: 35px;margin-top: 7px;">导入</button>
							</uni-file-picker>
						</view>
						<view class="filter-item d-flex" v-if="checkRole(module.api_json[0].roles) && module.api_json[11].show">
							<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="exportData">导出</button>
						</view>
					</template>
				</view>
				<uni-table ref="table" :loading="listLoading" type="selection" @selection-change="selectionChange" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<template v-if="module.table_json != null">
							<uni-th align="center" v-for="(table, tableIndex) in module.table_json" :key="tableIndex" v-if="table.show" :class="table.sort?'pointer':''" :sortable="table.sort" @sort-change="sortChange($event, table.name)">{{table.remarks}}</uni-th>
						</template>
						<uni-th align="center">创建时间</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<template v-if="module.table_json != null">
							<uni-td align="center" v-for="(table, tableIndex) in module.table_json" :key="tableIndex" v-if="table.show">
							<template v-if="table.type==4" i="字典列表">
								{{ showDicts(table.key, item[table.name]) }}
							</template>
							<template v-else-if="table.type==5" i="字典">
								{{ showDict(table.key, item[table.name]) }}
							</template>
							<template v-else-if="table.type==6" i="图片">
								<img @click="showImage(item[table.name])" :src="item[table.name]" class="pointer" style="width: 40px;height: 40px;" />
							</template>
							<template v-else-if="table.type==10" i="分类列表">
								 {{formatCategory(item[table.name])}}
							</template>
							<template v-else i="其他">
								{{ item[table.name] }}
							</template>
							</uni-td>
						</template>
						<uni-td align="center"><uni-dateformat :date="item.add_time | formatDate"></uni-dateformat></uni-td>
						<uni-td align="center">
							<view class="d-flex-center">
								<template v-if="module.api_json != null">
									<view class="tag-view" v-if="checkRole(module.api_json[1].roles) && module.api_json[0].show">
										<uni-tag text="编辑" type="primary" @click="toPage('/pages/core/edit', item)"></uni-tag>
									</view>
									<view class="tag-view" v-if="checkRole(module.api_json[0].roles) && module.api_json[2].show">
										<uni-tag text="删除" type="error" @click="showDeleteTips(item.id)"></uni-tag>
									</view>
								</template>
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
	import { formatDateUtc, listToTree } from '@/utils/util'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				mid: null,//模块ID
				module: {},//模块
				dict: {},//字典
				category: {},//分类
				tableData: [],
				total: 0,
				listLoading: true,
				listQuery: {
					currentPage: 1,
					pageSize: 20,
					sortField: "_id",
					sortOrder: "descending",
					searchKey: null
				},
				selectedIndexs: [],
				selectId: null,//选中ID
			}
		},
		computed: {
			...mapGetters(['user'])
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
							res.eventChannel.emit('initData', { "module": this.module, "dict": this.dict, "category": this.category, data: JSON.parse(JSON.stringify(item)) })
						}else{
							res.eventChannel.emit('initData', { "module": this.module, "dict": this.dict, "category": this.category })
						}
					}
				})
			},
			//判断是否有权限
			checkRole(roles){
				if(roles.length == 0){
					return false
				}
				let flag = false
				for(let i=0;i<roles.length;i++){
					if(this.user.roles.includes(roles[i])){
						flag = true
						break
					}
				}
				return flag
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
								if(item.key){
									await this.initDict(item.key)
								}
							}else if(item.type==10){
								//获取分类列表
								if(item.key){
									await this.initCategory(item.key)
								}
							}
						}
						callback()
					}
				})
			},
			//初始化分类
			async initCategory(name){
				let res = await this.$api.postAsync("/core/getCategory/", {}, {"Mid": name})
				if(res.code == 20000){
					//转Tree
					this.category[name] = listToTree(res.data)
				}
			},
			//获取分类
			getCategory(name){
				return this.category[name]
			},
			//显示分类
			formatCategory(categorys){
				let names = []
				for(let i=0;i<categorys.length;i++){
					names.push(categorys[i].text)
				}
				if(names.length>0){
					return names.join("/");
				}else {
					return "--";
				}
			},
			//分类选择
			onCategoryChange(e, name) {
				this.listQuery[name] = e.detail.value
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
			},
			//跳转到批量修改
			showBatchUpdate(){
				if(this.selectedIndexs.length > 0){
					let ids = this.selectedIndexs.map(i => this.tableData[i].id)
					uni.navigateTo({
						url: "/pages/core/batchUpdate",
						events: {
							//更新数据
							updateData: (res)=>{
								this.getList()
							}
						},
						success: (res)=>{
							//初始化数据
							res.eventChannel.emit('initData', { "module": this.module, "dict": this.dict, "category": this.category, "data": {"ids": ids}})
						}
					})
				}
			},
			//导入数据
			importData(e){
				uni.showLoading({
					title: '正在导入'
				})
				this.$api.uploadFile('/file/upload/', e.tempFilePaths[0]).then(res => {
					uni.hideLoading()
					this.$refs.files.clearFiles()
					if(res.code == 20000){
						uni.showToast({
							title: "导入成功",
							icon: 'success'
						})
						this.getList()
					}else{
						uni.showToast({
							title: "导入失败",
							icon: 'error'
						})
					}
				})
			},
			//导出数据
			exportData(){
				
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
