<template>
		<view class="good-item">
			<view class="img-con">
				<image class="good-img" :src="data.img" mode="widthFix" @tap="handleTap"></image>
			</view>
			<view class="good-info">
				<view class="good-detail flex justify-between align-center">
					<view>
						<view class="good-name text-cut">
							{{ data.name }}
							<text class="tag"> {{ data.tname }} </text>
						</view>
						<view class="name-en">{{ data.french }}</view>
					</view>
					<view class="cart-btn" @click="handleCart">
						<text class="cuIcon-cart"></text>
					</view>
				</view>
				<view class="good-price fs-32">
					<text style="font-size: 24rpx;">￥</text>
					{{ data.price }}
				</view>
			</view>
		</view>
</template>

<script>
	export default {
		name: 'good-item',
		emits: ['click', 'addToCart'],
		props: ['data'],
		methods: {
			handleTap() {
				this.$emit('click')
			},
			handleCart() {
				this.$emit('addToCart', JSON.parse(JSON.stringify(this.data)))
			}
		}
	}
</script>

<style lang="scss" scoped>
	.good-item {
		width: 350rpx;
		image {
			background-color: #f9f9f9;
		}
		
		.good-img {
			border-radius: 10rpx;
		}
		
		.good-info {
			margin: 20rpx 0;
			
			.good-name {
				font-size: 28rpx;
				max-width: 230rpx;
				font-weight: bold;
				
				.tag {
					background-color: #ffe32a;
					font-size: 24rpx;
					margin-left: 20rpx;
				}
			}
			
			.name-en {
				font-size: 24rpx;
				margin: 20rpx 0;
				max-width: 230rpx;
				color: #7f7f7f;
			}
			
			.cart-btn {
				width: 80rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				border-radius: 50%;
				background-color: #ffe32a;
				margin-right: 10rpx;
				
				.cuIcon-cart {
					font-size: 40rpx;
				}
			}
		}
	}
</style>
