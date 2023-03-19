<script>
	import { getUser, getParams, getMenus } from '@/utils/auth'
	import datas from '@/utils/datas'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			//初始菜单数据
			this.$store.commit('setMenus', getMenus())
			//初始化静态数据
			this.$store.commit('setDatas', datas)
			//初始化用户信息
			this.$store.commit('setUser', getUser())
			//初始化网站设置信息
			this.$store.commit('setParams', getParams())
			// #ifdef H5
			//获取当前页面参数
			if(location.hash.indexOf('/pages/common/home/home') >- 1){
				//在主界面中 获取参数设置
				this.$store.dispatch('getParams')
				//获取用户信息，防止用户强制刷新
				this.$store.dispatch('getUserInfo').then(res => {
					if (res.code != 20000) {
						uni.reLaunch({
							url: '/pages/common/login/login'
						})
					}else{
						//更新菜单数据
						this.$store.dispatch('getMenus')
					}
				})
			}
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
	.filter-container{
		flex-wrap: wrap;
	}
	.filter-item{
		margin: 5px 15px 10px 0;
	}
	.filter-item:first-child {
		margin-left: 0px;
	}
	.filter-item .uni-file-picker__lists{
		display: none;
	}
	.uni-pagination-box {
		padding: 20px 0 10px 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.tag-view{
		min-width: 50px;
	}
	.select-picker {
	    margin-right: 20px;
		margin-top: 5px;
	}
	.select-picker uni-button uni-text {
	    color: #999;
	}
	uni-button[type="default"][plain] {
	    border-color: #dcdfe6;
	    color: #606266;
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
