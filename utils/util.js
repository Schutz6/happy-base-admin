/**
 * 返回上级（解决刷新后不返回）
 */
export const navigateBack = function() {
	let pages = getCurrentPages()
	if (pages.length == 1) {
		uni.reLaunch({
			url: '/pages/index/index'
		});
	}else{
		uni.navigateBack()
	}
}

/**
 * 格式化UTC时间戳
 * @param timestamp
 */
export const formatDateUtc = function(timestamp){
  let d = new Date(timestamp)
  let timezone = new Date().getTimezoneOffset() / 60
  let targetDate = new Date(d.getTime() - timezone * 60 * 60 * 1000)
  return targetDate.getTime()
}