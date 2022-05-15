<template>
	<view class="cart">
		<nav-head
			goBack
			goCart
			@handelShowHome="handleShowHome"
			@handleShowMoreGoods="handleShowMoreGoods"
			@handleShowUserInfo="handleShowUserInfo"
		></nav-head>
		
		<view class="cart-pro flex justify-between" v-if="!checkAll && cartList.length > 0">
			<view class="pro-left flex">
				<view class="pro-tag">
					换购
				</view>
				<view class="pro-detail">
					已满足换购条件，可参加优惠换购
				</view>
			</view>
			<view class="to-pro">
				<text style="color: #d65736; font-weight: bold;" @click="toSale">去逛逛</text>
				<text class="cuIcon-right" style="color: #d1d1d1"></text>
			</view>
		</view>

		<view class="cart-item-wrap">
			<u-swipe-action>
				<u-swipe-action-item
					v-for="(item,index) in cartList"
					:key="item.timeStamp"
					:name="index"
					:options="options"
					@click="handleRemoveGood"
				>
					<view class="exchange flex justify-between">
						<view class="ex-left flex">
							<view class="ex-tag">
								换购
							</view>
							<view class="ex-detail">
								已满足换购条件，可换购优惠商品
							</view>
						</view>
						<view class="to-ex">
							<text style="color: #d65736; font-weight: bold;" @click="toSale">去换购</text>
							<text class="cuIcon-right" style="color: #d1d1d1"></text>
						</view>
					</view>
					<view class="cart-item">
						<view class="item-main flex justify-around align-center">
							<view class="check-box">
								<cu-checkbox
									color="#ffe32a"
									:checked="item.isChecked"
									@change="handleChangeSingleBox(index)"
								></cu-checkbox>
							</view>
							<view class="good-info flex justify-between">
								<view class="good-img">
									<image :src="item.img" mode=""></image>
								</view>
								<view class="good-itd flex flex-direction justify-between">
									<view class="title-cn text-cut">
										{{ item.name }}
									</view>
									<view class="title-en text-cut">
										{{ item.french }}
									</view>
									<view class="good-price">
										<text class="fs-24">￥</text>
										<text>{{ item.curSize.pprice }}</text>
									</view>
								</view>
								<view class="good-size">
									<view class="icon-wrap" @click="editGoodInfo(item, index)">
										<u-icon name="edit-pen" size="26" color="#d1d1d1"></u-icon>
									</view>
									<view class="size">
										{{ item.curSize.spec }}
										<text v-if="item.weight !== '0' && item.weight">({{ item.weight }})</text>
										<text style="padding: 0 10rpx;">X</text>
										{{ item.con }}
									</view>
								</view>
							</view>
						</view>
						<view class="pro-info flex justify-between">
							<view class="pro-choice">
								<view class="pro-main flex">
									<view class="title-tag">
										标配
									</view>
									<view class="pro-title">
										5份餐具
									</view>
								</view>
							</view>
							<view class="pro-change">
								<view class="change-text">
									修改优惠
								</view>
							</view>
						</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</view>
			
		<view class="foot-bar flex justify-between">
			<view class="flex">
				<view class="check-all flex align-center">
					<cu-checkbox color="#ffe32a" :checked="checkAll" @change="handleChangeAllBox"></cu-checkbox>
					<text>全选</text>
				</view>
				<view class="count">
					共计：
					<text class="fs-24">￥</text>
					<text class="fs-36">{{ totalPrice ? totalPrice : 0 }}.00</text>
				</view>
			</view>
			<view class="caculate" @click="toOrder">
				立即结算
				<text v-if="totalNum > 0">({{ totalNum }})</text>
			</view>
		</view>
		
		<good-info :itemData="cartItemData" :show="showGoodInfo" @close="closeGoodInfo"></good-info>
		
		<view class="blank text-center margin fs-32" v-if="cartList.length === 0">
			<view>
				——您的购物车还是空的
				<text style="text-decoration: underline #999" @click="toCake">赶快行动吧</text>
				——
			</view>
		</view>
		
		<view class="Additional" v-if="cartList.length > 0">
			<view class="add-title">
				加购配件
			</view>
			<view class="add-item-wrap">
				<good-item
					v-for="(item,index) in addtionalList"
					:key="item.id"
					:data="item"
					@click="showDetail(item.id)"
					@addToCart="addToCart"
				></good-item>
			</view>
		</view>
		
		<view class="recommend" v-if="cartList.length === 0">
			<good-item
				v-for="(item,index) in recomList"
				:key="item.id"
				:data="item"
				@click="showDetail(item.id)"
				@addToCart="addToCart"
			></good-item>
		</view>
		
		<not-login
			:show="showNeedLog"
			@close="closeLoginModal"
			@confirm="handleToLogin"
		></not-login>
	</view>
