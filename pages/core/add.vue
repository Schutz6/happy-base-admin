<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card :title="'新增信息 - '+module.name">
				<view style="width: 550px;padding: 10px;">
					<uni-forms ref="form" :modelValue="dataForm" :rules="rules" label-width="100px">
						<uni-forms-item v-for="(table, tableIndex) in module.table_json" :key="tableIndex" :label="table.remarks" :name="table.name" required>
							<template v-if="table.type==1">
								<!-- 字符串 -->
								<uni-easyinput type="text" trim="both" v-model="dataForm[table.name]" />
							</template>
							<template v-else-if="table.type==2 || table.type==3">
								<!-- 数字 -->
								<uni-easyinput type="number" trim="both" v-model="dataForm[table.name]" />
							</template>
							<template v-else-if="table.type==4">
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
							<template v-else-if="table.type==6">
								<!-- 图片 -->
								<uni-file-picker ref="avatar" limit="1" @select="selectFile($event, table.name)" :auto-upload="false"></uni-file-picker>
							</template>
							<template v-else-if="table.type==7">
								<!-- 多文本 -->
								<uni-easyinput type="textarea" trim="both" v-model="dataForm[table.name]" />
							</template>
							<template v-else-if="table.type==8">
								<!-- 富文本 -->
								<module-editor :ref="'editor-'+table.name" html=""></module-editor>
							</template>
						</uni-forms-item>
					</uni-forms>
					<view class="d-flex-center" style="width: 240px;margin: 0 auto;padding-top: 20px;padding-bottom: 20px;">
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
				module: {},
				dict: {},//字典
				eventChannel: null,
				loading: false,
				dataForm: {},
				rules: {
					username: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					status: {
						rules: [{
							required: true,
							errorMessage: "请选择"
						}]
					}
				},
			}
		},
		computed: {
			...mapGetters(['datas'])
		},
		onLoad() {
			this.eventChannel = this.getOpenerEventChannel()
			//初始化数据
			this.eventChannel.on('initData', (res)=> {
			    this.module = res.module
				this.dict = res.dict
			})
		},
		methods: {
			//返回
			back(){
				uni.navigateBack()
			},
			//获取字典
			getDict(name){
				return this.dict[name]
			},
			//提交
			submit(){
				//判断是否有富文本
				for(let i=0;i<this.module.table_json.length;i++){
					let item = this.module.table_json[i]
					if(item.type == 8){
						//获取富文本内容
						this.dataForm[item.name] = this.$refs["editor-"+item.name][0].getHtml()
					}
				}
				this.$refs.form.validate().then(res => {
					if (!this.loading) {
						this.loading = true
						uni.showLoading({
							title: '正在提交'
						})
						this.$api.post("/core/add/", this.dataForm, {"Mid": this.module.mid}).then(res => {
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
			},
			//选择图片后触发
			selectFile(e, name){
				uni.showLoading({
					title: '正在上传'
				})
				this.$api.uploadFile('/file/upload/', e.tempFilePaths[0]).then(res => {
					uni.hideLoading()
					if(res.code == 20000){
						uni.showToast({
							title: "上传成功",
							icon: 'success'
						})
						this.dataForm[name] = res.data.download_path
					}else{
						uni.showToast({
							title: res.message,
							icon: 'error'
						})
					}
				})
			}
		}
	}
</script>

<style>

</style>
