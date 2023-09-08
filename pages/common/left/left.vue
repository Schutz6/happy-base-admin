<template>
	<view>
		<view class="left-menus" v-if="showMenus">
			<scroll-view class="sidebar" scroll-y="true">
				<uni-data-menu v-if="menus" :value="activeUrl" :staticMenu="menus" :unique-opened="true" active-text-color="#409eff" @select="select"></uni-data-menu>
			</scroll-view>
		</view>
		<uni-drawer ref="leftMenus" mode="left" :width="180">
			<scroll-view class="sidebar-full" scroll-y="true">
				<uni-data-menu v-if="menus" :value="activeUrl" :staticMenu="menus" :unique-opened="true" active-text-color="#409eff" @select="select"></uni-data-menu>
			</scroll-view>
		</uni-drawer>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				showMenus: false,//显示菜单
				activeUrl: null,//当前地址
			}
		},
		computed: {
			...mapGetters(['params', 'project', 'initMenus', 'menus'])
		},
		watch: {
			$route(to, form){
				//判断是否存在队列
				let flag = false
				for(let i=0;i<this.menus.length;i++){
					let menu1 = this.menus[i]
					if(menu1.value == "#"){
						for(let j=0;j<menu1.children.length;j++){
							let menu2 = menu1.children[j]
							if(menu2.value == to.fullPath){
								flag = true
								break
							}
						}
						if(flag){
							break
						}
					}else{
						if(menu1.value == to.fullPath){
							flag = true
							break
						}
					}
				}
				if(flag){
					this.activeUrl = to.fullPath
				}
				if(this.params){
					uni.setNavigationBarTitle({
						title: this.params.siteName
					})
				}
			}
		},
		mounted() {
			//获取当前地址
			let route = location.hash.replace("#", "")
			if(route != "/" || route != "/pages/common/login/login"){
				this.activeUrl = route
			}
			//获取页面大小
			uni.getSystemInfo({
				success: (res)=> {
					if(res.windowWidth >= 768){
						this.showMenus = true
					}
				}
			})
			//监听页面大小
			uni.onWindowResize((res) => {
				if(res.size.windowWidth >= 768){
					this.showMenus = true
					uni.setLeftWindowStyle({
						width: '180px'
					})
				}else{
					this.showMenus = false
				}
			})
			//监听方法
			uni.$on('showLeftMenus', this.showLeftMenus)
		},
		destroyed() {
			//移除监听
			uni.$off('showLeftMenus', this.showLeftMenus)
		},
		methods: {
			//点击菜单
			select(e) {
				if(e.value.indexOf('http') === 0){
					//打开新窗口
					return window.open(e.value)
				}else{
					//跳转页面
					uni.redirectTo({
						url: e.value
					})
				}
				if(!this.showMenus){
					//关闭弹框
					this.$refs["leftMenus"].close()
				}
			},
			//显示菜单
			showLeftMenus(){
				uni.setLeftWindowStyle({
				    display: 'block'
				})
				this.$refs["leftMenus"].open()
			},
		}
	}
</script>

<style scoped lang="scss">
	.sidebar {
		width: 180px;
		height: calc(100vh - 44px);
		box-sizing: border-box;
	}
	.sidebar-full{
		width: 180px;
		height: calc(100vh);
		box-sizing: border-box;
	}
	/* #ifdef H5 */
	.sidebar ::-webkit-scrollbar {
		display: none;
	}
	/* #endif */
	.left-menus{
		width: 180px;
		height: calc(100vh - 44px);
		// box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.08);
		background-color: #fff;
	}
</style>