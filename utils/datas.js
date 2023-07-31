export default {
	//用户状态
	user_status_json: [{'value': 1, 'text': '正常'}, {'value': 0, 'text': '禁用'}],
	//用户认证
	user_certified_json: [{'value': 0, 'text': '未认证'}, {'value': 1, 'text': '已认证'}, {'value': 2, 'text': '审核中'}, {'value': 3, 'text': '认证失败'}],
	//参数状态
	param_status_json: [{'value': 0, 'text': '公共'}, {'value': 1, 'text': '私有'}],
	//任务类型
	task_type_json: [{'value': 3, 'text': '间隔任务'}, {'value': 2, 'text': 'cron任务'}],
	//文件类型
	file_type_json: [{'value': 2, 'text': '图片'}, {'value': 3, 'text': '文件'}, {'value': 4, 'text': '语音'}, {'value': 5, 'text': '视频'}],
	//文件状态
	file_status_json: [{'value': 1, 'text': '临时'}, {'value': 2, 'text': '永存'}],
	//菜单状态
	menu_status_json: [{'value': 1, 'text': '启用'}, {'value': 0, 'text': '禁用'}],
	//是否状态
	if_status_json: [{'value': 1, 'text': '是'}, {'value': 0, 'text': '否'}],
	//字段类型
	field_type_json: [
		{'value': 1, 'text': 'String'},
		{'value': 2, 'text': 'Int'},
		{'value': 3, 'text': 'Float'},
		{'value': 5, 'text': 'Dict'},
		{'value': 4, 'text': 'List<Dict>'},
		{'value': 6, 'text': 'Image'},
		{'value': 12, 'text': 'List<Image>'},
		{'value': 13, 'text': 'File'},
		{'value': 14, 'text': 'List<File>'},
		{'value': 7, 'text': 'Text'},
		{'value': 8, 'text': 'Html'},
		{'value': 9, 'text': 'Object'},
		{'value': 10, 'text': 'Category'}
	],
}