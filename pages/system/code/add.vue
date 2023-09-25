<template>
	<view class="page">
		<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
			<uni-card title="新增模块" style="padding-bottom: 100px;">
				<view style="padding: 10px;">
					<uni-forms ref="form" :modelValue="dataForm" :rules="rules" label-position="top">
						<uni-row :gutter="50">
							<uni-col :span="6">
								<uni-forms-item label="模块ID" name="mid" required>
									<uni-easyinput type="text" trim="both" v-model="dataForm.mid" />
								</uni-forms-item>
							</uni-col>
							<uni-col :span="6">
								<uni-forms-item label="模块名称" name="name" required>
									<uni-easyinput type="text" trim="both" v-model="dataForm.name" />
								</uni-forms-item>
							</uni-col>
							<uni-col :span="6">
								<uni-forms-item label="是否缓存" name="cache" required>
									<view class="box d-flex" style="height: 100%;padding-left: 10px;">
										<uni-data-checkbox v-model="dataForm.cache"
											:localdata="datas.if_status_json"></uni-data-checkbox>
									</view>
								</uni-forms-item>
							</uni-col>
							<uni-col :span="6">
								<uni-forms-item label="是否追溯" name="retrace" required>
									<view class="box d-flex" style="height: 100%;padding-left: 10px;">
										<uni-data-checkbox v-model="dataForm.retrace"
											:localdata="datas.if_status_json"></uni-data-checkbox>
									</view>
								</uni-forms-item>
							</uni-col>
						</uni-row>
						<uni-forms-item label="字段管理" name="table_json" required>
							<view class="table">
								<view class="th">
									<view class="td d-flex-center flex1">字段</view>
									<view class="td d-flex-center" style="width: 110px;">类型</view>
									<view class="td d-flex-center flex1">备注</view>
									<view class="td d-flex-center" style="width: 60px;">默认值</view>
									<view class="td d-flex-center flex1">绑定对象</view>
									<view class="td d-flex-center" style="width: 40px;">表格</view>
									<view class="td d-flex-center" style="width: 40px;">综合</view>
									<view class="td d-flex-center" style="width: 40px;">单独</view>
									<view class="td d-flex-center" style="width: 40px;">排序</view>
									<view class="td d-flex-center" style="width: 40px;">唯一</view>
									<view class="td d-flex-center" style="width: 40px;">编辑</view>
									<view class="td d-flex-center" style="width: 40px;">必填</view>
									<view class="td d-flex-center" style="width: 70px;">操作</view>
								</view>
								<view id="drag-box">
									<view class="tr" v-for="(item, index) in table_json" :key="index"
										:data-id="item.name">
										<view class="td d-flex-center flex1">
											<uni-easyinput type="text" trim="both" v-model="item.name"
												:clearable="false" />
										</view>
										<view class="td d-flex-center" style="width: 110px;">
											<uni-data-select v-model="item.type" :localdata="datas.field_type_json"
												:clear="false"></uni-data-select>
										</view>
										<view class="td d-flex-center flex1">
											<uni-easyinput type="text" trim="both" v-model="item.remarks"
												:clearable="false" />
										</view>
										<view class="td d-flex-center" style="width: 60px;">
											<uni-easyinput type="text" trim="both" v-model="item.default"
												:clearable="false" />
										</view>
										<view class="td d-flex-center flex1">
											<uni-easyinput type="text" trim="both" v-model="item.key"
												:clearable="false" />
										</view>
										<view class="td d-flex-center" style="width: 40px;">
											<switch @change="switchShow($event, item.name)" :checked="item.show"
												style="transform:scale(0.6)" />
										</view>
										<view class="td d-flex-center" style="width: 40px;">
											<switch @change="switchQuery($event, item.name)" :checked="item.query"
												style="transform:scale(0.6)" />
										</view>
										<view class="td d-flex-center" style="width: 40px;">
											<switch @change="switchSingleQuery($event, item.name)"
												:checked="item.single_query" style="transform:scale(0.6)" />
										</view>
										<view class="td d-flex-center" style="width: 40px;">
											<switch @change="switchSort($event, item.name)" :checked="item.sort"
												style="transform:scale(0.6)" />
										</view>
										<view class="td d-flex-center" style="width: 40px;">
											<switch @change="switchUnique($event, item.name)" :checked="item.unique"
												style="transform:scale(0.6)" />
										</view>
										<view class="td d-flex-center" style="width: 40px;">
											<switch @change="switchEdit($event, item.name)" :checked="item.edit"
												style="transform:scale(0.6)" />
										</view>
										<view class="td d-flex-center" style="width: 40px;">
											<switch @change="switchMust($event, item.name)" :checked="item.must"
												style="transform:scale(0.6)" />
										</view>
										<view class="td d-flex-center" style="width: 70px;">
											<uni-icons class="pointer" type="trash" size="20" color="red"
												@click="delField(item.name)"></uni-icons>
											<image class="mover" src="@/static/icons/icon-move.png"
												style="width: 20px;height: 20px;margin-left: 5px;cursor: move;"></image>
										</view>
									</view>
								</view>
							</view>
							<view style="padding-top: 5px;text-align: right;">
								<uni-tag text="新增字段" @click="addField()"></uni-tag>
							</view>
						</uni-forms-item>
						<uni-forms-item label="导入规则" name="import_rule" required>
							<uni-table border stripe>
								<uni-tr>
									<uni-th align="center" width="160px">规则名称</uni-th>
									<uni-th align="center">规则内容</uni-th>
								</uni-tr>
								<uni-tr>
									<uni-td align="center">需导入的字段</uni-td>
									<uni-td align="center">
										<uni-data-checkbox multiple v-model="dataForm.import_rule.fields"
											:localdata="showFieldList()"></uni-data-checkbox>
									</uni-td>
								</uni-tr>
								<uni-tr v-for="(item, index) in dataForm.import_rule.rules" :key="index">
									<uni-td align="center">导入规则</uni-td>
									<uni-td align="center">
										<view class="d-flex">
											<view class="d-flex"
												style="background: #fff;border: 1px solid #ddd;border-radius: 5px;padding: 5px 10px;">
												<view>开始行:</view>
												<input v-model="item.start_row"
													style="text-align: left;padding: 0 5px;width: 80px;" />
											</view>
											<view class="d-flex"
												style="margin-left: 10px;background: #fff;border: 1px solid #ddd;border-radius: 5px;padding: 5px 10px;">
												<view>结束行:</view>
												<input v-model="item.end_row"
													style="text-align: left;padding: 0 5px;width: 80px;" />
											</view>
											<uni-tag v-if="index!=0" text="删除规则" type="error" @click="delRule(index)"
												style="margin-left: 10px;"></uni-tag>
											<view style="margin-left: 10px;color: red;">注意：结束行为0，表示无限制</view>
										</view>
									</uni-td>
								</uni-tr>
							</uni-table>
							<view style="padding-top: 5px;text-align: right;">
								<uni-tag text="新增规则" @click="addRule()"></uni-tag>
							</view>
						</uni-forms-item>
						<uni-forms-item label="导出规则" name="export_rule" required>
							<uni-table border stripe>
								<uni-tr>
									<uni-th align="center" width="160px">规则名称</uni-th>
									<uni-th align="center">规则内容</uni-th>
								</uni-tr>
								<uni-tr>
									<uni-td align="center">导出的字段</uni-td>
									<uni-td align="center">
										<uni-data-checkbox multiple v-model="dataForm.export_rule.fields"
											:localdata="showFieldList()"></uni-data-checkbox>
									</uni-td>
								</uni-tr>
							</uni-table>
						</uni-forms-item>
						<uni-forms-item label="激活接口" name="api_json" required>
							<uni-table ref="multipleTable" border stripe type="selection"
								@selection-change="selectionChange">
								<uni-tr>
									<uni-th align="center" width="200px">接口名称</uni-th>
									<uni-th align="center" width="100px">按钮显示</uni-th>
									<uni-th align="left">限制角色（不选则无限制）</uni-th>
								</uni-tr>
								<uni-tr v-for="(item, index) in dataForm.api_json" :key="index">
									<uni-td align="center">
										{{item.name}}
									</uni-td>
									<uni-td align="center">
										<switch @change="switchApiShow($event, index)" :checked="item.show"
											style="transform:scale(0.6)" />
									</uni-td>
									<uni-td align="center">
										<uni-data-checkbox multiple v-model="item.roles"
											:localdata="roles"></uni-data-checkbox>
									</uni-td>
								</uni-tr>
							</uni-table>
						</uni-forms-item>
					</uni-forms>
					<view class="d-flex-center" style="width: 240px;margin: 0 auto;padding-top: 20px;">
						<button type="primary" :loading="loading" @click="submit"
							style="font-size: 14px;width: 100px;">提交</button>
						<button type="default" @click="back" style="font-size: 14px;width: 100px;">返回</button>
					</view>
				</view>
			</uni-card>
		</scroll-view>
	</view>
