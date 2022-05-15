<template>
	<view class="basic-info">
		<view class="info-item flex justify-between" v-for="(item,index) in basicList" :key="item.gid">
			<view class="title flex">
				<view class="title-en">
					{{ item.french }}
				</view>
				<view class="title-cn">
					{{ item.name }}
				</view>
			</view>
			<view class="content" v-if="index === 0">
				<text class="cuIcon-choiceness" v-for="(itm,index) in item.value" :key="index"></text>
			</view>
			<view class="content" v-else>
				{{ item.value }}
			</view>
		</view>
		
		<view class="maters flex flex-wrap">
			<view class="mater flex align-center" v-for="(mater, index) in maters" :key="mater.name">
				<image :src="baseUrl + mater.img" mode="widthFix"></image>
				<view class="mater-name fs-24">
					{{ mater.name }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'basic-info',
		props: ['data'],
		computed: {
			basicList() {
				return this.data.basic?.list
			},
			baseUrl() {
				return this.data.mater?.url
			},
			maters() {
				return this.data.mater?.list
			}
		}
	}
</script>

<style lang="scss" scoped>
	.basic-info {
		margin-top: 20rpx;
		padding: 0 20rpx;
		
		.info-item {
			margin-bottom: 10rpx;
			.title {
				height: 32rpx;
				line-height: 32rpx;
				font-size: 24rpx;
				color: #888;
				
				.title-en {
					padding-right: 10rpx;
				}
			}
		}
		
		.mater {
			margin: 10rpx 24rpx 10rpx 0;
			image {
				width: 46rpx;
				box-shadow: 0 0 6rpx rgba($color: #000000, $alpha: .5);
			}
			.fs-24 {
				padding-left: 10rpx;
			}
		}
	}
</style>
