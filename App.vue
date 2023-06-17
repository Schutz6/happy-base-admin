<script>
	import { getUser, getParams, getMenus } from '@/utils/auth'
	import datas from '@/utils/datas'
	export default {
		onLaunch: async function() {
			console.log('App Launch')
			//初始菜单数据
			this.$store.commit('setMenus', getMenus())
			//初始化静态数据
			this.$store.commit('setDatas', datas)
			//初始化用户信息
			this.$store.commit('setUser', getUser())
			//初始化网站设置信息
			this.$store.commit('setParams', getParams())
			
			//异步请求参数
			let resParam = await this.$api.getAsync("/param/getList/")
			if(resParam && resParam.code == 20000){
				this.$store.commit('setParams', resParam.data)
			}
			//异步请求菜单
			let resMenu = await this.$api.getAsync("/menu/getList/")
			if(resMenu && resMenu.code == 20000){
				this.$store.commit('setMenus', resMenu.data)
			}
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
	uni-main{
		width: 0;
		flex: 1;
	}
	.scroll-view-box {
		height: calc(100vh - 44px);
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
