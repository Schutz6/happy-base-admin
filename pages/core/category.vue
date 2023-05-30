<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card>
				<view class="filter-container d-flex">
					<view class="filter-item d-flex">
						<button type="primary" size="mini" style="height: 35px;line-height: 35px;" @click="toPage('/pages/core/add', {'pid': 0, 'level': 1})">新增主分类</button>
					</view>
				</view>
				<uni-table ref="table" :loading="listLoading" border stripe emptyText="暂无更多数据">
					<uni-tr>
						<template v-if="module.table_json != null">
							<uni-th v-for="(table, tableIndex) in module.table_json" :key="tableIndex" :align="tableIndex==2?'left':'center'" v-if="table.show">{{table.remarks}}</uni-th>
						</template>
						<uni-th align="center" width="100px">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableData" :key="index">
						<template v-if="module.table_json != null">
							<uni-td v-for="(table, tableIndex) in module.table_json" :key="tableIndex" :align="tableIndex==2?'left':'center'" v-if="table.show">
								<template v-if="tableIndex==2">
									<view v-if="item.level == 1">{{ item[table.name] }}</view>
									<view v-else-if="item.level == 2" style="margin-left: 10px;">|-{{ item[table.name] }}</view>
									<view v-else-if="item.level == 3" style="margin-left: 20px;">|-{{ item[table.name] }}</view>
								</template>
								<template v-else>
									<template v-if="table.type==4" i="列表">
										{{ showDicts(table.key, item[table.name]) }}
									</template>
									<template v-else-if="table.type==5" i="字典">
										{{ showDict(table.key, item[table.name]) }}
									</template>
									<template v-else-if="table.type==6" i="图片">
										<image @click="showImage(item[table.name])" :src="item[table.name]" mode="aspectFit" class="pointer" style="height: 40px;height: 40px;"></image>
									</template>
									<template v-else i="其他">
										{{ item[table.name] }}
									</template>
								</template>
							</uni-td>
						</template>
						<uni-td>
							<view class="d-flex">
								<template v-if="module.api_json != null">
									<view class="tag-view" v-if="module.api_json[1].show">
										<uni-tag text="编辑" type="primary" @click="toPage('/pages/core/edit', item)"></uni-tag>
									</view>
									<view class="tag-view" v-if="module.api_json[3].show">
										<uni-tag text="删除" type="error" @click="showDeleteTips(item.id)"></uni-tag>
									</view>
									<view class="tag-view" style="min-width: 60px" v-if="item.level < 3">
										<uni-tag text="+子分类" type="warning" @click="toPage('/pages/core/add', {'pid': item.id, 'level': item.level+1})"></uni-tag>
									</view>
								</template>
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
				mid: null,//模块ID
				module: {},//模块
				dict: {},//字典
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
								if(item.key){
									await this.initDict(item.key)
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
			//获取列表
			getList() {
				this.listLoading = true
				this.$api.post("/core/getCategory/", {}, {"Mid": this.mid}).then(res => {
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
				this.$api.post("/core/recursionDelete/", {"id": this.selectId}, {"Mid": this.mid}).then(res => {
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
