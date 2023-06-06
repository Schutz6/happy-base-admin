<template>
	<view class="container">
		<view class="page-body">
			<view class='wrapper'>
				<view class='toolbar' @tap="format">
					<view :class="formats.bold ? 'ql-active' : ''" class="iconfont icon-zitijiacu" data-name="bold">
					</view>
					<view :class="formats.italic ? 'ql-active' : ''" class="iconfont icon-zitixieti" data-name="italic">
					</view>
					<view :class="formats.underline ? 'ql-active' : ''" class="iconfont icon-zitixiahuaxian"
						data-name="underline"></view>
					<view :class="formats.strike ? 'ql-active' : ''" class="iconfont icon-zitishanchuxian"
						data-name="strike"></view>

					<view :class="formats.align === 'justify' ? 'ql-active' : ''" class="iconfont icon-zuoyouduiqi"
						data-name="align" data-value="justify"></view>
					<view :class="formats.align === 'center' ? 'ql-active' : ''" class="iconfont icon-juzhongduiqi"
						data-name="align" data-value="center"></view>
					<view :class="formats.align === 'right' ? 'ql-active' : ''" class="iconfont icon-youduiqi"
						data-name="align" data-value="right"></view>

					<view :class="formats.list === 'ordered' ? 'ql-active' : ''" class="iconfont icon-youxupailie"
						data-name="list" data-value="ordered"></view>
					<view :class="formats.list === 'bullet' ? 'ql-active' : ''" class="iconfont icon-wuxupailie"
						data-name="list" data-value="bullet"></view>

					<view class="iconfont icon-outdent" data-name="indent" data-value="-1"></view>
					<view class="iconfont icon-indent" data-name="indent" data-value="+1"></view>

					<view class="iconfont icon-text_color" :style="{'color': '#000000'}" @tap.stop="showColor">
						<view v-show="showSetColor" class="sub-view">
							<view class="d-flex-center" style="width: 143px;height: 110px;padding-left: 7px;padding-top: 5px;">
								<!-- <input v-model="color" focus placeholder="color" style="padding: 0 5px;width: 90px;" />
								<view style="width: 50px;font-size: 14px;text-align: center;" @tap.stop="setColor">确定</view> -->
								<uni-row :gutter="10">
									<uni-col :span="3.4" v-for="(item, index) in colorList" :key="index">
										<view class="color-box" :style="{'background-color': item}" @tap.stop="setColor(item)"></view>
									</uni-col>
								</uni-row>
							</view>
						</view>
					</view>

					<view class="iconfont icon-fontbgcolor" :style="{'color': '#000000'}" @tap.stop="showBackgroundColor">
						<view v-show="showSetBackgroundColor" class="sub-view">
							<view class="d-flex-center" style="width: 143px;height: 110px;padding-left: 7px;padding-top: 5px;">
								<!-- <input v-model="backgroundColor" focus placeholder="color" style="padding: 0 5px;width: 90px;" />
								<view style="width: 50px;font-size: 14px;text-align: center;" @tap.stop="setBackgroundColor">确定</view> -->
								<uni-row :gutter="10">
									<uni-col :span="3.4" v-for="(item, index) in colorList" :key="index">
										<view class="color-box" :style="{'background-color': item}" @tap.stop="setBackgroundColor(item)"></view>
									</uni-col>
								</uni-row>
							</view>
						</view>
					</view>

					<view class="iconfont" :class="'icon-format-header-'+header" @tap.stop="showHeader">
						<view v-show="showSetHeader" class="sub-view">
							<view class="d-flex-center flex-column" style="width: 70px;">
								<view class="header" @tap.stop="setHeader(1)"><h1>H1</h1></view>
								<view class="header" @tap.stop="setHeader(2)"><h2>H2</h2></view>
								<view class="header" @tap.stop="setHeader(3)"><h3>H3</h3></view>
								<view class="header" @tap.stop="setHeader(4)"><h4>H4</h4></view>
								<view class="header" @tap.stop="setHeader(5)"><h5>H5</h5></view>
								<view class="header" @tap.stop="setHeader(6)"><h6>H6</h6></view>
							</view>
						</view>
					</view>

					<view class="iconfont icon-clearedformat" @tap="removeFormat"></view>
					<view class="iconfont icon-fengexian" @tap="insertDivider"></view>
					<view class="iconfont icon-charutupian" @tap="insertImage"></view>

				</view>

				<view class="editor-wrapper">
					<editor :id="id" class="ql-container" show-img-size show-img-toolbar show-img-resize
						@statuschange="onStatusChange" @focus="onFocus" :read-only="readOnly" @ready="onEditorReady"
						@input="onInput">
					</editor>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			id: {
				type: String,
				default: 'editor'
			},
			html: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				htmlContent: "",
				readOnly: false,
				formats: {},
				showSetColor: false,
				color: "#000000",
				showSetBackgroundColor: false,
				backgroundColor: "#000000",
				showSetHeader: false,
				header: 1,
				colorList: [
					'#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', 
					'#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff',
					'#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff',
					'#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2',
					'#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'
				]
			}
		},
		mounted() {
			if(this.html){
				this.htmlContent = this.html
			}
		},
		methods: {
			//获取内容
			getHtml(){
				return this.htmlContent
			},
			onInput(){
				this.editorCtx.getContents({
					success: (res)=>{
						this.htmlContent = res.html
					}
				})
			},
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				// #ifdef APP-PLUS || MP-WEIXIN || H5
				uni.createSelectorQuery().select('#'+this.id).context((res) => {
					this.editorCtx = res.context
					
					//初始化
					if(this.html){
						this.editorCtx.setContents({"html": this.html})
					}
				}).exec()
				// #endif
			},
			format(e) {
				let { name, value } = e.target.dataset
				if (!name) return
				this.editorCtx.format(name, value)
			},
			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success')
					}
				})
			},
			insertImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						uni.showLoading({
							title: '正在上传'
						})
						this.$api.uploadFile('/file/upload/', res.tempFilePaths[0]).then(res => {
							uni.hideLoading()
							if(res.code == 20000){
								this.editorCtx.insertImage({
									src: res.data.download_path,
									alt: '图像',
									success: function() {
										console.log('insert image success')
									}
								})
							}else{
								uni.showToast({
									title: "上传失败",
									icon: 'error'
								})
							}
						})
					}
				})
			},
			removeFormat() {
				this.editorCtx.removeFormat()
			},
			onFocus(){
				this.showSetColor = false
				this.showSetBackgroundColor = false
			},
			showColor(){
				this.showSetColor = true
			},
			setColor(color){
				// this.editorCtx.format("color", this.color)
				this.editorCtx.format("color", color)
				this.showSetColor = false
			},
			showBackgroundColor(){
				this.showSetBackgroundColor = true
			},
			setBackgroundColor(color){
				// this.editorCtx.format("backgroundColor", this.backgroundColor)
				this.editorCtx.format("backgroundColor", color)
				this.showSetBackgroundColor = false
			},
			showHeader(){
				this.showSetHeader = true
			},
			setHeader(header){
				this.header = header
				this.editorCtx.format("header", this.header)
				this.showSetHeader = false
			},
		}
	}
</script>

<style>
	@import "./editor-icon.css";

	.page-body {
		/* height: calc(100vh - var(--window-top) - var(--status-bar-height)); */
		border: 1px solid #ddd;
		border-radius: 5px;
	}

	.wrapper {
		height: 100%;
	}

	.editor-wrapper {
		/* height: calc(100vh - var(--window-top) - var(--status-bar-height) - 140px); */
		background: #fff;
	}

	.iconfont {
		display: inline-block;
		padding: 8px 8px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		font-size: 20px;
		position: relative;
		color: #000000;
	}
	
	.sub-view{
		position: absolute;
		left: 0px;
		background-color: #fff;
		border: 1px solid #ddd;
		z-index: 100;
		color: #000;
	}
	.header{
		padding: 5px 0;
	}

	.toolbar {
		box-sizing: border-box;
		border-bottom: 0;
		font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
		border-bottom: 1px solid #ddd;
	}

	.ql-container {
		box-sizing: border-box;
		padding: 12px 15px;
		width: 100%;
		height: 100%;
		font-size: 16px;
		line-height: 1.2;
	}

	.ql-active {
		color: #06c;
	}
	
	.color-box{
		height: 16px;
		width: 16px;
		margin-bottom: 5px;
	}
</style>