export default {
	//用户状态
	user_status_json: [{'value': "1", 'text': '正常'}, {'value': "0", 'text': '禁用'}],
	//用户认证
	user_certified_json: [{'value': "0", 'text': '未认证'}, {'value': "1", 'text': '已认证'}, {'value': "2", 'text': '审核中'}, {'value': "3", 'text': '认证失败'}],
	//任务类型
	task_type_json: [{'value': 3, 'text': '间隔任务'}, {'value': 2, 'text': 'cron任务'}],
	//文件类型
	file_type_json: [{'value': 2, 'text': '图片'}, {'value': 3, 'text': '文件'}, {'value': 4, 'text': '语音'}, {'value': 5, 'text': '视频'}],
	//文件状态
	file_status_json: [{'value': 1, 'text': '临时'}, {'value': 2, 'text': '永存'}],
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
		{'value': 10, 'text': 'Category'},
		{'value': 15, 'text': 'Timestamp'},
		{'value': 16, 'text': 'Date'},
		{'value': 17, 'text': 'Datetime'}
	],
	//布局组件
	layout_json: [
		{
			"type": "Layout",
			"name": "布局组件",
			"gutter": 0,
			"span": 24,
			"offset": 0,
			"push": 0,
			"pull": 0,
			"xs": 0,
			"sm": 0,
			"sm": 0,
			"lg": 0,
			"xl": 0,
			"children": []
		}
	],
	//基础显示组件
	base_show_json: [
		{
			"type": "Table",
			"name": "表格组件"
		},
		{
			"type": "Form",
			"name": "表单组件"
		},
		{
			"type": "Card",
			"name": "卡片组件"
		},
		{
			"type": "Button",
			"name": "按钮组件",
			"value": "按钮",
			"bType": "primary",
			"plain": 0,
			"disabled": 0,
			"size": "default",
			"code": ""
		},
		{
			"type": "Text",
			"name": "文本组件",
			"value": "文本内容",
			"direction": "left",
			"width": "100%",
			"fontSize": "16px",
			"color": "#000000",
			"fontWeight": "normal"
		},
		{
			"type": "RichText",
			"name": "富文本组件",
			"html": "富文本内容",
			"model": ""
		}
	],
	//基础表单组件
	base_form_json: [
		{
			"type": "Input",
			"name": "增强输入框"
		},
		{
			"type": "Checkbox",
			"name": "数据选择器"
		},
		{
			"type": "Slider",
			"name": "滑动选择器"
		},
		{
			"type": "Switch",
			"name": "开关选择器"
		}
	],
	//方向
	direction_json: [
		{'value': "left", 'text': '居左'},
		{'value': "center", 'text': '居中'},
		{'value': "right", 'text': '居右'}
	],
	//粗细
	font_weight_json: [
		{'value': "normal", 'text': '正常'},
		{'value': "bold", 'text': '加粗'}
	],
	//按钮类型
	button_type_json: [
		{'value': "primary", 'text': '主要'},
		{'value': "default", 'text': '默认'},
		{'value': "warn", 'text': '警告'}
	],
	//按钮大小
	button_size_json: [
		{'value': "default", 'text': '默认'},
		{'value': "mini", 'text': '微小'}
	]
}