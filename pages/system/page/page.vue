<template>
	<view class="page">
		<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="container">
					<view class="filter-container d-flex">
						<view class="filter-item d-flex" style="width: 180px;">
							<uni-easyinput v-model="listQuery.searchKey" trim="both" placeholder="综合查询"></uni-easyinput>
						</view>
						<template v-if="module.table_json != null">
							<view v-for="(table, tableIndex) in module.table_json" :key="tableIndex" v-if="table.show && table.single_query">
								<view v-if="table.type==1 || table.type==2" class="filter-item d-flex" style="width: 120px;">
									<uni-easyinput v-model="listQuery[table.name]" trim="both" :placeholder="table.remarks"></uni-easyinput>
								</view>
								<view v-if="table.type==9" class="filter-item d-flex" style="width: 120px;">
									<uni-easyinput v-if="table.name=='uid'" v-model="listQuery[table.name]" trim="both" :placeholder="table.remarks"></uni-easyinput>
									<uni-data-select v-else v-model="listQuery[table.name]" :localdata="getObject(table.key)" :placeholder="table.remarks"></uni-data-select>
								</view>
								<view v-if="table.type==4 || table.type==5" class="filter-item d-flex" style="width: 120px;">
									<uni-data-select v-model="listQuery[table.name]" :localdata="getDict(table.key)" :placeholder="table.remarks"></uni-data-select>
								</view>
								<view v-if="table.type==10" class="filter-item d-flex">
									<view v-if="table.name == 'orgs'">
										<view @click="showDialog('selectOrgDialog')" class="pointer d-flex between" style="background: #fff;border: 1px solid #ddd;border-radius: 5px;height: 33px;padding: 0 5px 0 10px;">
											<view style="padding-right: 5px;font-size: 12px;">{{selectedOrgName}}</view>
											<uni-icons type="bottom" size="14" color="#999"></uni-icons>
										</view>
									</view>
									<view v-else style="min-width: 180px;">
										<uni-data-picker v-model="listQuery[table.name]" :localdata="getCategory(table.key)" :placeholder="table.remarks" :popup-title="table.remarks" @change="onCategoryChange($event, table.name)"></uni-data-picker>
									</view>
								</view>
							</view>
						</template>
						<view class="filter-item d-flex">
							<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="search">查询</button>
						</view>
						<template v-if="module.api_json != null">
							<view class="filter-item d-flex" v-if="checkRole(module.api_json[0].roles) && module.api_json[0].show">
								<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="toPage('/pages/core/add', user.orgs?{'orgs': user.orgs}:null)">新增</button>
							</view>
							<view class="filter-item d-flex" v-if="checkRole(module.api_json[5].roles) && module.api_json[5].show">
								<button type="primary" size="mini" style="height: 35px;line-height: 35px;" :disabled="!selectedIndexs.length" @click="showBatchUpdate()">批量修改</button>
							</view>
							<view class="filter-item d-flex" v-if="checkRole(module.api_json[4].roles) && module.api_json[4].show">
								<button type="warn" size="mini" style="height: 35px;line-height: 35px;" :disabled="!selectedIndexs.length" @click="batchDelete()">批量删除</button>
							</view>
							<view class="filter-item d-flex" v-if="checkRole(module.api_json[10].roles) && module.api_json[10].show">
								<uni-file-picker ref="files" limit="1" file-mediatype="all" @select="importData" :auto-upload="false">
									<button type="primary" size="mini" style="height: 35px;line-height: 35px;margin-top: 7px;">导入</button>
								</uni-file-picker>
							</view>
							<view class="filter-item d-flex" v-if="checkRole(module.api_json[11].roles) && module.api_json[11].show">
								<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="exportData()">导出</button>
							</view>
						</template>
					</view>
					<uni-table ref="table" :loading="listLoading" type="selection" @selection-change="selectionChange" border stripe emptyText="暂无更多数据">
						<uni-tr>
							<template v-if="module.table_json != null">
								<uni-th align="center" v-for="(table, tableIndex) in module.table_json" :key="tableIndex" v-if="table.show" :class="table.sort?'pointer':''" :sortable="table.sort" @sort-change="sortChange($event, table.name)">{{table.remarks}}</uni-th>
							</template>
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
									<image @click="showImage([item[table.name]], 0)" :src="item[table.name]" mode="aspectFit" class="pointer" style="width: 120px;height: 40px;"></image>
								</template>
								<template v-else-if="table.type==12" i="多图片">
									<view class="d-flex-center">
										<view v-for="(pic, picIndex) in item[table.name]" :key="picIndex" style="padding: 0 5px;">
											<image @click="showImage(item[table.name], picIndex)" :src="pic" mode="aspectFit" class="pointer" style="width: 40px;height: 40px;"></image>
										</view>
									</view>
								</template>
								<template v-else-if="table.type==7" i="多文本">
									{{ item[table.name] | ellipsis}}
								</template>
								<template v-else-if="table.type==9" i="对象">
									<view v-if="table.name=='uid'">{{ item[table.name] }}</view>
									<view v-else>{{formatObject(table.key, item[table.name])}}</view>
								</template>
								<template v-else-if="table.type==10" i="分类列表">
									{{formatCategory(item[table.name])}}
								</template>
								<template v-else-if="table.type==15" i="时间戳">
									<view v-if="item[table.name]">
										<uni-dateformat :date="item[table.name] | formatDate"></uni-dateformat>
									</view>
									<view v-else>--</view>
								</template>
								<template v-else i="其他">
									{{ item[table.name] || "--"}}
								</template>
								</uni-td>
							</template>
							<uni-td align="center">
								<view class="d-flex-center">
									<view class="tag-view">
										<uni-link :href="'/admin/#/pages/design/design-'+item.page_type+'?id='+item.id" :showUnderLine="false">
											<uni-tag text="设计" type="primary"></uni-tag>
										</uni-link>
									</view>
									<template v-if="module.api_json != null">
										<view class="tag-view" v-if="checkRole(module.api_json[9].roles) && module.api_json[9].show">
											<uni-tag text="查看" type="primary" @click="toPage('/pages/core/info', item)"></uni-tag>
										</view>
										<view class="tag-view" v-if="checkRole(module.api_json[1].roles) && module.api_json[1].show">
											<uni-tag text="编辑" type="primary" @click="toPage('/pages/core/edit', item)"></uni-tag>
										</view>
										<view class="tag-view" v-if="checkRole(module.api_json[2].roles) && module.api_json[2].show">
											<uni-tag text="删除" type="error" @click="deleteItem(item.id)"></uni-tag>
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
				</view>
			</uni-card>
		</scroll-view>
		
		<!-- 选择部门 -->
		<uni-popup ref="selectOrgDialog" type="dialog">
			<uni-card title="选择部门">
				<scroll-view :scroll-y="true" :scroll-x="false" style="height: 400px;width: 220px;">
					<view class="org-tree" v-for="(orgOne, indexOne) in orgTree" :key="'one-'+indexOne">
						<view class="item pointer" v-if="orgOne.show" @click="selectOrg(orgOne.text, [{'text': orgOne.text, 'value': orgOne.value}])">
						|-{{orgOne.text}}
						</view>
						<view v-if="orgOne.children" v-for="(orgTwo, indexTwo) in orgOne.children" :key="'two-'+indexTwo">
							<view class="item pointer" v-if="orgTwo.show" @click="selectOrg(orgTwo.text, [{'text': orgOne.text, 'value': orgOne.value}, {'text': orgTwo.text, 'value': orgTwo.value}])" :style="{'margin-left':orgOne.show?'10px':'0'}">
							|-{{orgTwo.text}}
							</view>
							<view v-if="orgTwo.children" v-for="(orgThree, indexThree) in orgTwo.children" :key="'three-'+indexThree">
								<view class="item pointer" v-if="orgThree.show" @click="selectOrg(orgThree.text, [{'text': orgOne.text, 'value': orgOne.value}, {'text': orgTwo.text, 'value': orgTwo.value}, {'text': orgThree.text, 'value': orgThree.value}])" :style="{'margin-left':orgOne.show?'20px':orgTwo.show?'10px':'0'}">
								|-{{orgThree.text}}
								</view>
								<view v-if="orgThree.children" v-for="(orgFour, indexFour) in orgThree.children" :key="'four-'+indexFour">
									<view class="item pointer" v-if="orgFour.show" @click="selectOrg(orgFour.text, [{'text': orgOne.text, 'value': orgOne.value}, {'text': orgTwo.text, 'value': orgTwo.value}, {'text': orgThree.text, 'value': orgThree.value}, {'text': orgFour.text, 'value': orgFour.value}])" :style="{'margin-left':orgOne.show?'30px':orgTwo.show?'20px':orgThree.show?'10px':'0'}">
									|-{{orgFour.text}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</uni-card>
		</uni-popup>
	</view>
</template>

<script>
	import { formatDateUtc, listToTree, formatToCategory } from '@/utils/util'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				mid: null,//模块ID
				module: {},//模块
				dict: {},//字典
				category: {},//分类
				object: {},//对象
				tableData: [],
				total: 0,
				listLoading: true,
				listQuery: {
					currentPage: 1,
					pageSize: 20,
					sortField: "_id",
					sortOrder: "descending",
					searchKey: null,
					uid: null
				},
				selectedIndexs: [],
				orgTree: [],//部门树
				selectedOrgName: null,//选中的部门名称
			}
		},
		computed: {
			...mapGetters(['user'])
		},
		filters: {
		    //格式化日期
		    formatDate(time){
		    	return formatDateUtc(time)
		    },
			//限制长度
			ellipsis(value) {
			  if (!value) return ''
			  if (value.length > 20) {
			    return value.slice(0, 20) + '...'
			  }
			  return value
			}
		},
		onLoad(options) {
			this.mid = options.mid
		},
		onReady() {
			//根据角色，初始化查询条件
			if(!this.user.roles.includes("super")){
				this.listQuery.uid = this.user.id
			}
			//初始化
			this.init()
		},
		methods: {
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
							res.eventChannel.emit('initData', { "module": this.module, "dict": this.dict, "category": this.category, "object": this.object, data: JSON.parse(JSON.stringify(item)) })
						}else{
							res.eventChannel.emit('initData', { "module": this.module, "dict": this.dict, "category": this.category, "object": this.object })
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
			showImage(imgs, index){
				uni.previewImage({"current": index, "urls": imgs})
			},
			//显示弹出框
			showDialog(id){
				this.$refs[id].open()
			},
			//关闭弹出框
			hideDialog(id){
				this.$refs[id].close()
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
								//获取字典
								if(item.key){
									await this.initDict(item.key)
								}
							}else if(item.type==9){
								//获取对象列表
								if(item.key && item.name!='uid'){
									await this.initObject(item.key)
								}
							}else if(item.type==10){
								//判断该模块是否需要通过部门查询
								if(item.name=='orgs' && this.user.orgs){
									//设置当前部门ID
									let orgs = this.user.orgs[this.user.orgs.length-1]
									this.selectedOrgName = orgs.text
									this.listQuery.orgs = orgs
								}
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
			//初始化对象
			async initObject(name){
				if(!this.object[name]){
					let res = await this.$api.postAsync("/core/getList/", {}, {"Mid": name})
					if(res.code == 20000){
						//列表转换
						let result = []
						for(let i=0;i<res.data.length;i++){
							let item = res.data[i]
							item["text"] = item.name
							item["value"] = item.id
							result.push(item)
						}
						this.object[name] = result
					}
				}
			},
			//获取对象
			getObject(name){
				return this.object[name]
			},
			//显示对象
			formatObject(name, value){
				if(value){
					let list = this.object[name]
					let names = "--"
					if(!list){
						return names
					}
					for(let i=0;i<list.length;i++){
						if(value == list[i].value){
							names = list[i].text
							break
						}
					}
					return names
				}else{
					return "--"
				}
			},
			//初始化分类
			async initCategory(name){
				if(!this.category[name]){
					let res = await this.$api.postAsync("/core/getCategory/", {}, {"Mid": name})
					if(res.code == 20000){
						//转Tree
						this.category[name] = listToTree(res.data)
						if(name=="Department"){
							//部门数据单独处理
							this.orgTree = this.category[name]
						}
					}
				}
			},
			//获取分类
			getCategory(name){
				return this.category[name]
			},
			//显示分类
			formatCategory(categorys){
				if(categorys){
					let names = []
					for(let i=0;i<categorys.length;i++){
						names.push(categorys[i].text)
					}
					if(names.length>0){
						return names.join("/")
					}else {
						return "--"
					}
				}else{
					return "--"
				}
			},
			//分类选择
			onCategoryChange(e, name) {
				this.listQuery[name] = formatToCategory(e.detail.value)
			},
			//初始化字典
			async initDict(name){
				if(!this.dict[name]){
					let res = await this.$api.postAsync("/dict/getList/", {"type_name": name})
					if(res.code == 20000){
						this.dict[name] = res.data
					}
				}
			},
			//获取字典
			getDict(name){
				return this.dict[name]
			},
			//显示字典
			showDict(name, value){
				if(value){
					let list = this.dict[name]
					let names = "--"
					if(!list){
						return names
					}
					for(let i=0;i<list.length;i++){
						if(value == list[i].value){
							names = list[i].text
							break
						}
					}
					return names
				}else{
					return "--"
				}
			},
			//显示字典
			showDicts(name, values){
				if(values){
					let list = this.dict[name]
					let names = []
					if(!list){
						return names
					}
					for(let i=0;i<list.length;i++){
						if(values.includes(list[i].value)){
							names.push(list[i].text)
						}
					}
					if(names.length > 0){
						return names.join(",")
					}else{
						return "--"
					}
				}else{
					return "--"
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
							this.$api.post("/core/delete/", {"id": id}, {"Mid": this.mid}).then(res => {
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
							res.eventChannel.emit('initData', { "module": this.module, "dict": this.dict, "category": this.category, "object": this.object, "data": {"ids": ids}})
						}
					})
				}
			},
			//导入数据
			importData(e){
				uni.showLoading({
					title: '正在导入'
				})
				this.$api.uploadFile('/core/importData/', e.tempFilePaths[0], {}, {"Mid": this.mid}).then(res => {
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
				uni.showLoading({
					title: '正在导出'
				})
				this.$api.post("/core/exportData/", this.listQuery, {"Mid": this.mid}).then(res => {
					uni.hideLoading()
					if(res.code == 20000){
						window.open(res.data)
					}else{
						uni.showToast({
							title: "导出失败",
							icon: 'error'
						})
					}
				})
			},
			//选中部门
			selectOrg(name, orgs){
				this.selectedOrgName = name
				this.listQuery.orgs = orgs[orgs.length-1]
				this.hideDialog('selectOrgDialog')
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
