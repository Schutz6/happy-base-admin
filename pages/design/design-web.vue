<template>
	<view>
		<uni-nav-bar leftIcon="bars" @clickLeft="showModule()" rightIcon="checkmarkempty" @clickRight="savePage()" title="页面设计器" :border="false"
			:fixed="true"></uni-nav-bar>
		<!-- 组件模块 -->
		<uni-transition custom-class="module-box" mode-class="slide-left" :show="showModuleBox"
			@change="changeModuleBox">
			<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
				<uni-card margin="0" padding="0" spacing="0">
					<uni-collapse accordion v-model="moduleCollapse">
						<uni-collapse-item name="module-layout" title="布局组件">
							<view id="module-layout">
								<view class="module-item" v-for="(item, index) in datas.layout_json" :key="index">
									<view class="module-name">{{item.name}}</view>
								</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item name="module-base" title="基础组件">
							<view id="module-base">
								<view class="module-item" v-for="(item, index) in datas.base_show_json" :key="index">
									<view class="module-name">{{item.name}}</view>
								</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item name="module-form" title="表单组件">
							<view id="module-form">
								<view class="module-item" v-for="(item, index) in datas.base_form_json" :key="index">
									<view class="module-name">{{item.name}}</view>
								</view>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</uni-card>
			</scroll-view>
		</uni-transition>
		<!-- 页面显示 -->
		<view id="page-box" class="page-box" @click="hideAll()">
			<view v-for="(layout, index) in pageJson" :key="layout.id" :data-id="layout.id" class="layout"
				:id="layout.id">
				<view class="mover d-flex-center" @click="showModuleSetting([index])">
					<image src="@/static/icons/icon-move.png" style="width: 18px;height: 18px;"></image>
					<view style="padding-left: 5px;">{{layout.type}}</view>
				</view>
				<template v-if="layout.type == 'Layout'">
					<uni-row :id="'drag-'+layout.id" :gutter="layout.gutter>0?layout.gutter:null">
						<uni-col :span="layout.span>0?layout.span:null"
							v-for="(item, children1Index) in layout.children" :key="item.id" :data-id="item.id">
							<view class="layout-item">
								<view class="mover-item d-flex-center"
									@click="showModuleSetting([index, children1Index])">
									<image src="@/static/icons/icon-move.png" style="width: 18px;height: 18px;">
									</image>
									<view style="padding-left: 5px;">{{item.type}}</view>
								</view>
								<template v-if="item.type == 'Text'">
									<ShowText :item="item"></ShowText>
								</template>
								<template v-else-if="item.type == 'RichText'">
									<ShowRichText :item="item"></ShowRichText>
								</template>
								<template v-else-if="item.type == 'Button'">
									<ShowButton :item="item"></ShowButton>
								</template>
							</view>
						</uni-col>
					</uni-row>
				</template>
			</view>
		</view>

		<!-- 右侧弹出组件设置 -->
		<uni-popup ref="settingBox" type="right" mask-background-color="rgba(0,0,0,0)">
			<uni-card v-if="moduleSetting!=null" :title="moduleSetting.name" margin="0">
				<view class="setting-box">
					<view>ID: {{moduleSetting.id}}</view>
					<template v-if="moduleSetting.type=='Layout'">
						<SettingLayout :moduleSetting="moduleSetting" @updateModuleValue="updateModuleValue"></SettingLayout>
					</template>
					<template v-else-if="moduleSetting.type=='Text'">
						<SettingText :moduleSetting="moduleSetting" @updateModuleValue="updateModuleValue"></SettingText>
					</template>
					<template v-else-if="moduleSetting.type=='RichText'">
						<SettingRichText :moduleSetting="moduleSetting" @updateModuleValue="updateModuleValue"></SettingRichText>
					</template>
					<template v-else-if="moduleSetting.type=='Button'">
						<SettingButton :moduleSetting="moduleSetting" @updateModuleValue="updateModuleValue"></SettingButton>
					</template>
					<view class="line">
						<uni-tag text="移除组件" type="error" @click="delModule()" />
					</view>
				</view>
			</uni-card>
		</uni-popup>
	</view>
</template>

