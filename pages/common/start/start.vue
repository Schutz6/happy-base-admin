<template>
	<view class="container overflow-hidden width-max height-max">
		<view class="d-flex-center height-max">
			<uni-load-more status="loading" :showText="false" />
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				path: null,//默认跳转页面
			}
		},
		onLoad() {
			this.init()
		},
		computed: {
			...mapGetters(['menus'])
		},
		methods: {
			 init(){
				//获取用户信息
				this.$store.dispatch('getUserInfo').then(res => {
					if (res.code == 20000) {
						//跳转第一页
						for(let i=0;i<this.menus.length;i++){
							let menu = this.menus[i]
							if(menu.value == "#"){
								for(let j=0;j<menu.children.length;j++){
									let menu = menu.children[j]
									if(menu.value != "#"){
										flag = true
										this.path = menu.value
										break
									}
								}
								if(flag){
									break
								}
							}else{
								this.path = menu.value
								break
							}
						}
						if(this.path){
							uni.reLaunch({
								url: this.path
							});
						}
					}else{
						uni.reLaunch({
							url: '/pages/common/login/login'
						})
					}
				})
			},
		}
	}
</script>

<style>

</style>
