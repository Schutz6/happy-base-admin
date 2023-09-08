<template>
	<view>
		<text style="display: block;"
			:style="{'width': item.width, 'font-size': item.fontSize, 'color': item.color, 'text-align': item.direction,'font-weight': item.fontWeight}">
			{{item.value || "文本内容"}}
		</text>
	</view>
</template>

<script>
	export default {
		name: "ShowText",
		data() {
			return {
				
			}
		},
		props:{
			item:{
				type: Object,
				required: true
			},
		},
		mounted() {
			
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	
</style>