<template>
	<view class="pointer">
		<block v-for="(item,index) in data" :key="index">
			<template v-if="!item.children || !item.children.length">
				<uni-menu-item :index="item">
					<template v-if="item.icon && item.icon!='#'">
						<image :src="require('@/static'+item.icon)" style="width: 16px;height: 16px;" />
					</template>
					<text class="nowrap" :class="{title: item.icon && item.icon!='#'}" :title="item.text">{{item.text}}</text>
				</uni-menu-item>
			</template>
			<uni-sub-menu v-else :index="item">
				<template v-slot:title>
					<template v-if="item.icon && item.icon!='#'">
						<image :src="require('@/static'+item.icon)" style="width: 16px;height: 16px;" />
					</template>
					<text class="nowrap" :class="{title: item.icon && item.icon!='#'}" :title="item.text">{{item.text}}</text>
				</template>
				<uni-menu-sidebar class="item-bg"  :data="item.children" :key="item._id" />
			</uni-sub-menu>
		</block>
	</view>
</template>

<script>
	export default {
		name: 'uniMenuSidebar',
		props: {
			data: {
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {};
		},
		computed: {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.title {
		margin-left: 8px;
	}
</style>
