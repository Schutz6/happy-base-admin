<template>
	<view class="overflow-hidden width-max height-max">
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
			if(this.params){
				uni.setNavigationBarTitle({
					title: this.params.siteName + " - 启动中"
				})
			}
		},
		computed: {
			...mapGetters(['params', 'menus'])
		},
		methods: {
			 init(){
				//获取用户信息
				this.$store.dispatch('getUserInfo').then(res => {
					if (res.code == 20000) {
						//跳转第一页
						for(let i=0;i<this.menus.length;i++){
							let menu1 = this.menus[i]
							if(menu1.value == "#"){
								let flag = false
								for(let j=0;j<menu1.children.length;j++){
									let menu2 = menu1.children[j]
									if(menu2.value != "#"){
										flag = true
										this.path = menu2.value
										break
									}
								}
								if(flag){
									break
								}
							}else{
								this.path = menu1.value
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
