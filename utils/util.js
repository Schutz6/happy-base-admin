/**
 * 返回上级（解决刷新后不返回）
 */
export const navigateBack= function() {
	let pages = getCurrentPages()
	if (pages.length == 1) {
		uni.reLaunch({
			url: '/pages/index/index'
		});
	}else{
		uni.navigateBack()
	}
}