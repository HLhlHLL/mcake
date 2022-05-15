<template>
	<view class="container">
		<nav-head
			:city="city.city"
			@setLocation="setLocation"
			@handelShowHome="handleShowHome"
			@handleShowMoreGoods="handleShowMoreGoods"
			@handleShowUserInfo="handleShowUserInfo"
		></nav-head>
		
		<view class="good-con">
			<good-item
				v-for="(item, _index) in goodsList"
				:key="item.id"
				:data="item"
				@click="showDetail(item.id)"
				@addToCart="editGoodInfo"
			></good-item>
		</view>
		
		<view class="tab-bar flex justify-around align-center text-center">
			<view
				class="tab-item flex justify-around align-center"
				v-for="(item,index) in tabData"
				:key="item.bcid"
				@click="toggleTab(item)"
			>
				{{ item.text }}
				<view class="cart-num" v-if="cartNum > 0 && item.bcid === -1">
					{{ cartNum }}
				</view>
				<u-line direction="column" length="30rpx" color="#7f7f7f" v-if="index !== tabData.length - 1"></u-line>
			</view>
		</view>
		
		<u-popup mode="left" :show="showPop" @close="handleClose">
			<view class="pop-con">
					<view class="menu-con" v-for="(item,_index) in menuData" :key="item.bid">
						<view class="menu-title fs-32 flex align-center" @click="toggleTab({bcid: item.bid})">
							{{ item.bname }}
							<view class="goods-num fs-28">
								{{ item.num }}
							</view>
						</view>
						<view class="sub-menu" v-if="_index === 0">
							<view class="menu-list">
								<view class="sub-menu-title fs-30 flex justify-start" @click="showList = !showList">
									口味筛选
									<u-icon :name="showList ? 'arrow-down' : 'arrow-up'"></u-icon>
								</view>
								<u-cell-group v-if="showList" :border="false">
									<u-cell
										v-for="(child,index) in item.list"
										isLink
										:key="child.tid"
										:title="child.tname"
										@click="handleFilter(child, 1)"
									></u-cell>
								</u-cell-group>
							</view>
							<view class="menu-scene">
								<view class="sub-menu-title fs-30 flex justify-start" @click="showScene = !showScene">
									场景筛选
									<u-icon :name="showScene ? 'arrow-down' : 'arrow-up'"></u-icon>
								</view>
								<u-cell-group v-if="showScene" :border="false">
									<u-cell
										v-for="(child,index) in item.scene"
										isLink
										:key="child.tid"
										:title="child.tname"
										@click="handleFilter(child, 2)"
									></u-cell>
								</u-cell-group>
							</view>
						</view>
					</view>
			</view>
		</u-popup>
		
		<good-info
			:itemData="cartItemData"
			:show="showGoodInfo"
			@close="closeGoodInfo"
		></good-info>
		
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
				queryinfo: state => state.condition.queryinfo,
				userinfo: state => state.user.userinfo,
				city: state => state.city.cityinfo
			}),
			cartNum() {
				return this.$store.state.cart.cartList?.length
			}
		},
		data() {
			return {
				goodsList: [],
				page: 0,
				limit: 8,
				showPop: false,
				menuData: [],
				showList: false,
				showScene: false,
				showBlank: false,
				showGoodInfo: false,
				cartItemData: {},
				tabData: [{
						text: '分类',
						bcid: 0
					},
					{
						text: '蛋糕',
						bcid: 1
					},
					{
						text: '面包',
						bcid: 11
					},
					{
						text: '小食',
						bcid: 6
					},
					{
						text: '配件',
						bcid: 5
					},
					{
						text: '购物车',
						bcid: -1
					}
				],
				showNeedLog: false
			}
		},
		onLoad() {
			this.loadData()
			this.$get('/1.1/classes/classify').then(res => {
				const { results } = res
				this.menuData = results
			})
		},
		onReachBottom() {
			this.loadData()
		},
		onPullDownRefresh() {
			this.reloadData()
			this.showBlank = false
		},
		methods: {
			showDetail(id) {
				uni.navigateTo({
					url: '../detail/detail?id=' + id
				})
			},
			loadData() {
				const skip = this.page * this.limit
				const wh = JSON.stringify(this.queryinfo)
				const url = `/1.1/classes/goods?where=${wh}&limit=${this.limit}&skip=${skip}`
				this.$get(url).then(res => {
					uni.stopPullDownRefresh()
					const { results } = res
					if (results.length === 0) {
						if(this.showBlank) {
							return
						}
						else {
							this.showBlank = true
							return uni.showToast({
								title: '没有更多商品！',
								icon: 'none'
							})
						}
					}
					this.goodsList = [...this.goodsList, ...results]
					this.page++
				})
			},
			reloadData() {
				this.goodsList = []
				this.page = 0
				this.loadData()
			},
			toggleTab(item) {
				const { bcid } = item
				if(bcid === 0) {
					this.showPop = true
				} else if(bcid > 0) {
					this.$store.commit('changeCondition', {
						bcid
					})
					this.reloadData()
				} else if(bcid === -1) {
					uni.navigateTo({
						url: '../cart/cart'
					})
				}
			},
			handleClose() {
				this.showPop = false
			},
			handleFilter({bid, tid}, type) {
				const obj = { bcid: bid }
				type === 1 ? obj.fid = tid : obj.sid = tid
				this.$store.commit('changeCondition', obj)
				this.reloadData()
			},
			editGoodInfo(info) {
				if(!this.userinfo.objectId) {
					return this.showNeedLog = true
				}
				info.curSize = JSON.parse(JSON.stringify(info.list[0]))
				info.isChecked = true
				this.cartItemData = info
				this.$set(this.cartItemData, 'con', 1)
				this.showGoodInfo = true
			},
			closeGoodInfo(val) {
				this.showGoodInfo = val
			},
			closeLoginModal(val) {
				this.showNeedLog = val
			},
			handleToLogin() {
				uni.navigateTo({
					url: '/sub_pages/login/login'
				})
			},
			setLocation() {
				uni.navigateTo({
					url: '/sub_pages/location/location'
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
	.container {
		padding: 100rpx 0 100rpx;

		.good-con {
			display: flex;
			flex-wrap: wrap;
			padding: 15rpx;
			justify-content: space-between;
		}

		.tab-bar {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100rpx;
			padding: 0 20rpx;
			background-color: #fff;
			box-shadow: 0 -2rpx 6rpx rgba($color: #000000, $alpha: .3);

			.tab-item {
				position: relative;
				width: 20%;
				
				.cart-num {
					position: absolute;
					top: -10rpx;
					right: -10rpx;
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					background-color: #ffe32a;
					z-index: 3;
				}
			}
		}
		
		.pop-con {
			width: 360rpx;
			padding: 100rpx 20rpx;
			overflow: scroll;
			
			.menu-title {
				padding: 0 20rpx;
				height: 100rpx;
				line-height: 100rpx;
				border-bottom: 1px solid #d0d0d0;
				
				.goods-num {
					width: 38rpx;
					height: 38rpx;
					line-height: 38rpx;
					margin-left: 20rpx;
					text-align: center;
					border-radius: 50%;
					background-color: #ffe32a;
				}
			}
			
			.u-cell {
				font-size: 28rpx;
			}
						
			.sub-menu-title {
				padding: 30rpx 20rpx;
				border-bottom: 1px dotted #d0d0d0;
				.u-icon {
					margin-left: 40rpx;
				}
			}
		}
		
		.blank {
			margin: 20rpx 0;
			color: #999;
		}
	}
</style>
