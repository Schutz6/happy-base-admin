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
 * 秒转时间
 * @param {Object} seconds
 */
export const formatSeconds = function(seconds){
	let h = parseInt(seconds / 60 / 60 % 24)
	h = h < 10 ? '0' + h : h
	let m = parseInt(seconds / 60 % 60)
	m = m < 10 ? '0' + m : m
	let s = parseInt(seconds % 60)
	s = s < 10 ? '0' + s : s
	if(h > 0) {
		return `${h}:${m}:${s}`
	}else if(m > 0){
		return `${m}:${s}`
	}else if(s > 0){
		return `00:${s}`
	}
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


/**
 * 过滤菜单
 * @param {Object} initMenus
 * @param {Object} project
 */
export const filterMenus = function(initMenus, project){
	let menus = JSON.parse(JSON.stringify(initMenus))
	for(let i=0;i<menus.length;i++){
		let item1 = menus[i]
		if(item1.projects.includes(project)){
			//循环二级菜单
			for(let j=0;j<item1.children.length;j++){
				let item2 = item1.children[j]
				if(item2.projects.includes(project)){
					//循环三级菜单
					for(let k=0;k<item2.children.length;k++){
						let item3 = item2.children[j]
						if(!item3.projects.includes(project)){
							//删除数组
							menus[i].children[j].children.splice(k, 1)
							k--
						}
					}
				}else{
					//删除数组
					menus[i].children.splice(j, 1)
					j--
				}
			}
		}else{
			//删除数组
			menus.splice(i, 1)
			i--
		}
	}
	return menus
}


/**
 * 随机数
 */
export const getRandomNum= function(codeLength) {
	let code = ''
	const random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
	for (let i = 0; i < codeLength; i++) {
		let index = Math.floor(Math.random() * 10)
		code += random[index]
	}
	return code
}