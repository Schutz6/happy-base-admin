<template>
	<view class="page">
		<scroll-view class="scroll-iframe-box" :scroll-y="true" :scroll-x="false">
			<uni-card :title="'编辑信息 - '+module.name">
				<view style="width: 550px;padding: 10px;">
					<uni-forms ref="form" :modelValue="dataForm" :rules="rules" label-width="100px">
						<uni-forms-item v-for="(table, tableIndex) in module.table_json" :key="tableIndex" v-if="table.name.indexOf('.') == -1" :label="table.remarks" :name="table.name" required>
							<template v-if="table.type==1">
								<!-- 字符串 -->
								<uni-easyinput type="text" trim="both" v-model="dataForm[table.name]" />
							</template>
							<template v-else-if="table.type==2 || table.type==3">
								<!-- 数字 -->
								<uni-easyinput type="number" trim="both" v-model="dataForm[table.name]" :disabled="table.name==='pid' || table.name==='level'" />
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
								<!-- 单图片 -->
								<uni-file-picker :ref="'file-'+table.name" :value="formatImage(dataForm[table.name])" limit="1" @delete="deleteFile($event, table.name)" @select="selectFile($event, table.name)" :auto-upload="false"></uni-file-picker>
								<view style="margin-top: 5px;">
									<uni-easyinput type="text" trim="both" v-model="dataForm[table.name]" placeholder="图片地址" />
								</view>
							</template>
							<template v-else-if="table.type==12">
								<!-- 多图片 -->
								<uni-file-picker :ref="'file-'+table.name" :value="formatImages(dataForm[table.name])" limit="3" @delete="deleteFiles($event, table.name)" @select="selectFiles($event, table.name)" :auto-upload="false"></uni-file-picker>
							</template>
							<template v-else-if="table.type==7">
								<!-- 多文本 -->
								<uni-easyinput type="textarea" trim="both" autoHeight :maxlength="-1" v-model="dataForm[table.name]" />
							</template>
							<template v-else-if="table.type==8">
								<!-- 富文本 -->
								<module-editor :id="'editor-'+table.name" :ref="'editor-'+table.name" :html="dataForm[table.name]"></module-editor>
							</template>
							<template v-else-if="table.type==9">
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
						<button type="primary" :loading="loading" @click="submit" style="font-size: 14px;width: 100px;">提交</button>
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
				this.module = res.module
				this.dict = res.dict
				this.category = res.category
				this.object = res.object
				this.dataForm = res.data
				
				this.initRules()
			})
		},
		methods: {
			//返回
			back(){
				uni.navigateBack()
			},
			//初始化验证规则
			initRules(){
				for(let i=0;i<this.module.table_json.length;i++){
					let table = this.module.table_json[i]
					if(table.type == 4 || table.type == 5 || table.type == 10){
						this.rules[table.name] = {
							rules: [{
								required: true,
								errorMessage: "请选择"
							}]
						}
					}else if(table.type == 6 || table.type == 8 || table.type == 12){
						
					}else{
						this.rules[table.name] = {
							rules: [{
								required: true,
								errorMessage: "请输入"
							}]
						}
					}
				}
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
			//格式化单图片
			formatImage(img){
				let results = []
				if(img){
					results.push({'url': img})
				}
				return results
			},
			//格式化多图片
			formatImages(imgs){
				let results = []
				if(imgs){
					for(let i=0;i<imgs.length;i++){
						results.push({'url': imgs[i]})
					}
				}
				return results
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
						this.$api.post("/core/update/", this.dataForm, {"Mid": this.module.mid}).then(res => {
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
						this.$refs['file-'+name][0].clearFiles()
						uni.showToast({
							title: res.message,
							icon: 'error'
						})
					}
				})
			},
			//删除图片
			deleteFile(e, name){
				this.dataForm[name] = null
			},
			//选择图片后触发
			selectFiles(e, name){
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
						if(!this.dataForm[name]){
							this.dataForm[name] = [res.data.download_path]
						}else{
							this.dataForm[name].push(res.data.download_path)
						}
					}else{
						uni.showToast({
							title: res.message,
							icon: 'error'
						})
					}
				})
			},
			//删除图片
			deleteFiles(e, name){
				for(let i=0;i<this.dataForm[name].length;i++){
					if(this.dataForm[name][i] === e.tempFilePath){
						this.dataForm[name].splice(i, 1)
						break;
					}
				}
			},
		}
	}
</script>

<style>

</style>
