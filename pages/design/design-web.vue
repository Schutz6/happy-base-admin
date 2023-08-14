<template>
	<view>
		<uni-nav-bar leftIcon="bars" title="页面设计" :border="false" :fixed="true"></uni-nav-bar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: null,
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
