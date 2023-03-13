<script>
	import { getUser, getSetting } from '@/utils/auth'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			//初始化用户信息
			this.$store.commit('setUser', getUser())
			//初始化网站设置信息
			this.$store.commit('setSetting', getSetting())
			// #ifdef H5
			//获取应用设置
			this.$store.dispatch('getAppSetting')
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

	.page {
		height: calc(100vh - 44px);
		flex: 1;
	}
	.scroll-view-box {
		height: calc(100vh - 44px);
	}
	.uni-dialog-button{
		cursor: pointer;
	}
	.uni-select__input-text{
		width: 220px !important;
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
