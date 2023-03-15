<script>
	import { getUser, getParams } from '@/utils/auth'
	import datas from '@/utils/datas'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			//初始化静态数据
			this.$store.commit('setDatas', datas)
			//初始化用户信息
			this.$store.commit('setUser', getUser())
			//初始化网站设置信息
			this.$store.commit('setParams', getParams())
			// #ifdef H5
			//获取参数设置
			this.$store.dispatch('getParams')
			//获取用户信息，防止用户强制刷新
			this.$store.dispatch('getUserInfo').then(res => {
				if (res.code != 20000) {
					uni.reLaunch({
						url: '/pages/common/login/login'
					});
				}
			})
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url('comm.css');

	page {
		background-color: #edf0f2;
	}
	
	.page {
		height: calc(100vh - 44px);
		flex: 1;
	}
	.scroll-view-box {
		height: calc(100vh - 44px);
	}
	.scroll-iframe-box {
		height: calc(100vh);
	}
	.uni-dialog-button{
		cursor: pointer;
	}

	/*解决页面不能复制问题 */
	view {
		user-select: text;
	}

	/*解决页面没有超出但出现滚动条的问题 */
	.uni-scroll-view-content {
		height: auto !important;
	}
</style>
