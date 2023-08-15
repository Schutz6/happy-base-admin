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
			
			//获取系统参数
			let resParam = await this.$api.getAsync("/param/getList/")
			if(resParam && resParam.code == 20000){
				this.$store.commit('setParams', resParam.data)
				uni.setNavigationBarTitle({
					title: resParam.siteName
				})
			}
			//获取系统菜单
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
	.container{
		min-height: calc(100vh - 96px);
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
<style lang="scss">
	.uni-popup-dialog{
		width: 300px;
		border-radius: 11px;
		background-color: #fff;
		
		.uni-dialog-title {
		    display: flex;
		    flex-direction: row;
		    justify-content: center;
		    padding-top: 25px;
			
			.uni-popup__info {
			    color: #909399;
			}
			.uni-dialog-title-text {
			    font-size: 16px;
			    font-weight: 500;
			}
		}
		.uni-dialog-content {
		    display: flex;
		    flex-direction: row;
		    justify-content: center;
		    align-items: center;
		    padding: 20px;
			
			.uni-dialog-content-text {
			    font-size: 14px;
			    color: #6C6C6C;
			}
			.uni-dialog-input {
			    flex: 1;
			    font-size: 14px;
			    border: 1px #eee solid;
			    height: 40px;
			    padding: 0 10px;
			    border-radius: 5px;
			    color: #555;
			}
		}
		.uni-dialog-button-group {
		    display: flex;
		    flex-direction: row;
		    border-top-color: #f5f5f5;
		    border-top-style: solid;
		    border-top-width: 1px;
			
			.uni-dialog-button {
			    display: flex;
			    flex: 1;
			    flex-direction: row;
			    justify-content: center;
			    align-items: center;
			    height: 45px;
				cursor: pointer;
			}
			.uni-dialog-button-text {
			    font-size: 16px;
			    color: #333;
			}
			.uni-border-left {
			    border-left-color: #f0f0f0;
			    border-left-style: solid;
			    border-left-width: 1px;
			}
			.uni-button-color {
			    color: #007aff;
			}
		}
		
	}
</style>