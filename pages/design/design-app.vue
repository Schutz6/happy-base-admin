<template>
	<view>
		<uni-nav-bar title="页面设计器" :border="false" :fixed="true"></uni-nav-bar>
		<view class="module-box">
			<scroll-view class="scroll-view-box" :scroll-y="true" :scroll-x="false">
				<uni-card margin="0" padding="0" spacing="0">
					<uni-collapse accordion>
						<uni-collapse-item title="页面布局" :open="true">
							<view id="module-layout">
								<view class="module-item">
									<view class="module-name">布局组件</view>
								</view>
								<view class="module-item">
									<view class="module-name">表格组件</view>
								</view>
								<view class="module-item">
									<view class="module-name">表单组件</view>
								</view>
							</view>
						</uni-collapse-item>
						<uni-collapse-item title="基础组件">
							<view id="module-base">
								<view class="module-item">
									<view class="module-name">卡片组件</view>
								</view>
								<view class="module-item">
									<view class="module-name">文本组件</view>
								</view>
								<view class="module-item">
									<view class="module-name">富文本组件</view>
								</view>
							</view>
						</uni-collapse-item>
					</uni-collapse>
				</uni-card>
			</scroll-view>
		</view>
		<!-- 组件设置 -->
		<view class="setting-box">
			<uni-card title="设置信息" margin	="0">
				
			</uni-card>
		</view>
		<!-- 页面显示 -->
		<view id="page-box" class="page-box">
			<!-- <view v-for="(layout, index) in pageJson" :key="layout.id" :id="layout.id" class="layout">
				<template v-if="layout.type == 'Layout'">
					<uni-row class="row">
						<uni-col class="col">
							11
						</uni-col>
					</uni-row>
				</template>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: null,
				drag: false,
				myArray: [
					{ people: 'cn', id: 1, name: 'www.itxst.com' },
					{ people: 'cn', id: 2, name: 'www.baidu.com' },
					{ people: 'cn', id: 3, name: 'www.taobao.com' },
					{ people: 'us', id: 4, name: 'www.google.com' }
				]
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		methods: {
			onStart(e) {
				console.log(e)
				this.drag = true;
			},
			onEnd(e) {
				console.log(e)
				this.drag = false;
			}
		}
	}
</script>

<style scoped lang="scss">
	.module-box{
		position: fixed;
		top: 44px;
		left: 0;
		width: 200px;
		z-index: 100;
		
		.module-item{
			cursor: move;
			padding: 10px;
			margin: 0px 10px 10px 10px;
			border: 1px solid #ddd;
		}
	}
	.setting-box{
		position: fixed;
		top: 44px;
		right: 0;
		width: 260px;
		z-index: 100;
		
	}
	.page-box{
		height: 667px;
		width: 375px;
		margin: 0 auto;
		background: #fff;
		border: 1px solid #ddd;
		
	}
</style>
