<template>
	<view class="page">
		<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
			<uni-card :title="'批量修改 - '+module.name">
				<view style="width: 550px;padding: 10px;">
					<uni-forms ref="form" :modelValue="dataForm" :rules="rules" label-width="100px">
						<uni-forms-item v-for="(table, tableIndex) in module.table_json" :key="tableIndex" v-if="[4, 5, 9, 10].includes(table.type)" :label="table.remarks" :name="table.name" required>
							<template v-if="table.type==4">
								<!-- 列表 -->
								<view class="d-flex" style="height: 100%;">
									<uni-data-checkbox multiple v-model="dataForm[table.name]" :localdata="getDict(table.key)"></uni-data-checkbox>
								</view>
							</template>
							<template v-else-if="table.type==5">
								<!-- 字典 -->
								<view class="d-flex" style="height: 100%;">
									<uni-data-checkbox v-model="dataForm[table.name]" :localdata="getDict(table.key)"></uni-data-checkbox>
								</view>
							</template>
							<template v-else-if="table.type==9 && table.name!='uid'">
								<!-- 对象选择 -->
								<uni-data-select v-model="dataForm[table.name]" :localdata="getObject(table.key)"></uni-data-select>
							</template>
							<template v-else-if="table.type==10">
								<!-- 分类选择 -->
								<uni-data-picker v-model="dataForm[table.name]" :localdata="getCategory(table.key)" @change="onCategoryChange($event, table.name)"></uni-data-picker>
							</template>
						</uni-forms-item>
					</uni-forms>
					<view class="d-flex-center" style="width: 240px;margin: 0 auto;padding-top: 20px;padding-bottom: 20px;">
						<button type="primary" :loading="loading" @click="submit" style="font-size: 14px;width: 100px;">修改</button>
						<button type="default" :loading="loading" @click="back" style="font-size: 14px;width: 100px;">返回</button>
					</view>
				</view>
			</uni-card>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ids: [],
				module: {},
				dict: {},//字典
				category: {},//分类
				object: {},//对象
				eventChannel: null,
				loading: false,
				dataForm: {},
				rules: {},
			}
		},
		onLoad() {
			this.eventChannel = this.getOpenerEventChannel()
			//初始化数据
			this.eventChannel.on('initData', (res)=> {
				this.ids = res.ids
				this.module = res.module
				this.dict = res.dict
				this.category = res.category
				this.object = res.object
				if(res.data){
					this.dataForm = res.data
				}
			})
		},
		methods: {
			//返回
			back(){
				uni.navigateBack()
			},
			//获取对象
			getObject(name){
				return this.object[name]
			},
			//获取分类
			getCategory(name){
				return this.category[name]
			},
			//分类选择
			onCategoryChange(e, name) {
				this.dataForm[name] = e.detail.value
			},
			//获取字典
			getDict(name){
				return this.dict[name]
			},
			//提交
			submit(){
				this.$refs.form.validate().then(res => {
					if (!this.loading) {
						this.loading = true
						uni.showLoading({
							title: '正在修改'
						})
						this.$api.post("/core/batchUpdate/", this.dataForm, {"Mid": this.module.mid}).then(res => {
							this.loading = false
							uni.hideLoading()
							if(res.code == 20000){
								uni.showToast({
									title: "修改成功",
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
			},
		}
	}
</script>

<style>

</style>