<script>
	import ShowText from './components/show/Text.vue'
	import ShowRichText from './components/show/RichText.vue'
	import ShowButton from './components/show/Button.vue'
	
	import SettingLayout from './components/setting/Layout.vue'
	import SettingText from './components/setting/Text.vue'
	import SettingRichText from './components/setting/RichText.vue'
	import SettingButton from './components/setting/Button.vue'
	
	import Sortable from 'sortablejs'
	import {
		getRandomNum
	} from '@/utils/util'
	import {
		mapGetters
	} from 'vuex'
	export default {
		components: {
			ShowText,
			ShowRichText,
			ShowButton,
			
			SettingLayout,
			SettingText,
			SettingRichText,
			SettingButton
		},
		data() {
			return {
				id: null,
				moduleCollapse: "module-layout",//组件折叠面板
				showModuleBox: false, //显示/隐藏组件框
				//左侧拖动菜单
				sortableModuleLayout: null, //布局组件拖动对象
				sortableModuleBase: null, //基础组件拖动对象
				sortableModuleForm: null, //表单组件拖动对象
				//页面拖动集合
				sortableModule: {},//拖动组件集合
				pageJson: [], //页面设计
				moduleIndexs: [], //层级组件下标
				moduleSetting: null, //组件设置
				
			}
		},
		computed: {
			...mapGetters(['datas'])
		},
		onLoad(options) {
			this.id = parseInt(options.id)
			//查询页面数据
			this.$api.post("/core/getInfo/", {"id": this.id}, {"Mid": "Page"}).then(res => {
				if(res.code == 20000 && res.data.page_json){
					this.pageJson = JSON.parse(JSON.stringify(res.data.page_json))
					//初始化可拖动组件
					this.$nextTick(()=>{
						for(let i=0;i<this.pageJson.length;i++){
							let layout_item = this.pageJson[i]
							this.createDragLayout(layout_item.id)
						}
					})
				}
			})
		},
		onReady() {
			//创建可拖动排序对象
			let sortable = Sortable.create(document.getElementById("page-box"), {
				animation: 150,
				handle: '.mover',
				onSort: (evt) => {
					let json_sort = this.sortableModule["page-box"].toArray()
					//按照新的顺序排列
					let json = []
					for (let i = 0; i < json_sort.length; i++) {
						for (let j = 0; j < this.pageSaveJson.length; j++) {
							if (json_sort[i] == this.pageSaveJson[j].id) {
								json.push(this.pageSaveJson[j])
								break
							}
						}
					}
					this.pageJson = json
				}
			})
			this.sortableModule["page-box"] = sortable
		},
		methods: {
			//保存页面
			savePage(){
				uni.showLoading({
					title: '正在保存'
				})
				this.$api.post("/core/update/", {"id": this.id, "page_json": this.pageJson}, {"Mid": "Page"}).then(res => {
					uni.hideLoading()
					if(res.code == 20000){
						uni.showToast({
							title: "保存成功",
							icon: 'success'
						})
					}else{
						uni.showToast({
							title: res.message,
							icon: 'error'
						})
					}
				})
			},
			//隐藏所有
			hideAll(){
				this.showModuleBox = false
			},
			//显示弹出框
			showDialog(id) {
				this.$refs[id].open()
			},
			//关闭弹出框
			hideDialog(id) {
				this.$refs[id].close()
			},
			//显示/隐藏组件框
			showModule() {
				this.showModuleBox = !this.showModuleBox
			},
			//创建拖动区域
			createDragLayout(id){
				this.$nextTick(() => {
					let sortable = Sortable.create(document.getElementById("drag-" + id), {
						animation: 150,
						handle: '.mover-item',
						onSort: (evt) => {
							//查找ID对应的
							let index = 0
							for (let i = 0; i < this.pageJson.length; i++) {
								if(id == this.pageJson[i].id){
									index = i
									break
								}
							}
							let json_sort = this.sortableModule["drag-" + id].toArray()
							//按照新的顺序排列
							let json = []
							for (let i = 0; i < json_sort.length; i++) {
								for (let j = 0; j < this.pageJson[index].children.length; j++) {
									let item = this.pageJson[index].children[j]
									if (json_sort[i] == item.id) {
										json.push(item)
										break
									}
								}
							}
							this.pageJson[index].children = json
						}
					})
					this.sortableModule["drag-" + id] = sortable
				})
			},
			//监听组件框显示/隐藏
			changeModuleBox(e) {
				if (e.detail) {
					//创建布局拖动组件
					this.sortableModuleLayout = Sortable.create(document.getElementById("module-layout"), {
						animation: 150,
						sort: false,
						draggable: '.module-item',
						onEnd: (evt) => {
							//布局组件（只能放到页面容器中）
							if (evt.originalEvent.target.id == "page-box") {
								//给页面添加布局组件
								let item = JSON.parse(JSON.stringify(this.datas.layout_json[evt.newIndex]))
								item["id"] = item["type"] + getRandomNum(6)
								this.pageJson.push(item)
								//创建拖动区域
								this.createDragLayout(item["id"])
							}
						}
					})
					//创建基础拖动组件
					this.sortableModuleBase = Sortable.create(document.getElementById("module-base"), {
						animation: 150,
						sort: false,
						draggable: '.module-item',
						onEnd: (evt) => {
							//基础组件（只能放到布局容器中）
							let id = evt.originalEvent.target.id
							if (id.indexOf("Layout") > -1) {
								//判断当前组件的位置
								for (let i = 0; i < this.pageJson.length; i++) {
									if (id == this.pageJson[i].id) {
										//添加子组件
										let item = JSON.parse(JSON.stringify(this.datas.base_show_json[evt
											.newIndex]))
										item["id"] = item["type"] + getRandomNum(6)
										this.pageJson[i].children.push(item)
										break;
									}
								}
							}
						}
					})
					//创建表单拖动组件
					this.sortableModuleForm = Sortable.create(document.getElementById("module-form"), {
						animation: 150,
						sort: false,
						draggable: '.module-item',
						onEnd: (evt) => {
							//表单组件（只能放到表单容器中）
							let id = evt.originalEvent.target.id
							// if (id.indexOf("Layout") > -1) {
							// 	//判断当前组件的位置
							// 	for(let i=0;i<this.pageJson.length;i++){
							// 		if(id == this.pageJson[i].id){
							// 			//添加子组件
							// 			let item = JSON.parse(JSON.stringify(this.baseJson[evt.newIndex]))
							// 			item["id"] = item["type"] + getRandomNum(6)
							// 			this.pageJson[i].children.push(item)
							// 			break;
							// 		}
							// 	}
							// }
						}
					})
				} else {
					//销毁布局拖动组件
					this.sortableModuleLayout.destroy()
					this.sortableModuleLayout = null
					//销毁基础拖动组件
					this.sortableModuleBase.destroy()
					this.sortableModuleBase = null
					//销毁表单拖动组件
					this.sortableModuleForm.destroy()
					this.sortableModuleForm = null
				}
			},
			//显示组件设置
			showModuleSetting(indexs) {
				this.moduleIndexs = indexs
				this.moduleSetting = JSON.parse(JSON.stringify(this.getCurrentModule(indexs)))
				this.showDialog("settingBox")
			},
			//获取当前组件
			getCurrentModule(indexs) {
				let item = this.pageJson[indexs[0]]
				for (let i = 1; i < indexs.length; i++) {
					item = this.getChildrenModule(indexs[i], item.children)
				}
				return item
			},
			//获取当前子组件集合
			getCurrentModuleList(indexs) {
				let children = []
				let item = this.pageJson[indexs[0]]
				for (let i = 1; i < indexs.length; i++) {
					if (i == indexs.length - 1) {
						children = item.children
					} else {
						item = this.getChildrenModule(indexs[i], item.children)
					}
				}
				return children
			},
			//获取子组件对象
			getChildrenModule(index, children) {
				return children[index]
			},
			//删除组件
			delModule() {
				if (this.moduleIndexs.length == 1) {
					this.pageJson.splice(this.moduleIndexs[0], 1)
				} else {
					this.getCurrentModuleList(this.moduleIndexs).splice(this.moduleIndexs[this.moduleIndexs.length - 1], 1)
				}
				this.hideDialog("settingBox")
				this.moduleIndexs = []
				this.moduleSetting = null
			},
			//更新组件值
			updateModuleValue({
				key,
				value
			}) {
				this.$set(this.getCurrentModule(this.moduleIndexs), key, value)
			},
		}
	}
