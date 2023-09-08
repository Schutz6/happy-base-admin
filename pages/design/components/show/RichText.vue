<template>
	<view>
		<rich-text :nodes="item.html || '富文本内容'"></rich-text>
	</view>
</template>

<script>
	export default {
		name: "ShowRichText",
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