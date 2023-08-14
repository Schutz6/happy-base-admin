<template>
	<view class="page">
		<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
			<uni-card title="编辑模块" style="padding-bottom: 100px;">
				<view style="padding: 10px;">
					<uni-forms ref="form" :modelValue="dataForm" :rules="rules" label-position="top">
						<uni-row :gutter="50">
							<uni-col :span="6">
								<uni-forms-item label="模块ID" name="mid" required>
									<uni-easyinput type="text" trim="both" v-model="dataForm.mid" disabled />
								</uni-forms-item>
							</uni-col>
							<uni-col :span="6">
								<uni-forms-item label="模块名称" name="name" required>
									<uni-easyinput type="text" trim="both" v-model="dataForm.name" />
								</uni-forms-item>
							</uni-col>
							<uni-col :span="6">
								<uni-forms-item label="使用缓存" name="cache" required>
									<view class="box d-flex" style="height: 100%;padding-left: 10px;">
										<uni-data-checkbox v-model="dataForm.cache" :localdata="datas.if_status_json"></uni-data-checkbox>
									</view>
								</uni-forms-item>
							</uni-col>
							<uni-col :span="6">
								<uni-forms-item label="是否追溯" name="retrace" required>
									<view class="box d-flex" style="height: 100%;padding-left: 10px;">
										<uni-data-checkbox v-model="dataForm.retrace" :localdata="datas.if_status_json"></uni-data-checkbox>
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
								<view class="tr" v-for="(item, index) in dataForm.table_json" :key="index">
									<view class="td d-flex-center flex1">
										<uni-easyinput type="text" trim="both" v-model="item.name" :clearable="false" />
									</view>
									<view class="td d-flex-center" style="width: 110px;">
										<uni-data-select v-model="item.type" :localdata="datas.field_type_json" :clear="false"></uni-data-select>
									</view>
									<view class="td d-flex-center flex1">
										<uni-easyinput type="text" trim="both" v-model="item.remarks" :clearable="false" />
									</view>
									<view class="td d-flex-center" style="width: 60px;">
										<uni-easyinput type="text" trim="both" v-model="item.default" :clearable="false" />
									</view>
									<view class="td d-flex-center flex1">
										<uni-easyinput type="text" trim="both" v-model="item.key" :clearable="false" />
									</view>
									<view class="td d-flex-center" style="width: 40px;">
										<switch @change="switchShow($event, index)" :checked="item.show" style="transform:scale(0.6)" />
									</view>
									<view class="td d-flex-center" style="width: 40px;">
										<switch @change="switchQuery($event, index)" :checked="item.query" style="transform:scale(0.6)" />
									</view>
									<view class="td d-flex-center" style="width: 40px;">
										<switch @change="switchSingleQuery($event, index)" :checked="item.single_query" style="transform:scale(0.6)" />
									</view>
									<view class="td d-flex-center" style="width: 40px;">
										<switch @change="switchSort($event, index)" :checked="item.sort" style="transform:scale(0.6)" />
									</view>
									<view class="td d-flex-center" style="width: 40px;">
										<switch @change="switchUnique($event, index)" :checked="item.unique" style="transform:scale(0.6)" />
									</view>
									<view class="td d-flex-center" style="width: 40px;">
										<switch @change="switchEdit($event, index)" :checked="item.edit" style="transform:scale(0.6)" />
									</view>
									<view class="td d-flex-center" style="width: 40px;">
										<switch @change="switchMust($event, index)" :checked="item.must" style="transform:scale(0.6)" />
									</view>
									<view class="td d-flex-center" style="width: 70px;">
										<uni-icons class="operate-item pointer" type="trash" size="20" color="red" @click="delField(index)"></uni-icons>
										<uni-icons class="operate-item pointer" type="arrow-up" size="20" color="#007aff" @click="clickUp(index)"></uni-icons>
										<uni-icons class="operate-item pointer" type="arrow-down" size="20" color="#007aff" @click="clickDown(index)"></uni-icons>
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
										<uni-data-checkbox multiple v-model="dataForm.import_rule.fields" :localdata="showFieldList()"></uni-data-checkbox>
									</uni-td>
								</uni-tr>
								<uni-tr v-for="(item, index) in dataForm.import_rule.rules" :key="index">
									<uni-td align="center">导入规则</uni-td>
									<uni-td align="center">
										<view class="d-flex">
											<view class="d-flex" style="background: #fff;border: 1px solid #ddd;border-radius: 5px;padding: 5px 10px;">
												<view>开始行:</view>
												<input v-model="item.start_row" style="text-align: left;padding: 0 5px;width: 80px;" />
											</view>
											<view class="d-flex" style="margin-left: 10px;background: #fff;border: 1px solid #ddd;border-radius: 5px;padding: 5px 10px;">
												<view>结束行:</view>
												<input v-model="item.end_row" style="text-align: left;padding: 0 5px;width: 80px;" />
											</view>
											<uni-tag v-if="index!=0" text="删除规则" type	="error" @click="delRule(index)" style="margin-left: 10px;"></uni-tag>
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
										<uni-data-checkbox multiple v-model="dataForm.export_rule.fields" :localdata="showFieldList()"></uni-data-checkbox>
									</uni-td>
								</uni-tr>
							</uni-table>
						</uni-forms-item>
						<uni-forms-item label="激活接口" name="api_json" required>
							<uni-table ref="multipleTable" border stripe type="selection" @selection-change="selectionChange">
								<uni-tr>
									<uni-th align="center" width="200px">接口名称</uni-th>
									<uni-th align="center" width="100px">按钮显示</uni-th>
									<uni-th align="left">限制角色</uni-th>
								</uni-tr>
								<uni-tr v-for="(item, index) in dataForm.api_json" :key="index">
									<uni-td align="center">
										{{item.name}}
									</uni-td>
									<uni-td align="center">
										<switch @change="switchApiShow($event, index)" :checked="item.show" style="transform:scale(0.6)" />
									</uni-td>
									<uni-td align="center">
										<uni-data-checkbox multiple v-model="item.roles" :localdata="roles"></uni-data-checkbox>
									</uni-td>
								</uni-tr>
							</uni-table>
						</uni-forms-item>
					</uni-forms>
					<view class="d-flex-center" style="width: 240px;margin: 0 auto;padding-top: 20px;">
						<button type="primary" :loading="loading" @click="submit" style="font-size: 14px;width: 100px;">提交</button>
						<button type="default" :loading="loading" @click="back" style="font-size: 14px;width: 100px;">返回</button>
					</view>
				</view>
			</uni-card>
		</scroll-view>
		
		<!-- 弹出字段类型选择 -->
		<uni-popup ref="selectFieldTypeDialog" type="dialog">
			<uni-card title="选择字段类型">
				<view style="width: 500px;">
					<uni-data-checkbox v-model="field_type" :localdata="datas.field_type_json"></uni-data-checkbox>
				</view>
				<view class="d-flex-center" style="width: 240px;margin: 0 auto;padding-top: 10px;">
					<button type="primary" :loading="loading" @click="updateFieldType()" style="font-size: 14px;width: 100px;">确定</button>
					<button type="default" :loading="loading" @click="hideDialog('selectFieldTypeDialog')" style="font-size: 14px;width: 100px;">取消</button>
				</view>
			</uni-card>
		</uni-popup>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				eventChannel: null,
				loading: false,
				dataForm: {},
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					}
				},
				roles:[], //角色列表
				selectedIndex: null,//当前选择位置
			}
		},
		computed: {
			...mapGetters(['datas'])
		},
		onLoad() {
			this.eventChannel = this.getOpenerEventChannel()
			//初始化数据
			this.eventChannel.on('initData', (res)=> {
			    this.dataForm = res.data
			})
			//获取角色列表
			this.getRoleList()
			//默认选中
			this.toggleSelection()
		},
		methods: {
			//返回
			back(){
				uni.navigateBack()
			},
			//显示字段列表
			showFieldList(){
				return this.dataForm.table_json.map(item=>{return {"text": item.remarks, "value": item.name}})
			},
			//角色列表
			getRoleList(){
				this.$api.post("/dict/getList/", {"type_name": "Role"}).then(res => {
					if(res.code == 20000){
						this.roles = res.data
					}
				})
			},
			//默认选中
			toggleSelection() {
				this.$nextTick(() => {
					let indexs = []
					for(let i=0;i<this.dataForm.api_json.length;i++) {
						//判断是否满足选择条件
						if(this.dataForm.api_json[i].status){
							indexs.push(i)
						}
					}
					if(indexs.length>0){
						this.$refs.multipleTable.toggleRowSelection(indexs, true)
					}
			  })
			},
			// 多选
			selectionChange(e) {
				let indexs = e.detail.index
				for (let i = 0; i < this.dataForm.api_json.length; i++) {
					if(indexs.includes(i)){
						this.$set(this.dataForm.api_json[i], 'status', true)
					}else{
						this.$set(this.dataForm.api_json[i], 'status', false)
					}
				}
			},
			//新增规则
			addRule(){
				this.dataForm.import_rule.rules.push({"start_row": 2, "end_row": 0})
			},
			//删除规则
			delRule(index){
				this.dataForm.import_rule.rules.splice(index, 1)
			},
			//新增字段
			addField(){
				this.dataForm.table_json.push({"name": "", "type": 1, "remarks": "", "default": "", "key": "", "show": true, "query": false, "single_query": false, "sort": false, "unique": false, "edit": true, "must": true})
			},
			//点击上移
			clickUp(index){
				if(index > 0){
					this.swapArray(this.dataForm.table_json, index-1, index)
				}
			},
			//点击下移
			clickDown(index){
				if(index < this.dataForm.table_json.length-1){
					this.swapArray(this.dataForm.table_json, index, index+1)
				}
			},
			//数组元素互换位置
			swapArray(arr, index1, index2) {
				arr[index1] = arr.splice(index2, 1, arr[index1])[0]
				return arr
			},
			//删除字段
			delField(index){
				this.dataForm.table_json.splice(index, 1)
			},
			//是否显示按钮
			switchApiShow(e, index){
				this.$set(this.dataForm.api_json[index], 'show', e.detail.value)
			},
			//是否显示到表格
			switchShow(e, index){
				this.$set(this.dataForm.table_json[index], 'show', e.detail.value)
			},
			//是否显示到查询
			switchQuery(e, index){
				this.$set(this.dataForm.table_json[index], 'query', e.detail.value)
			},
			//是否显示单独查询
			switchSingleQuery(e, index){
				this.$set(this.dataForm.table_json[index], 'single_query', e.detail.value)
			},
			//是否显示排序
			switchSort(e, index){
				this.$set(this.dataForm.table_json[index], 'sort', e.detail.value)
			},
			//是否校验唯一性
			switchUnique(e, index){
				this.$set(this.dataForm.table_json[index], 'unique', e.detail.value)
			},
			//是否编辑
			switchEdit(e, index){
				this.$set(this.dataForm.table_json[index], 'edit', e.detail.value)
			},
			//是否必填
			switchMust(e, index){
				this.$set(this.dataForm.table_json[index], 'must', e.detail.value)
			},
			//提交
			submit(){
				this.$refs.form.validate().then(res => {
					if (!this.loading) {
						this.loading = true
						uni.showLoading({
							title: '正在提交'
						})
						this.$api.post("/code/update/", this.dataForm).then(res => {
							this.loading = false
							uni.hideLoading()
							if(res.code == 20000){
								uni.showToast({
									title: "提交成功",
									icon: 'success'
								})
								//删除缓存
								sessionStorage.removeItem("MID-"+this.dataForm.mid)
								setTimeout(()=>{
									this.back()
									this.eventChannel.emit("updateData", {})
								}, 600)
							}else{
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
	.box{
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 5px 0px;
		
		.item{
			padding: 5px 0;
			border-top: 1px solid #ddd;
		}
	}
	.table{
		border: 1px #EBEEF5 solid;
		
		.th{
			display: flex;
			border-bottom: 1px #EBEEF5 solid;
			
			.td{
				padding: 12px 10px;
				font-size: 14px;
				font-weight: bold;
				color: #909399;
				border-right: 1px #EBEEF5 solid;
			}
			.td:last-child{
				border-right: none;
			}
		}
		.tr{
			display: flex;
			border-bottom: 1px #EBEEF5 solid;
			
			.td{
				padding: 8px 10px;
				font-weight: 400;
				color: #606266;
				border-right: 1px #EBEEF5 solid;
			}
			.td:last-child{
				border-right: none;
			}
		}
		.tr:last-child{
			border-bottom: none;
		}
	}
</style>