<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card title="新增模块" style="padding-bottom: 100px;">
				<view style="width: 1100px;padding: 10px;">
					<uni-forms ref="form" :modelValue="dataForm" :rules="rules" label-position="top">
						<uni-row :gutter="50">
							<uni-col :span="8">
								<uni-forms-item label="模块ID" name="mid" required>
									<uni-easyinput type="text" trim="both" v-model="dataForm.mid" />
								</uni-forms-item>
							</uni-col>
							<uni-col :span="8">
								<uni-forms-item label="模块名称" name="name" required>
									<uni-easyinput type="text" trim="both" v-model="dataForm.name" />
								</uni-forms-item>
							</uni-col>
							<uni-col :span="8">
								<uni-forms-item label="使用缓存" name="cache" required>
									<view class="box d-flex" style="height: 100%;padding-left: 10px;">
										<uni-data-checkbox v-model="dataForm.cache" :localdata="datas.if_status_json"></uni-data-checkbox>
									</view>
								</uni-forms-item>
							</uni-col>
						</uni-row>
						<uni-forms-item label="激活接口" name="api_json" required>
							<checkbox-group @change="checkboxChange">
								<view class="box">
									<view class="d-flex" style="padding-bottom: 5px;padding-left: 10px;">
										<view style="width: 220px;">接口名称</view>
										<view class="flex1">限制角色</view>
									</view>
									<view class="item d-flex" style="padding-left: 10px;" v-for="(item, index) in dataForm.api_json" :key="index">
										<view class="d-flex" style="width: 220px;">
											<checkbox :value="item.id" :checked="item.status" style="transform:scale(0.8)" /> {{item.name}}
										</view>
										<view class="flex1">
											<uni-data-checkbox multiple v-model="item.roles" :localdata="roles"></uni-data-checkbox>
										</view>
									</view>
								</view>
							</checkbox-group>
						</uni-forms-item>
						<uni-forms-item label="字段管理" name="table_json" required>
							<view class="box">
								<view class="d-flex" style="padding-bottom: 5px;">
									<view class="flex1 d-flex-center">字段</view>
									<view class="flex1 d-flex-center">类型</view>
									<view class="flex1 d-flex-center">备注</view>
									<view class="flex1 d-flex-center">默认值</view>
									<view class="flex1 d-flex-center">绑定对象/字典</view>
									<view class="d-flex-center" style="width: 90px;">前端显示</view>
									<view class="d-flex-center" style="width: 90px;">查询字段</view>
									<view class="d-flex-center" style="width: 90px;">排序字段</view>
									<view class="d-flex-center" style="width: 90px;">唯一校验</view>
									<view class="d-flex-center" style="width: 90px;">操作</view>
								</view>
								<view class="item d-flex" v-for="(item, index) in dataForm.table_json" :key="index">
									<view class="flex1 d-flex-center" style="padding: 0 5px;">
										<uni-easyinput type="text" trim="both" v-model="item.name" :clearable="false" />
									</view>
									<view class="flex1 d-flex-center" style="padding: 0 5px;">
										<uni-data-select v-model="item.type" :localdata="datas.field_type_json" :clear="false"></uni-data-select>
									</view>
									<view class="flex1 d-flex-center" style="padding: 0 5px;">
										<uni-easyinput type="text" trim="both" v-model="item.remarks" :clearable="false" />
									</view>
									<view class="flex1 d-flex-center" style="padding: 0 5px;">
										<uni-easyinput type="text" trim="both" v-model="item.default" :clearable="false" />
									</view>
									<view class="flex1 d-flex-center" style="padding: 0 5px;">
										<uni-easyinput type="text" trim="both" v-model="item.key" :clearable="false" />
									</view>
									<view class="d-flex-center" style="width: 90px;">
										<switch @change="switchShow($event, index)" :checked="item.show" style="transform:scale(0.8)" />
									</view>
									<view class="d-flex-center" style="width: 90px;">
										<switch @change="switchQuery($event, index)" :checked="item.query" style="transform:scale(0.8)" />
									</view>
									<view class="d-flex-center" style="width: 90px;">
										<switch @change="switchSort($event, index)" :checked="item.sort" style="transform:scale(0.8)" />
									</view>
									<view class="d-flex-center" style="width: 90px;">
										<switch @change="switchUnique($event, index)" :checked="item.unique" style="transform:scale(0.8)" />
									</view>
									<view class="d-flex-center" style="width: 90px;">
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
					api_json: [
						{"id": "add", "name": "新增", "status": true, "roles": []},
						{"id": "update", "name": "编辑", "status": true, "roles": []},
						{"id": "delete", "name": "删除", "status": true, "roles": []},
						{"id": "recursionDelete", "name": "递归删除", "status": false, "roles": []},
						{"id": "batchDelete", "name": "批量删除", "status": false, "roles": []},
						{"id": "list", "name": "分页列表", "status": true, "roles": []},
						{"id": "getList", "name": "全部列表", "status": false, "roles": []},
						{"id": "getCategory", "name": "分类列表", "status": false, "roles": []},
						{"id": "getInfo", "name": "获取详情", "status": false, "roles": []}
					],
					// {"name": "字段", "type": "类型", "remarks": "备注", "default": "默认值", "key": "绑定对象/字典", "show": "前端显示", "query": "查询字段", "sort": "排序字段", "unique": "唯一校验"},
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
		},
		methods: {
			//返回
			back(){
				uni.navigateBack()
			},
			//角色列表
			getRoleList(){
				this.$api.get("/role/getList/").then(res => {
					if(res.code == 20000){
						this.roles = res.data
					}
				})
			},
			//多选
			checkboxChange(e){
				let values = e.detail.value
				for (let i = 0; i < this.dataForm.api_json.length; i++) {
					let item = this.dataForm.api_json[i]
					if(values.includes(item.id)){
						this.$set(this.dataForm.api_json[i], 'status', true)
					}else{
						this.$set(this.dataForm.api_json[i], 'status', false)
					}
				}
			},
			//新增字段
			addField(){
				this.dataForm.table_json.push({"name": "", "type": 1, "remarks": "", "default": "", "key": "", "show": true, "query": false, "sort": false, "unique": false})
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
			//是否显示到表格
			switchShow(e, index){
				this.$set(this.dataForm.table_json[index], 'show', e.detail.value)
			},
			//是否显示到查询
			switchQuery(e, index){
				this.$set(this.dataForm.table_json[index], 'query', e.detail.value)
			},
			//是否显示排序
			switchSort(e, index){
				this.$set(this.dataForm.table_json[index], 'sort', e.detail.value)
			},
			//是否校验唯一性
			switchUnique(e, index){
				this.$set(this.dataForm.table_json[index], 'unique', e.detail.value)
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
