/**
 * 返回上级（解决刷新后不返回）
 */
export const navigateBack = function() {
	let pages = getCurrentPages()
	if (pages.length == 1) {
		uni.reLaunch({
			url: '/'
		});
	} else {
		uni.navigateBack()
	}
}

/**
 * 格式化UTC时间戳
 * @param timestamp
 */
export const formatDateUtc = function(timestamp) {
	let d = new Date(timestamp)
	let timezone = new Date().getTimezoneOffset() / 60
	let targetDate = new Date(d.getTime() - timezone * 60 * 60 * 1000)
	return targetDate.getTime()
}


/**
 * 列表转成Tree
 * @param {Object} list
 */
export const listToTree = function(list) {
	const obj = {}
	list.forEach((item) => {
		let flag = false
		if(item.status == "0"){
			flag = true
		}
		if(!flag){
			obj[item.id] = item
		}
	})
	const parentList = []
	list.forEach((item) => {
		let flag = false
		if(item.status == "0"){
			flag = true
		}
		if(!flag){
			const parent = obj[item.pid]
			if (parent) {
				// * 当前项有父节点
				parent.children = parent.children || []
				item["text"] = item.name
				item["value"] = item.id
				item["show"] = item.show
				parent.children.push(item)
			} else {
				// * 当前项没有父节点 -> 顶层
				item["text"] = item.name
				item["value"] = item.id
				item["show"] = item.show
				parentList.push(item)
			}
		}
	})
	return parentList
}


/**
 * 格式化分类
 */
export const formatToCategory = function(list) {
	const categorys = []
	list.forEach((item) => {
		categorys.push({"text": item["text"], "value": item["value"]})
	})
	return categorys
}