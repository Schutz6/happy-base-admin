<template>
	<view>
		<view style="width: 450px;">
			<uni-section title="显示文本" type="line"></uni-section>
			<view class="d-flex" style="padding-bottom: 10px;">
				<module-editor :id="'editor-'+moduleSetting.id" :ref="'editor-'+moduleSetting.id"
					:html="moduleSetting.html" @updateEditor="updateEditor"></module-editor>
			</view>
			<uni-section title="数据绑定" type="line"></uni-section>
			<view class="d-flex" style="padding-bottom: 10px;">
				<uni-easyinput v-model="moduleSetting.model" :clearable="false" :trim="true"
					@input="updateInput($event, 'model')"></uni-easyinput>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "SettingRichText",
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
		mounted() {
			
		},
		methods: {
			//修改组件Input值
			updateInput(e, key) {
				this.$emit('updateModuleValue', {"key": key, "value": e})
			},
			//修改富文本框的值
			updateEditor({html}){
				this.$emit('updateModuleValue', {"key": "html", "value": html})
			}
		}
	}
</script>

<style>
	
</style>