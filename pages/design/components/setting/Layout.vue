<template>
	<view>
		<uni-section title="行属性" type="line"></uni-section>
		<view class="d-flex">
			<view>Gutter：</view>
			<view style="width: 200px;">
				<slider :value="moduleSetting.gutter" @change="updateSlider($event, 'gutter')"
					:show-value="true" :step="1" :min="0" :max="24" :block-size="16" />
			</view>
		</view>
		<uni-section title="列属性" type="line"></uni-section>
		<view class="d-flex">
			<view>Span：</view>
			<view style="width: 200px;">
				<slider :value="moduleSetting.span" @change="updateSlider($event, 'span')"
					:show-value="true" :step="1" :min="0" :max="24" :block-size="16" />
			</view>
		</view>
		<view class="d-flex">
			<view>Offset：</view>
			<view style="width: 200px;">
				<slider :value="moduleSetting.offset" @change="updateSlider($event, 'offset')"
					:show-value="true" :step="1" :min="0" :max="24" :block-size="16" />
			</view>
		</view>
		<view class="d-flex">
			<view>Push：</view>
			<view style="width: 200px;">
				<slider :value="moduleSetting.push" @change="updateSlider($event, 'push')"
					:show-value="true" :step="1" :min="0" :max="24" :block-size="16" />
			</view>
		</view>
		<view class="d-flex">
			<view>Pull：</view>
			<view style="width: 200px;">
				<slider :value="moduleSetting.pull" @change="updateSlider($event, 'pull')"
					:show-value="true" :step="1" :min="0" :max="24" :block-size="16" />
			</view>
		</view>
		<view class="d-flex">
			<view>Xs：</view>
			<view style="width: 200px;">
				<slider :value="moduleSetting.xs" @change="updateSlider($event, 'xs')"
					:show-value="true" :step="1" :min="0" :max="24" :block-size="16" />
			</view>
		</view>
		<view class="d-flex">
			<view>Sm：</view>
			<view style="width: 200px;">
				<slider :value="moduleSetting.sm" @change="updateSlider($event, 'sm')"
					:show-value="true" :step="1" :min="0" :max="24" :block-size="16" />
			</view>
		</view>
		<view class="d-flex">
			<view>Md：</view>
			<view style="width: 200px;">
				<slider :value="moduleSetting.md" @change="updateSlider($event, 'md')"
					:show-value="true" :step="1" :min="0" :max="24" :block-size="16" />
			</view>
		</view>
		<view class="d-flex">
			<view>Lg：</view>
			<view style="width: 200px;">
				<slider :value="moduleSetting.lg" @change="updateSlider($event, 'lg')"
					:show-value="true" :step="1" :min="0" :max="24" :block-size="16" />
			</view>
		</view>
		<view class="d-flex">
			<view>Xl：</view>
			<view style="width: 200px;">
				<slider :value="moduleSetting.xl" @change="updateSlider($event, 'xl')"
					:show-value="true" :step="1" :min="0" :max="24" :block-size="16" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "SettingLayout",
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
			//修改组件Slider值
			updateSlider(e, key) {
				this.$emit('updateModuleValue', {"key": key, "value": e.detail.value})
			}
		}
	}
</script>

<style>
	
</style>