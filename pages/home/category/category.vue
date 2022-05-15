<template>
	<view class="content flex justify-between align-center">
		<view class="info-left flex justify-between align-center">
			<text class="cuIcon-selection"></text>
			<view class="title">
				<view class="title-cn fs-28">
					{{ titleCn }}
				</view>
				<view class="title-en fs-24">
					{{ titleEn }}
				</view>
			</view>
		</view>
		<view class="info-right">
			<view class="outline">
				{{ outline }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'category',
		props:['titleCn','titleEn','outline']
	}
</script>

<style lang="scss" scoped>
	.content {
		margin: 50rpx 30rpx;
		
		.cuIcon-selection {
			font-size: 60rpx;
			margin-right: 20rpx;
		}
		
		.fs-28 {
			margin-bottom: 10rpx;
		}
	}
	
	.outline {
		font-size: 24rpx;
	}
</style>