</template>

<script>
	import { mapState, mapMutations, mapGetters } from 'vuex'
	import { getLocalStorage } from '@/utils/shared.js'
	export default {
		computed: {
			...mapState({
				cartList: state => {
					const list = state.cart.cartList?.map(item => {
						item.timeStamp = Date.now() + Math.random()
						return item
					})
					return list || []
				},
				recomList: state => state.cart.recomList,
				userinfo: state => state.user.userinfo
			}),
			...mapGetters(['checkAll', 'totalPrice', 'totalNum'])
		},
		data() {
			return {
				showGoodInfo: false,
				cartItemData: {},
				options: [
					{
            text: '删除',
						icon: 'trash',
						iconSize: '14',
            style: {
							backgroundColor: '#f0250f',
							fontSize: '28rpx'
            }
          },
				],
				addtionalList: [],
				showNeedLog: false
			}
		},
		onLoad() {
			const userinfo = getLocalStorage('userinfo')
			if(!userinfo) {
				return this.showNeedLog = true
			}
			this.getAddtionalGood()
			this.getCartList()
		},
		watch: {
			'cartList.length'(newVal) {
				this.recomList && this.$store.dispatch('getRecommendsList')
			}
		},
		methods: {
			...mapMutations({
				handleChangeSingleBox: 'changeSingleBox',
				handleChangeAllBox: 'changeAllBox'
			}),
			getCartList() {
				const { objectId } = this.userinfo
				this.$store.dispatch('getCartList', objectId)
			},
			editGoodInfo(item, index) {
				this.showGoodInfo = true
				this.cartItemData = item
				this.cartItemData.cartIndex = index
			},
			closeGoodInfo(val) {
				this.showGoodInfo = val
			},
			toCake() {
				uni.navigateTo({
					url: '../cake/cake'
				})
			},
			handleRemoveGood({ name }) {
				this.$store.commit('removeGood', name)
			},
			showDetail(id) {
				uni.navigateTo({
					url: '../detail/detail?id=' + id
				})
			},
			addToCart(info) {
				info.curSize = JSON.parse(JSON.stringify(info.list[0]))
				info.isChecked = true
				this.cartItemData = info
				this.$set(this.cartItemData, 'con', 1)
				this.showGoodInfo = true
			},
			getAddtionalGood() {
				this.$get('/1.1/classes/goods?where={"bcid": 5}&limit=8&skip=0').then(res => {
					this.addtionalList = res.results
				})
			},
			toSale() {
				uni.navigateTo({
					url: '../sale/sale'
				})
			},
			closeLoginModal(val) {
				this.showNeedLog = val
				uni.navigateBack({
					delta: 1
				})
			},
			handleToLogin() {
				uni.navigateTo({
					url: '../login/login'
				})
			},
			toOrder() {
				uni.navigateTo({
					url: '../order/order'
				})
			},
			handleShowHome() {
				uni.navigateTo({
					url: '../home/home'
				})
			},
			handleShowMoreGoods() {
				uni.navigateTo({
					url: '../cake/cake'
				})
			},
			handleShowUserInfo() {
				uni.navigateTo({
					url: '../userinfo/userinfo'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cart {
		padding-top: 100rpx;
		padding-bottom: 100rpx;
	}
	.nav-head {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
	}
	.foot-bar {
		position: fixed;
		width: 100%;
		height: 100rpx;
		bottom: 0;
		left: 0;
		background-color: #fff;
		z-index: 999;
		line-height: 100rpx;
		padding-left: 20rpx;
		box-shadow: 0 -2rpx 6rpx rgba($color: #000000, $alpha: .3);
		.count {
			padding-left: 20rpx;
			font-size: 36rpx;
			.fs-36 {
				font-weight: bold;
			}
		}
		.caculate {
			padding: 0 40rpx;
			background-color: #ffe32a;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
	
	.cart-pro {
		margin-top: 20rpx;
		height: 44rpx;
		line-height: 44rpx;
		margin-bottom: 20rpx;
		padding: 0 10rpx;
		.pro-tag {
			width: 80rpx;
			border-radius: 22rpx;
			text-align: center;
			background-color: #d65736;
			color: #fff;
		}
		.pro-detail {
			padding-left: 20rpx;
			color: #8d8d8d;
		}
	}
	
	.cart-item-wrap {
		padding: 20rpx;
		width: 100%;
	}
	
	.exchange {
		height: 44rpx;
		line-height: 44rpx;
		margin-bottom: 20rpx;
		.ex-tag {
			width: 80rpx;
			border-radius: 22rpx;
			text-align: center;
			background-color: #d65736;
			color: #fff;
		}
		.ex-detail {
			padding-left: 20rpx;
		}
	}
	
	.cart-item {
		width: 100%;
		
		.item-main {
			.check-box {
				width: 10%;
				padding-right: 16rpx;
			}

			.good-info {
				width: 90%;
				.good-img {
					image {
						width: 180rpx;
						height: 180rpx;
					}
				}
				
				.good-itd {
					padding: 10rpx;
					text-align: center;
					.title-cn,
					.title-en {
						width: 200rpx;
						font-size: 28rpx;
					}
					.title-cn {
						font-weight: bold;
					}
					
					.title-en {
						color: #888;
					}
					
					.good-price {
						font-size: 32rpx;
						font-weight: bold;
					}
				}
				
				.good-size {
					position: relative;
					width: 200rpx;
					.icon-wrap {
						position: absolute;
						width: 52rpx;
						height: 52rpx;
						top: 0;
						right: 0;
						border-radius: 50%;
						background-color: #e8e8e8;
					}
					
					.size {
						position: absolute;
						bottom: 10rpx;
						right: 0;
						text-align: center;
						font-size: 24rpx;
					}
				}
			}
		}
		
		.pro-info {
			margin: 20rpx 0;
			align-items: end;
			
			.pro-choice {
				.pro-main {
					font-size: 28rpx;
					height: 44rpx;
					line-height: 44rpx;
					.title-tag {
						width: 80rpx;
						border-radius: 22rpx;
						text-align: center;
						background-color: #f6f8fa;
					}
					.pro-title {
						padding-left: 20rpx;
					}
				}
			}
			
			.pro-change {
				font-size: 28rpx;
				font-weight: bold;
				line-height: 44rpx;
			}
		}
	}
	
	.blank {
		margin: 20rpx 0;
		color: #999;
	}
	
	.Additional {
		.add-title {
			font-size: 32rpx;
			font-weight: bold;
			padding-left: 20rpx;
		}
		
		.add-item-wrap {
			display: flex;
			overflow: auto;
			transform: scale(.6);
			margin-left: -115px;
			margin-top: -30px;
			margin-right: -115px;
			.good-item {
				margin-left: 10rpx;
			}
		}
	}
	
	.recommend {
		display: flex;
		flex-wrap: wrap;
		padding: 15rpx;
		justify-content: space-between;
	}
</style>
