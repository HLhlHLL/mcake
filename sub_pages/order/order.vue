<template>
	<view class="order">
		<nav-head
			goBack
			goCart
			@clickLeft="openCart"
			@handelShowHome="handleShowHome"
			@handleShowMoreGoods="handleShowMoreGoods"
			@handleShowUserInfo="handleShowUserInfo"
		></nav-head>
		
		<view class="order-main">
			<view
				class="address-no flex justify-between align-center"
				@click="toAddAddress"
			>
				<view class="desc" v-if="!order.curAddress.username">
					请添加地址
				</view>
				<view class="address" v-else>
					<view class="user-info">
						{{ username }}, {{ phone }}
					</view>
					<view class="add-info">
						{{ city }}
						{{ region }}
						{{ detail }}
					</view>
				</view>
				<view class="cuIcon-right"></view>
			</view>
			
			<view class="order-detail">
				<view class="title flex justify-between">
					<view class="time">
						<text class="icon cuIcon-time"></text>
						配送时间
					</view>
					<view class="add">
						请选择配送地址
					</view>
				</view>
				<view
					class="order-good flex justify-between"
					v-for="(cart,index) in cartList"
					:key="index"
				>
					<view class="img">
						<image :src="cart.img" mode="widthFix"></image>
					</view>
					<view class="good-idt">
						<view class="title-cn">
							{{ cart.name }}
						</view>
						<view class="title-en">
							{{ cart.french }}
						</view>
						<view class="size">
							{{ cart.spec }} X {{ cart.con }}
						</view>
						<view class="idt-pri">
							￥ {{ cart.pprice }}
						</view>
					</view>
				</view>
			</view>
			
			<view class="paycard flex justify-between item">
				<view class="card-tp">
					<text class="icon cuIcon-card"></text>
					现金/储蓄卡/小食卡
				</view>
				<view class="card-sta">
					无可用
					<text class="cuIcon-more"></text>
				</view>
			</view>
			
			<view class="discount flex justify-between item">
				<view class="dis-tp">
					<text class="icon cuIcon-redpacket"></text>
					优惠券/红包
				</view>
				<view class="dis-sta">
					无可用
					<text class="cuIcon-more"></text>
				</view>
			</view>
			
			<view class="balance flex justify-between item">
				<view class="bal-tp">
					<text class="icon cuIcon-recharge"></text>
					余额
				</view>
				<view class="bal-sta">
					无可用
				</view>
			</view>
			
			<view class="points flex justify-between align-center item">
				<view class="po-tp">
					<text class="icon cuIcon-coin"></text>
					积分(100个可用)
				</view>
				<cu-checkbox circle color="#ffe32a"></cu-checkbox>
			</view>
			
			<view class="bill flex justify-between item">
				<view class="bill-tp">
					<text class="icon cuIcon-form"></text>
					发票
				</view>
				<view class="bill-sta">
					不开发票
					<text class="cuIcon-more"></text>
				</view>
			</view>
			
			<view class="pay">
				<view class=" flex justify-between">
					<view class="pay-tp">
						<text class="icon cuIcon-pay"></text>
						支付方式
					</view>
					<view class="pay-sta">
						{{ payment ? payment : '请选择'}}
						<text class="cuIcon-more"></text>
					</view>
				</view>

				<view class="pay-sel">
					<view class="sel-item-wrap flex justify-between align-center">
						<view class="sel-item flex align-center">
							<u-icon name="weixin-circle-fill" color="#42b035" size="30"></u-icon>
							<text style="padding-left: 10rpx;">微信</text>
						</view>
						<cu-checkbox
							circle
							color="#ffe32a"
							:checked="wxChecked"
							@change="wxCheck"
						></cu-checkbox>
					</view>	
					<view class="sel-item-wrap flex justify-between align-center">
						<view class="sel-item flex align-center">
							<u-icon name="zhifubao-circle-fill" color="#01a9ed" size="30"></u-icon>
							<text style="padding-left: 10rpx;">支付宝</text>
						</view>
						<cu-checkbox
							circle
							color="#ffe32a"
							:checked="zfbChecked"
							@change="zfbCheck"
						></cu-checkbox>
					</view>	
					<view class="pay-more">
						<text class="text-more" @click="handleShowPicker">更多支付方式</text>
						<text class="cuIcon-more"></text>
					</view>
				</view>
			</view>
			
			<view class="price flex justify-between">
				<view class="pri-tp">
					商品金额
				</view>
				<view class="pri-to">
					￥ {{ totalPrice }}
				</view>
			</view>
			
			<view class="footer-bar flex justify-between">
				<view class="total-price">
					<text style="font-size: 28rpx;">￥</text>
					<text style="font-size: 60rpx; padding-left: 10rpx;">{{ totalPrice }}</text>
				</view>
				<view class="pay-now">
					提交订单
				</view>
			</view>
			
			<u-picker
				:show="showPicker"
				:columns="columns"
				@close="handleClosePic"
				@confirm="handleConfirmPic"
			></u-picker>
			
		</view>
	</view>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	export default {
		computed: {
			...mapState({
				cartList: state => state.cart.cartList.filter(item => item.isChecked),
				order: state => state.order.orderData,
				userinfo: state => state.user.userinfo
			}),
			...mapGetters(['totalPrice', 'username', 'phone', 'city', 'region', 'detail'])
		},
		data() {
			return {
				wxChecked: false,
				zfbChecked: false,
				payment: '',
				columns: [
					['银联', '工商银行', '建设银行', '中国银行']
				],
				showPicker: false
			}
		},
		onLoad() {
			if(!this.username) {
				this.$store.dispatch('getAddressList', this.userinfo.objectId)
			}
		},
		methods: {
			toAddAddress() {
				uni.navigateTo({
					url: '/sub_pages/address/address'
				})
			},
			wxCheck(val) {
				this.wxChecked = val
				this.payment = '微信'
				if(this.zfbChecked) {
					this.zfbChecked = false
				}
			},
			zfbCheck(val) {
				this.zfbChecked = val
				this.payment = '支付宝'
				if(this.wxChecked) {
					this.wxChecked = false
				}
			},
			handleShowPicker() {
				this.showPicker = true
			},
			handleClosePic() {
				this.showPicker = false
			},
			handleConfirmPic(val) {
				this.payment = val.value[0]
				this.showPicker = false
				this.wxChecked = false
				this.zfbChecked = false
			},
			handleShowHome() {
				uni.navigateTo({
					url: '/pages/home/home'
				})
			},
			handleShowMoreGoods() {
				uni.navigateTo({
					url: '/sub_pages/cake/cake'
				})
			},
			handleShowUserInfo() {
				uni.navigateTo({
					url: '/sub_pages/userinfo/userinfo'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order {
		padding: 120rpx 30rpx 140rpx;
	}
	
	.order-main {
		font-weight: bold;
		
		.icon {
			font-size: 40rpx;
			font-weight: normal;
			padding-right: 10rpx;
			color: #888888;
			vertical-align: middle;
		}
	}
	
	.footer-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 120rpx;
		line-height: 120rpx;
		z-index: 999;
		background-color: #fff;
		box-shadow: 0 -2rpx 6rpx rgba($color: #000000, $alpha: .3);
		
		.total-price {
			padding-left: 20rpx;
		}
		
		.pay-now {
			padding: 0 40rpx;
			font-size: 32rpx;
			background-color: #ffe32a;
		}
	}
	
	.item {
		height: 96rpx;
		line-height: 96rpx;
		border-bottom: 1px dashed #e9e9e9;
	}
	
	.cuIcon-more {
		padding-left: 20rpx;
		color: #8c8c8c;
	}
	
	.address-no {
		padding: 30rpx 0;
		font-size: 32rpx;
		font-weight: normal;
		color: #acacac;
		border-top: 1px solid #e9e9e9;
		border-bottom: 1px dashed #e9e9e9;
		
		.address {
			.user-info {
				padding-bottom: 20rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #000000;
			}
			.add-info {
				font-size: 28rpx;
			}
		}
		
		.cuIcon-right {
			font-size: 40rpx;
		}
	}
	
	.order-detail {
		.title {
			height: 96rpx;
			line-height: 96rpx;
			font-size: 26rpx;
		}
		
		.order-good {
			height: 250rpx;
			padding: 10rpx;
			margin-bottom: 20rpx;
			border: 1px solid #e9e9e9;
			border-radius: 10rpx;
			
			.img {
				width: 224rpx;
				height: 224rpx;
				background-color: #eee;
				border-radius: 10rpx;
			}
			.good-idt {
				flex: auto;
				padding-left: 40rpx;
				.title-en {
					padding-top: 10rpx;
					font-size: 24rpx;
					font-weight: normal;
					color: #848484;
				}
				
				.size {
					padding-top: 10rpx;
					font-weight: normal;
				}
				
				.idt-pri {
					padding-top: 20rpx;
				}
			}
		}
	}
	
	.pay {
		padding: 20rpx 0;
		border-bottom: 1px solid #e9e9e9;
		
		.sel-item-wrap {
			padding: 20rpx 0;
		}
		
		.pay-more {
			padding-top: 20rpx;
			text-align: right;
			
			.text-more {
				text-decoration: underline;
			}
		}
	}
	
	.price {
		padding: 35rpx 0;
		border-bottom: 1px solid #e9e9e9;
		
	}
	
	.total-price {
		font-weight: normal;
		color: #ff0000;
	}
	
</style>
