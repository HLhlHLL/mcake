<template>
	<view class="nav-head fixed-head">
		<view class="cu-bar bg-white">
			<view class="action" v-if="!goBack" @click="$emit('setLocation')">
				<text class="cuIcon-location text-gray"></text> {{ city || '请选择城市' }}
			</view>
			<view class="back" v-else @click="handleGoBack">
				<u-icon name="arrow-left"></u-icon>
			</view>
			<view class="content text-bold">
				MCAKE
			</view>
			<view class="action text-grey" v-if="!simple">
				<view class="action-icon" @click="$emit('clickLeft')">
					<text class="cuIcon-search" v-if="!goCart"></text>
					<view class="cuIcon-cart fs-32" v-else>
						<view class="cart-num" v-if="cartNum > 0">
							{{ cartNum }}
						</view>
					</view>
				</view>
				<u-line direction="column" length="30rpx" margin="0 16rpx 0 26rpx"></u-line>
				<text class="cuIcon-moreandroid" @click="clickRight"></text>
			</view>
		</view>
		
		<view class="more flex align-center" v-if="show">
			<view class="more-home" @click="showHome">
				<text class="icon cuIcon-home"></text>
				首页
			</view>
			<u-line direction="col" length="50rpx"></u-line>
			<view class="more-goods" @click="showMoreGoods">
				<text class="icon cuIcon-shop"></text>
				更多商品
			</view>
			<u-line direction="col" length="50rpx"></u-line>
			<view class="user-info" @click="showUserInfo">
				<text class="icon cuIcon-people"></text>
				个人中心
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"nav-head",
		emits: ['setLocation', 'clickLeft', 'clickRight', 'handleShowMoreGoods', 'handleShowUserInfo'],
		props: {
			goBack: {
				type: Boolean,
				default: false
			},
			goCart: {
				type: Boolean,
				default: false
			},
			simple: {
				type: Boolean,
				default: false
			},
			city: {
				type: String,
				default: ''
			},
			showMore: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			cartNum() {
				return this.$store.state.cart.cartList?.length
			}
		},
		data() {
			return {
				show: false
			}
		},
		onLoad() {
			this.show = this.showMore
		},
		methods: {
			handleGoBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			clickRight() {
				this.show = !this.show
			},
			showMoreGoods() {
				this.show = false
				this.$emit('handleShowMoreGoods')
			},
			showUserInfo() {
				this.show = false
				this.$emit('handleShowUserInfo')
			},
			showHome() {
				this.show = false
				this.$emit('handelShowHome')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-head {
		box-shadow: 0 2rpx 6rpx rgba($color: #000000, $alpha: .3);
	}
	.cu-bar {
				border-bottom: 1px solid #eee;
	}
	.back {
		margin-left: 20rpx;
	}
	.fs-32 {
		position: relative;
		.cart-num {
			position: absolute;
			top: -50%;
			right: -50%;
			width: 30rpx;
			height: 30rpx;
			line-height: 30rpx;
			text-align: center;
			font-size: 24rpx;
			background-color: #ffe32a;
			color: #000;
			border-radius: 50%;
			z-index: 2;
		}
	}
	
	.more {
		position: absolute;
		top: 100rpx;
		left: 0;
		width: 100%;
		z-index: 10;
		height: 60rpx;
		line-height: 60rpx;
		background-color: #fff;
		
		.more-home,
		.more-goods,
		.user-info {
			text-align: center;
			flex: 1;
			color: #888;
		}
		
		.icon {
			padding-right: 10rpx;
		}
	}
</style>
