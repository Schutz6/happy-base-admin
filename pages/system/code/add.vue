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
						<uni-forms-item label="字段管理" name="table_json" required>
							<uni-table stripe emptyText="请新增字段" style="padding-bottom: 220px;border: 1px #ebeef5 solid;">
								<uni-tr>
									<uni-th align="center" width="140px">字段</uni-th>
									<uni-th align="center" width="100px">类型</uni-th>
									<uni-th align="center" width="140px">备注</uni-th>
									<uni-th align="center" width="100px">默认值</uni-th>
									<uni-th align="center" width="140px">绑定对象/字典</uni-th>
									<uni-th align="center" width="60px">表格显示</uni-th>
									<uni-th align="center" width="60px">综合查询</uni-th>
									<uni-th align="center" width="60px">单独查询</uni-th>
									<uni-th align="center" width="60px">排序字段</uni-th>
									<uni-th align="center" width="60px">唯一校验</uni-th>
									<uni-th align="center" width="60px">是否编辑</uni-th>
									<uni-th align="center" width="60px">是否必填</uni-th>
									<uni-th align="center" width="80px">操作</uni-th>
								</uni-tr>
								<uni-tr v-for="(item, index) in dataForm.table_json" :key="index">
									<uni-td align="center">
										<uni-easyinput type="text" trim="both" v-model="item.name" :clearable="false" />
									</uni-td>
									<uni-td align="center">
										<uni-data-select v-model="item.type" :localdata="datas.field_type_json" :clear="false"></uni-data-select>
									</uni-td>
									<uni-td align="center">
										<uni-easyinput type="text" trim="both" v-model="item.remarks" :clearable="false" />
									</uni-td>
									<uni-td align="center">
										<uni-easyinput type="text" trim="both" v-model="item.default" :clearable="false" />
									</uni-td>
									<uni-td align="center">
										<uni-easyinput type="text" trim="both" v-model="item.key" :clearable="false" />
									</uni-td>
									<uni-td align="center">
										<switch @change="switchShow($event, index)" :checked="item.show" style="transform:scale(0.6)" />
									</uni-td>
									<uni-td align="center">
										<switch @change="switchQuery($event, index)" :checked="item.query" style="transform:scale(0.6)" />
									</uni-td>
									<uni-td align="center">
										<switch @change="switchSingleQuery($event, index)" :checked="item.single_query" style="transform:scale(0.6)" />
									</uni-td>
									<uni-td align="center">
										<switch @change="switchSort($event, index)" :checked="item.sort" style="transform:scale(0.6)" />
									</uni-td>
									<uni-td align="center">
										<switch @change="switchUnique($event, index)" :checked="item.unique" style="transform:scale(0.6)" />
									</uni-td>
									<uni-td align="center">
										<switch @change="switchEdit($event, index)" :checked="item.edit" style="transform:scale(0.6)" />
									</uni-td>
									<uni-td align="center">
										<switch @change="switchMust($event, index)" :checked="item.must" style="transform:scale(0.6)" />
									</uni-td>
									<uni-td align="center">
										<uni-icons class="operate-item pointer" type="trash" size="20" color="red" @click="delField(index)"></uni-icons>
										<uni-icons class="operate-item pointer" type="arrow-up" size="20" color="#007aff" @click="clickUp(index)"></uni-icons>
										<uni-icons class="operate-item pointer" type="arrow-down" size="20" color="#007aff" @click="clickDown(index)"></uni-icons>
									</uni-td>
								</uni-tr>
							</uni-table>
							<view style="padding-top: 5px;text-align: right;">
								<uni-tag text="新增字段" @click="addField()"></uni-tag>
							</view>
						</uni-forms-item>
					</uni-forms>
					<view class="d-flex-center" style="width: 240px;margin: 0 auto;padding-top: 20px;">
						<button type="primary" :loading="loading" @click="submit" style="font-size: 14px;width: 100px;">提交</button>
						<button type="default" :loading="loading" @click="back" style="font-size: 14px;width: 100px;">返回</button>
					</view>
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
				eventChannel: null,
				loading: false,
				dataForm: {
					mid: null,
					name: null,
					cache: 0,
					retrace: 0,
					api_json: [
						{"id": "add", "name": "新增", "status": true, "show": true, "roles": ['super', 'admin']},
						{"id": "update", "name": "编辑", "status": true, "show": true, "roles": ['super', 'admin']},
						{"id": "delete", "name": "删除", "status": true, "show": true, "roles": ['super', 'admin']},
						{"id": "recursionDelete", "name": "递归删除", "status": false, "show": false, "roles": []},
						{"id": "batchDelete", "name": "批量删除", "status": true, "show": true, "roles": ['super', 'admin']},
						{"id": "batchUpdate", "name": "批量修改", "status": false, "show": false, "roles": []},
						{"id": "list", "name": "分页列表", "status": true, "show": true, "roles": ['super', 'admin']},
						{"id": "getList", "name": "全部列表", "status": false, "show": false, "roles": []},
						{"id": "getCategory", "name": "分类列表", "status": false, "show": false, "roles": []},
						{"id": "getInfo", "name": "获取详情", "status": false, "show": false, "roles": []},
						{"id": "importData", "name": "导入数据", "status": false, "show": false, "roles": []},
						{"id": "exportData", "name": "导出数据", "status": false, "show": false, "roles": []}
					],
					// {"name": "字段", "type": "类型", "remarks": "备注", "default": "默认值", "key": "绑定对象/字典", "show": "表格显示", "query": "综合查询", "single_query": "单独查询", "sort": "排序字段", "unique": "唯一校验", "edit": "是否编辑", "must": "是否必填"},
					table_json: []
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
				roles:[], //角色列表
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
		methods: {
			//返回
			back(){
				uni.navigateBack()
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
						this.$api.post("/code/add/", this.dataForm).then(res => {
							this.loading = false
							uni.hideLoading()
							if(res.code == 20000){
								uni.showToast({
									title: "提交成功",
									icon: 'success'
								})
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
</style>
