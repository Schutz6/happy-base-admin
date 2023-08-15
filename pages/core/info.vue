<template>
	<view class="page">
		<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
			<uni-card :title="'查看 - '+module.name">
				<view style="padding: 10px;">
					<uni-forms ref="form" :modelValue="dataForm" :rules="rules" label-position="top" label-width="120px">
						<uni-row :gutter="60">
							<uni-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" v-for="(table, tableIndex) in module.table_json" :key="tableIndex" v-if="table.edit && table.name != 'orgs'">
								<uni-forms-item :label="table.remarks" :name="table.name" :required="table.must">
									<template v-if="table.type==4">
										<!-- 多字典 -->
										<view class="">
											{{ showDicts(table.key, dataForm[table.name]) }}
										</view>
									</template>
									<template v-else-if="table.type==5">
										<!-- 单字典 -->
										<view class="">
											{{ showDict(table.key, dataForm[table.name]) }}
										</view>
									</template>
									<template v-else-if="table.type==6">
										<!-- 单图片 -->
										<image @click="showImage([dataForm[table.name]], 0)" :src="dataForm[table.name]" mode="aspectFit" class="pointer" style="width: 80px;height: 80px;"></image>
									</template>
									<template v-else-if="table.type==12">
										<!-- 多图片 -->
										<view class="d-flex">
											<view v-for="(pic, picIndex) in dataForm[table.name]" :key="picIndex" style="padding: 0 5px;">
												<image @click="showImage(dataForm[table.name], picIndex)" :src="pic" mode="aspectFit" class="pointer" style="width: 80px;height: 80px;"></image>
											</view>
										</view>
									</template>
									<template v-else-if="table.type==13">
										<!-- 单文件 -->
										<view class="">
											<uni-link :href="dataForm[table.name]" :text="dataForm[table.name]"></uni-link>
										</view>
									</template>
									<template v-else-if="table.type==14">
										<!-- 多文件 -->
										<view class="" v-for="(file, fileIndex) in dataForm[table.name]" :key="fileIndex">
											<uni-link :href="file" :text="file"></uni-link>
										</view>
									</template>
									<template v-else-if="table.type==8">
										<!-- 富文本 -->
										<view class="">
											<rich-text :nodes="dataForm[table.name]"></rich-text>
										</view>
									</template>
									<template v-else-if="table.type==9">
										<!-- 对象选择 -->
										<view v-if="table.name=='uid'">{{ dataForm[table.name] }}</view>
										<view v-else>{{formatObject(table.key, dataForm[table.name])}}</view>
									</template>
									<template v-else-if="table.type==10">
										<!-- 分类选择 -->
										<view>
											{{formatCategory(dataForm[table.name])}}
										</view>
									</template>
									<template v-else-if="table.type==15">
										<view v-if="dataForm[table.name] && !table.edit">
											<uni-dateformat :date="dataForm[table.name] | formatDate"></uni-dateformat>
										</view>
										<view v-else-if="dataForm[table.name] && table.edit">
											<uni-dateformat :date="dataForm[table.name]"></uni-dateformat>
										</view>
										<view v-else>--</view>
									</template>
									<template v-else>
										<!-- 字符串/数字/日期/时间/多文本 -->
										<view class="">
											{{dataForm[table.name]}}
										</view>
									</template>
								</uni-forms-item>
							</uni-col>
						</uni-row>
					</uni-forms>
					<view class="d-flex-center" style="width: 240px;margin: 0 auto;padding-top: 20px;padding-bottom: 20px;">
						<button type="default" @click="back" style="font-size: 14px;width: 100px;">返回</button>
					</view>
				</view>
			</uni-card>
		</scroll-view>
	</view>
</template>

<script>
	import { navigateBack, formatDateUtc, formatToCategory } from '@/utils/util'
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
		filters: {
		    //格式化日期
		    formatDate(time){
		    	return formatDateUtc(time)
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
			})
		},
		methods: {
			//返回
			back(){
				navigateBack()
			},
			//预览图片
			showImage(imgs, index){
				uni.previewImage({"current": index, "urls": imgs})
			},
			//显示对象
			formatObject(name, value){
				if(value){
					let list = this.object[name]
					let names = "--"
					if(!list){
						return names
					}
					for(let i=0;i<list.length;i++){
						if(value == list[i].value){
							names = list[i].text
							break
						}
					}
					return names
				}else{
					return "--"
				}
			},
			//显示分类
			formatCategory(categorys){
				if(categorys){
					let names = []
					for(let i=0;i<categorys.length;i++){
						names.push(categorys[i].text)
					}
					if(names.length>0){
						return names.join("/")
					}else {
						return "--"
					}
				}else{
					return "--"
				}
			},
			//显示字典
			showDict(name, value){
				if(value){
					let list = this.dict[name]
					let names = "--"
					if(!list){
						return names
					}
					for(let i=0;i<list.length;i++){
						if(value == list[i].value){
							names = list[i].text
							break
						}
					}
					return names
				}else{
					return "--"
				}
			},
			//显示字典
			showDicts(name, values){
				if(values){
					let list = this.dict[name]
					let names = []
					if(!list){
						return names
					}
					for(let i=0;i<list.length;i++){
						if(values.includes(list[i].value)){
							names.push(list[i].text)
						}
					}
					if(names.length > 0){
						return names.join(",")
					}else{
						return "--"
					}
				}else{
					return "--"
				}
			},
			
		}
	}
</script>

<style scoped lang="scss">
	.box{
		border: 1px solid rgb(221, 221, 221);
		border-radius: 5px;
		min-height: 35px;
		display: flex;
		align-items: center;
		padding: 0 5px;
	}
</style>