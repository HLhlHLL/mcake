<template>
	<view class="sale">	
		<nav-head
			goBack
			goCart
			:cartNum="cartNum"
			@clickLeft="toCart"
			@handelShowHome="handleShowHome"
			@handleShowMoreGoods="handleShowMoreGoods"
			@handleShowUserInfo="handleShowUserInfo"
		></nav-head>
		<view class="sale-title text-center">
			<text class="text-center">买蛋糕可至购物车参加优惠换购</text>
		</view>
		<view class="good-item-wrap">
			<view
				class="good-item flex"
				v-for="(item,index) in saleList"
				:key="item.id"
			>
				<view class="good-img">
					<image :src="item.img" mode="widthFix"></image>
				</view>
				<view class="good-detail">
					<view class="title">
						<view class="title-cn">
							{{ item.name }}
						</view>
						<view class="title-en">
							{{ item.french }}
						</view>
						<view class="extra">
							{{ item.ahead }}
						</view>
					</view>
					<view class="size">
						<view
							class="selected flex justify-between align-center"
							@click="item.showSel = !item.showSel"
						>
							<view class="">
								{{ item.curSize.spec }}-{{ item.curSize.edible }}
							</view>
							<view class="cuIcon-unfold" style="font-weight: bold;"></view>
						</view>
						<view class="selections" v-if="item.showSel">
							<view
								:class="['sel-item', curOption === index ? 'active' : '']"
								v-for="(sel,index) in item.list"
								:key="index"
								@click="editSize(item, index)"
							>
								{{ sel.spec }}-{{ sel.edible }}
							</view>
						</view>
					</view>
					<view class="price flex justify-between align-center">
						<view class="">
							<text class="fs-24">￥</text>
							<text style="font-size: 32rpx; font-weight: bold; padding-left: 6rpx;">
								{{ item.curSize.pprice }}
							</text>
						</view>
						<view class="cart-btn" @click="handleCart(item)">
							<text class="cuIcon-cart"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
	
		<view class="footer-bar flex justify-between align-center">
			<view class="footer-left">
				<view class="sub-total">
					小计：
					<text class="sub-price">￥ {{ subTotal }}.00</text>
				</view>
				<view class="hint">
					快去选购商品参加换购活动吧
				</view>
			</view>
			<view class="footer-right">
				<view class="to-cart" @click="toCart">
					去购物车
				</view>
			</view>
		</view>
		
		<view class="blank text-center margin" v-if="showBlank">
			<text class="fs-32">
				——没有更多商品——
			</text>
		</view>
		
		<not-login
			:show="showNeedLog"
			@close="closeLoginModal"
			@confirm="handleToLogin"
		></not-login>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState({
				list: state => state.sale.saleList,
				cartNum: state => state.cart.cartList.length,
				userinfo: state => state.user.userinfo
			}),
			subTotal() {
				return this.subGoodList.reduce((con, cur) => con += parseInt(cur.curSize.pprice), 0)
			}
		},
		data() {
			return {
				curOption: 0,
				subGoodList: [],
				saleList: [],
				page: 0,
				showBlank: false,
				showNeedLog: false
			}
		},
		onLoad() {
			this.loadData(this.page)
		},
		onReachBottom() {
			this.loadData(this.page)
		},
		onPullDownRefresh() {
			this.saleList = []
			this.page = 0
			this.showBlank = false
			this.loadData(this.page)
		},
		methods: {
			loadData(page) {
				this.$store.dispatch('getSaleList', page).then(res => {
					uni.stopPullDownRefresh()
					if(res.status) {
						this.page++
						this.list.forEach(item => {
							item.curSize = item.list[0]
							this.$set(item, 'showSel', false)
							this.$set(item, 'isChecked', true)
							this.$set(item, 'con', 1)
						})
						this.saleList = [...this.saleList, ...this.list]
					} else {
						if(!this.showBlank) {
							this.showBlank = true
							uni.showToast({
								title: '没有更多商品',
								icon: 'none'
							})
						}
					}
				})
			},
			handleCart(item) {
				if(!this.userinfo.objectId) {
					return this.showNeedLog = true
				}
				this.$store.commit('addToCart', item)
				this.subGoodList.push(item)
				uni.showToast({
					title: '添加成功',
					icon: 'none'
				})
			},
			toCart() {
				uni.navigateTo({
					url: '/sub_pages/cart/cart'
				})
			},
			editSize(item, idx) {
				this.curOption = idx
				item.curSize = item.list[idx]
				item.showSel = false
			},
			closeLoginModal(val) {
				this.showNeedLog = val
				uni.navigateBack({
					delta: 1
				})
			},
			handleToLogin() {
				uni.navigateTo({
					url: '/sub_pages/login/login'
				})
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
	.sale {
		width: 100%;
		height: 100%;
		padding-top: 100rpx;
		padding-bottom: 120rpx;
	}
	.nav-head {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
	}
	
	.sale-title {
		margin-top: 10rpx;
		font-size: 28rpx;
		height: 60rpx;
		line-height: 60rpx;
		background-color: #f0f0f0;
	}
	
	.good-item-wrap {
		.good-item {
			padding: 20rpx;
			
			.good-img {
				width: 230rpx;
				height: 230rpx;
				margin-right: 20rpx;
				background-color: #eee;
				border-radius: 10rpx;
			}
			
			.good-detail {
				flex: auto;
				.title-cn {
					font-size: 32rpx;
					font-weight: bold;
				}
				.title-en,
				.extra {
					font-size: 26rpx;
					padding-bottom: 10rpx;
					color: #8d8d8d;
				}
				
				.size {
					position: relative;
					.selected {
						width: 280rpx;
						height: 40rpx;
						padding: 0 20rpx;
						line-height: 40rpx;
						background-color: #f5f5f5;
						font-size: 30rpx;
						color: #666;
					}
					
					.selections {
						position: absolute;
						top: 44rpx;
						left: 0;
						.sel-item {
							width: 280rpx;
							height: 40rpx;
							line-height: 40rpx;
							padding: 0 20rpx;
							font-size: 30rpx;
							background-color: #fff;
							color: #666;
						}
						
						.active {
							background-color: #666;
							color: #fff;
						}
					}
				}
				
				.price {
					padding-top: 10rpx;
					.cart-btn {
						width: 60rpx;
						height: 60rpx;
						line-height: 60rpx;
						text-align: center;
						border-radius: 50%;
						background-color: #ffe32a;
						margin-right: 10rpx;
						
						.cuIcon-cart {
							font-size: 36rpx;
						}
					}
				}
			}
		}
	}
	
	.footer-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 120rpx;
		padding: 0 20rpx;
		background-color: #fff;
		border-top: 2px solid #857a72;
		z-index: 999;
		
		.footer-left {
			.sub-total {
				font-size: 32rpx;
				
				.sub-price {
					font-size: 36rpx;
					font-weight: bolder;
				}
			}
			
			.hint {
				font-size: 24rpx;
			}
		}
		
		.footer-right {
			.to-cart {
				width: 280rpx;
				height: 90rpx;
				line-height: 90rpx;
				font-size: 32rpx;
				text-align: center;
				background-color: #857a72;
				color: #fff;
				border-radius: 10rpx;
			}
		}
	}
	
	.blank {
		margin: 20rpx 0;
		color: #999;
	}
</style>
