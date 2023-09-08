<template>
	<view>
		<uni-section title="基础属性" type="line"></uni-section>
		<view class="d-flex" style="padding-bottom: 10px;">
			<view>显示：</view>
			<uni-easyinput type="textarea" v-model="moduleSetting.value" :clearable="false" :trim="true"
				@input="updateInput($event, 'value')"></uni-easyinput>
		</view>
		<view class="d-flex" style="padding-bottom: 10px;">
			<view>方向：</view>
			<uni-data-checkbox v-model="moduleSetting.direction" :localdata="datas.direction_json"
				@change="updateCheckbox($event, 'direction')"></uni-data-checkbox>
		</view>
		<view class="d-flex" style="padding-bottom: 10px;">
			<view>宽度：</view>
			<uni-easyinput v-model="moduleSetting.width" :clearable="false" :trim="true"
				@input="updateInput($event, 'width')"></uni-easyinput>
		</view>
		<view class="d-flex" style="padding-bottom: 10px;">
			<view>大小：</view>
			<uni-easyinput v-model="moduleSetting.fontSize" :clearable="false" :trim="true"
				@input="updateInput($event, 'fontSize')"></uni-easyinput>
		</view>
		<view class="d-flex" style="padding-bottom: 10px;">
			<view>颜色：</view>
			<uni-easyinput v-model="moduleSetting.color" :clearable="false" :trim="true"
				@input="updateInput($event, 'color')"></uni-easyinput>
		</view>
		<view class="d-flex" style="padding-bottom: 10px;">
			<view>粗细：</view>
			<uni-data-checkbox v-model="moduleSetting.fontWeight" :localdata="datas.font_weight_json"
				@change="updateCheckbox($event, 'fontWeight')"></uni-data-checkbox>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: "SettingText",
		data() {
			return {
				
			}
		},
		props:{
			moduleSetting:{
				type: Object,
				required: true
			},
		},
		computed: {
			...mapGetters(['datas'])
		},
		mounted() {
			
		},
		methods: {
			//修改组件Input值
			updateInput(e, key) {
				this.$emit('updateModuleValue', {"key": key, "value": e})
			},
			//修改组件Checkbox值
			updateCheckbox(e, key) {
				this.$emit('updateModuleValue', {"key": key, "value": e.detail.value})
			}
		}
	}
</script>

<style>
	
</style>