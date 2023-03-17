<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true">
			<uni-card>
				<template v-slot:title>
					<view class="d-flex between" style="padding: 10px;border-bottom: 1px solid #EBEEF5;">
						<view style="font-size: 15px;">字典管理</view>
						<view>
							<uni-tag text="新增字典" type="primary" @click="toPage('/pages/system/dict/addType')"></uni-tag>
						</view>
					</view>
				</template>
				<uni-collapse>
					<uni-collapse-item v-for="(item, index) in list" :key="index" :title="item.name+' - '+item.describe">
						<view style="padding: 0 10px 10px 10px">
							<view class="d-flex between" style="padding-bottom: 10px;">
								<view class="">
									<uni-tag text="新增子集" type="primary" @click="toPage('/pages/system/dict/addValue', item)"></uni-tag>
								</view>
								<view class="d-flex">
									<view class="tag-view">
										<uni-tag text="编辑字典" type="primary" @click="toPage('/pages/system/dict/editType', item)"></uni-tag>
									</view>
									<view class="">
										<uni-tag text="删除字典" type="error" @click="showDeleteTips(item.id)"></uni-tag>
									</view>
								</view>
							</view>
							<uni-table border stripe emptyText="暂无更多数据" >
								<uni-tr>
									<uni-th align="center">Key</uni-th>
									<uni-th align="center">Value</uni-th>
									<uni-th align="center">排序（降序）</uni-th>
									<uni-th align="center">操作</uni-th>
								</uni-tr>
								<uni-tr v-for="(childItem, childIndex) in item.children" :key="childIndex">
									<uni-td align="center">{{childItem.dict_name}}</uni-td>
									<uni-td align="center">{{childItem.dict_value}}</uni-td>
									<uni-td align="center">{{childItem.sort}}</uni-td>
									<uni-td align="center">
										<view class="d-flex-center">
											<view class="tag-view">
												<uni-tag text="编辑" type="primary" @click="toPage('/pages/system/dict/editValue', childItem)"></uni-tag>
											</view>
											<view class="tag-view">
												<uni-tag text="删除" type="error" @click="deleteChildItem(childItem.id, childItem.dict_tid)"></uni-tag>
											</view>
										</view>
									</uni-td>
								</uni-tr>
							</uni-table>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</uni-card>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
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
						if(item){
							//初始化数据
							res.eventChannel.emit('initData', { data: item })
						}
					}
				})
			},
			//初始化
			init() {
				this.getList()
			},
			//获取列表
			getList() {
				this.listLoading = true
				this.$api.get("/dict/typeList/").then(res => {
					this.listLoading = false
					this.list = res.data
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
				this.$api.post("/dict/typeDelete/", {"id": this.selectId}).then(res => {
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
			//删除子集数据
			deleteChildItem(id, tid){
				uni.showLoading({
					title: '正在删除'
				})
				this.$api.post("/dict/valueDelete/", {"id": id, "dict_tid": tid}).then(res => {
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