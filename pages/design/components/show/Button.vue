<template>
	<view>
		<button :type="item.bType" :size="item.size" :plain="item.plain==1?true:false"
			:disabled="item.disabled==1?true:false" @click="evalCode(item.code)">{{item.value || "按钮"}}</button>
	</view>
</template>

<script>
	export default {
		name: "ShowButton",
		data() {
			return {

			}
		},
		props: {
			item: {
				type: Object,
				required: true
			},
		},
		mounted() {

		},
		methods: {
			//执行代码
			evalCode(code){
				if(code){
					eval(code)
				}
			}
		}
	}
</script>

<style scoped lang="scss">

</style>