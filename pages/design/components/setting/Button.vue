<template>
	<view>
		<uni-section title="基础属性" type="line"></uni-section>
		<view class="d-flex" style="padding-bottom: 10px;">
			<view>显示：</view>
			<uni-easyinput type="text" v-model="moduleSetting.value" :clearable="false" :trim="true"
				@input="updateInput($event, 'value')"></uni-easyinput>
		</view>
		<view class="d-flex" style="padding-bottom: 10px;">
			<view>类型：</view>
			<uni-data-checkbox v-model="moduleSetting.bType" :localdata="datas.button_type_json"
				@change="updateCheckbox($event, 'bType')"></uni-data-checkbox>
		</view>
		<view class="d-flex" style="padding-bottom: 10px;">
			<view>镂空：</view>
			<uni-data-checkbox v-model="moduleSetting.plain" :localdata="datas.if_status_json"
				@change="updateCheckbox($event, 'plain')"></uni-data-checkbox>
		</view>
		<view class="d-flex" style="padding-bottom: 10px;">
			<view>禁用：</view>
			<uni-data-checkbox v-model="moduleSetting.disabled" :localdata="datas.if_status_json"
				@change="updateCheckbox($event, 'disabled')"></uni-data-checkbox>
		</view>
		<view class="d-flex" style="padding-bottom: 10px;">
			<view>大小：</view>
			<uni-data-checkbox v-model="moduleSetting.size" :localdata="datas.button_size_json"
				@change="updateCheckbox($event, 'size')"></uni-data-checkbox>
		</view>
		<uni-section title="点击事件" type="line"></uni-section>
		<view class="d-flex" style="padding-bottom: 10px;">
			<uni-easyinput type="textarea" v-model="moduleSetting.code" autoHeight :clearable="false" :trim="true"
				@input="updateInput($event, 'code')"></uni-easyinput>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: "SettingButton",
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