</template>

<script>
	import Sortable from 'sortablejs'
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				eventChannel: null,
				loading: false,
				dataForm: {
					mid: null,
					name: null,
					cache: 0,
					retrace: 0,
					api_json: [{
							"id": "add",
							"name": "新增",
							"status": true,
							"show": true,
							"roles": ['super', 'admin']
						},
						{
							"id": "update",
							"name": "编辑",
							"status": true,
							"show": true,
							"roles": ['super', 'admin']
						},
						{
							"id": "delete",
							"name": "删除",
							"status": true,
							"show": true,
							"roles": ['super', 'admin']
						},
						{
							"id": "recursionDelete",
							"name": "递归删除",
							"status": false,
							"show": false,
							"roles": []
						},
						{
							"id": "batchDelete",
							"name": "批量删除",
							"status": true,
							"show": true,
							"roles": ['super', 'admin']
						},
						{
							"id": "batchUpdate",
							"name": "批量修改",
							"status": false,
							"show": false,
							"roles": []
						},
						{
							"id": "list",
							"name": "分页列表",
							"status": true,
							"show": true,
							"roles": ['super', 'admin']
						},
						{
							"id": "getList",
							"name": "全部列表",
							"status": false,
							"show": false,
							"roles": []
						},
						{
							"id": "getCategory",
							"name": "分类列表",
							"status": false,
							"show": false,
							"roles": []
						},
						{
							"id": "getInfo",
							"name": "获取详情",
							"status": false,
							"show": false,
							"roles": []
						},
						{
							"id": "importData",
							"name": "导入数据",
							"status": false,
							"show": false,
							"roles": []
						},
						{
							"id": "exportData",
							"name": "导出数据",
							"status": false,
							"show": false,
							"roles": []
						}
					],
					// {"name": "字段", "type": "类型", "remarks": "备注", "default": "默认值", "key": "绑定对象/字典", "show": "表格显示", "query": "综合查询", "single_query": "单独查询", "sort": "排序字段", "unique": "唯一校验", "edit": "是否编辑", "must": "是否必填"},
					table_json: [],
					import_rule: {
						fields: [],
						rules: [{
							"start_row": 2,
							"end_row": 0
						}]
					},
					export_rule: {
						fields: []
					}
				},
				rules: {
					mid: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					name: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					}
				},
				roles: [], //角色列表
				selectedIndex: null, //当前选择位置
				table_json: [], //字段列表
				table_json_sort: [], //字段排序
			}
		},
		computed: {
			...mapGetters(['datas'])
		},
		onLoad() {
			this.eventChannel = this.getOpenerEventChannel()
			//获取角色列表
			this.getRoleList()
			//默认选中
			this.toggleSelection()
		},
		onReady() {
			//创建可拖动排序对象
			this.sortable = Sortable.create(document.getElementById("drag-box"), {
				animation: 150,
				handle: '.mover'
			})
		},
		methods: {
			//返回
			back() {
				uni.navigateBack()
			},
			//显示字段列表
			showFieldList() {
				return this.table_json.map(item => {
					return {
						"text": item.remarks,
						"value": item.name
					}
				})
			},
			//角色列表
			getRoleList() {
				this.$api.post("/dict/getList/", {
					"type_name": "Role"
				}).then(res => {
					if (res.code == 20000) {
						this.roles = res.data
					}
				})
			},
			//默认选中
			toggleSelection() {
				this.$nextTick(() => {
					let indexs = []
					for (let i = 0; i < this.dataForm.api_json.length; i++) {
						//判断是否满足选择条件
						if (this.dataForm.api_json[i].status) {
							indexs.push(i)
						}
					}
					if (indexs.length > 0) {
						this.$refs.multipleTable.toggleRowSelection(indexs, true)
					}
				})
			},
			// 多选
			selectionChange(e) {
				let indexs = e.detail.index
				for (let i = 0; i < this.dataForm.api_json.length; i++) {
					if (indexs.includes(i)) {
						this.$set(this.dataForm.api_json[i], 'status', true)
					} else {
						this.$set(this.dataForm.api_json[i], 'status', false)
					}
				}
			},
			//新增规则
			addRule() {
				this.dataForm.import_rule.rules.push({
					"start_row": 2,
					"end_row": 0
				})
			},
			//删除规则
			delRule(index) {
				this.dataForm.import_rule.rules.splice(index, 1)
			},
			//新增字段
			addField() {
				let item = {
					"name": "",
					"type": 1,
					"remarks": "",
					"default": "",
					"key": "",
					"show": true,
					"query": false,
					"single_query": false,
					"sort": false,
					"unique": false,
					"edit": true,
					"must": true
				}
				this.table_json.push(item)
			},
			//删除字段
			delField(name) {
				for (let i = 0; i < this.table_json.length; i++) {
					if (name == this.table_json[i].name) {
						this.table_json.splice(i, 1)
						break
					}
				}
			},
			//是否显示按钮
			switchApiShow(e, index) {
				this.$set(this.dataForm.api_json[index], 'show', e.detail.value)
			},
			//是否显示到表格
			switchShow(e, name) {
				for (let i = 0; i < this.table_json.length; i++) {
					if (name == this.table_json[i].name) {
						this.$set(this.table_json[i], 'show', e.detail.value)
						break
					}
				}
			},
			//是否显示到查询
			switchQuery(e, name) {
				for (let i = 0; i < this.table_json.length; i++) {
					if (name == this.table_json[i].name) {
						this.$set(this.table_json[i], 'query', e.detail.value)
						break
					}
				}
			},
			//是否显示单独查询
			switchSingleQuery(e, name) {
				for (let i = 0; i < this.table_json.length; i++) {
					if (name == this.table_json[i].name) {
						this.$set(this.table_json[i], 'single_query', e.detail.value)
						break
					}
				}
			},
			//是否显示排序
			switchSort(e, name) {
				for (let i = 0; i < this.table_json.length; i++) {
					if (name == this.table_json[i].name) {
						this.$set(this.table_json[i], 'sort', e.detail.value)
						break
					}
				}
			},
			//是否校验唯一性
			switchUnique(e, name) {
				for (let i = 0; i < this.table_json.length; i++) {
					if (name == this.table_json[i].name) {
						this.$set(this.table_json[i], 'unique', e.detail.value)
						break
					}
				}
			},
			//是否编辑
			switchEdit(e, name) {
				for (let i = 0; i < this.table_json.length; i++) {
					if (name == this.table_json[i].name) {
						this.$set(this.table_json[i], 'edit', e.detail.value)
						break
					}
				}
			},
			//是否必填
			switchMust(e, name) {
				for (let i = 0; i < this.table_json.length; i++) {
					if (name == this.table_json[i].name) {
						this.$set(this.table_json[i], 'must', e.detail.value)
						break
					}
				}
			},
			//提交
			submit() {
				this.$refs.form.validate().then(res => {
					if (!this.loading) {
						this.loading = true
						uni.showLoading({
							title: '正在提交'
						})
						//获取当前排序
						this.table_json_sort = this.sortable.toArray()
						//按照新的顺序排列
						let table_json = []
						for (let i = 0; i < this.table_json_sort.length; i++) {
							for (let j = 0; j < this.table_json.length; j++) {
								if (this.table_json_sort[i] == this.table_json[j].name) {
									table_json.push(this.table_json[j])
									break
								}
							}
						}
						this.dataForm.table_json = table_json
						this.$api.post("/code/add/", this.dataForm).then(res => {
							this.loading = false
							uni.hideLoading()
							if (res.code == 20000) {
								uni.showToast({
									title: "提交成功",
									icon: 'success'
								})
								//删除缓存
								sessionStorage.removeItem("MID-" + this.dataForm.mid)
								setTimeout(() => {
									this.back()
									this.eventChannel.emit("updateData", {})
								}, 600)
							} else {
								uni.showToast({
									title: res.message,
									icon: 'error'
								})
							}
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.box {
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 5px 0px;

		.item {
			padding: 5px 0;
			border-top: 1px solid #ddd;
		}
	}

	.table {
		border: 1px #EBEEF5 solid;

		.th {
			display: flex;
			border-bottom: 1px #EBEEF5 solid;

			.td {
				padding: 12px 10px;
				font-size: 14px;
				font-weight: bold;
				color: #909399;
				border-right: 1px #EBEEF5 solid;
			}

			.td:last-child {
				border-right: none;
			}
		}

		.tr {
			display: flex;
			border-bottom: 1px #EBEEF5 solid;

			.td {
				padding: 8px 10px;
				font-weight: 400;
				color: #606266;
				border-right: 1px #EBEEF5 solid;
			}

			.td:last-child {
				border-right: none;
			}
		}

		.tr:last-child {
			border-bottom: none;
		}
	}
</style>