</script>

<style scoped lang="scss">
	.module-box {
		position: fixed;
		top: 44px;
		left: 0;
		width: 200px;
		z-index: 11;

		.module-item {
			cursor: move;
			padding: 10px;
			margin: 0px 10px 10px 10px;
			border: 1px solid #ddd;
		}

	}

	.setting-box {
		min-width: 300px;

		.line {
			border-top: 1px solid #EBEEF5;
			padding: 10px 0 0 0;
		}
	}

	.page-box {
		border: 1px dashed red;

		.layout {
			border: 1px dashed blue;
			min-height: 100px;
			position: relative;

			.mover {
				cursor: move;
				position: absolute;
				top: 0;
				right: 0;
				background-color: #f8f8f8;
				padding: 5px;
				font-size: 13px;
				z-index: 10;
			}
		}
		
		.layout-item {
			border: 1px dashed #ddd;
			min-height: 70px;
			position: relative;
			background-color: #fff;
		
			.mover-item {
				cursor: move;
				position: absolute;
				bottom: 0;
				right: 0;
				background-color: #f8f8f8;
				padding: 5px;
				font-size: 13px;
				z-index: 10;
			}
		}

		.layout:after {
			content: "基础组件 - 拖动区域";
			padding: 15px;
			color: #ccc;
			display: block;
			text-align: center;
		}
	}

	.page-box:after {
		content: "布局组件 - 拖动区域";
		padding: 15px;
		color: #ccc;
		display: block;
		text-align: center;
	}
</style>