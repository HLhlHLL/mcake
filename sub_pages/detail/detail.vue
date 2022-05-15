<template>
	<view class="detail">
		<nav-head
			goBack
			goCart
			@clickLeft="openCart"
			@handelShowHome="handleShowHome"
			@handleShowMoreGoods="handleShowMoreGoods"
			@handleShowUserInfo="handleShowUserInfo"
		></nav-head>
		
		<swiper
			class="banner"
			:indicator-dots="true"
			:autoplay="true"
			:interval="5000"
			circular
		>
			<swiper-item v-for="(item,index) in coverList" :key="item.id">
				<view class="swiper-item">
					<image :src="item"></image>
				</view>
			</swiper-item>
		</swiper>
		
		<view class="main-container">
			<view class="main-title text-center">
				<view class="title-cn">
					{{ detail.name }}
				</view>
				<view class="title-en">
					{{ detail.french }}
				</view>
			</view>
			
			<view class="option-list text-center">
				<view
					:class="['option-item', index === curOption ? 'active' : '']"
					v-for="(option,index) in options"
					:key="option.id"
					:style="{
						width: `${100 / options.length}%`
					}"
					@click="handleSizeChange(index, option)"
				>
					<view class="option-weight">
						{{ option.spec }}
					</view>
					<view class="option-wei fs-32" v-if="option.weight">
						({{ option.weight }})
					</view>
					<view class="option-desc">
						{{ option.edible }}
					</view>
				</view>
			</view>
			
			<view class="price">
				<text class="fs-24">￥</text>
				<text class="num">{{ detail.pprice }}</text>
			</view>
			
			<view class="info">
				<view class="info-item">
					<u-icon name="clock"></u-icon>
					<text style="color: #f2250f">最早2022年05月01日配送</text>
				</view>
				<view class="info-item">
					<u-icon name="clock"></u-icon>
					<text>{{ detail.curSize ? detail.curSize.ahead : '' }}</text>
				</view>
				<view class="info-item">
					<u-icon name="tags"></u-icon>
					<text>{{ detail.curSize ? detail.curSize.size : '' }}</text>
				</view>
			</view>
			
			<view class="basic-tags">
				<u-icon name="tags"></u-icon>
				<view class="tag-item" v-for="(fname,index) in fnames" :key="index">
					{{ fname }}
				</view>
			</view>
			
			<view class="tips flex">
				<u-icon name="error-circle"></u-icon>
				<text style="color: #f2250f; padding-left: 10rpx;">蛋糕若不及时食用，请置于0-10°C冷藏</text>
			</view>
			
			<view class="brief">
				<view class="brief-cn">
					{{ detail.brief }}
				</view>
				<view class="brief-en">
					{{ detail.frenchBrief }}
				</view>
			</view>
			
			<view class="promote">
				<view class="pro-prev flex justify-between">
					<view class="sale-text">
						促销
					</view>
					<view class="main flex align-center">
						<view class="tag">
							{{ promote.tag }}
						</view>
						<view class="sale-desc">
							{{ promote.title }}
						</view>
					</view>
					<view class="pro-detail flex" @click="showPop = true">
						<text>详情</text>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
			
			<u-popup :show="showPop" @close="handleColse">
				<view class="pop-con">
					<view class="pop-title text-center">
						促销
					</view>
					<view class="pop-main flex justify-center align-center">
						<view class="pop-tag">
							{{ promote.tag }}
						</view>
						<u-line direction="column" length="40rpx" margin="0 20rpx"></u-line>
						<view class="pop-desc">
							{{ promote.remark }}
							<text
								class="cuIcon-right"
								style="padding-left: 80rpx; color: #ff715a;"
								@click="toSale"
							></text>
						</view>
					</view>
				</view>
			</u-popup>
			
			<view class="pro-main">
				<view class="tabs flex justify-around">
					<view
						v-for="(tab,index) in tabList"
						:key="tab.id"
						:class="['tab-item', curTab === index ? 'active' : '']"
						@click="handleTab(index)"
					>
						{{ tab.name }}
					</view>
				</view>
				
				<view class="pro-info">
					<basic-info :data="detail" v-if="curTab === 0"></basic-info>
					
					<appraise :twoId="twoId" v-if="curTab === 1"></appraise>
					
					<view class="detail-img" v-if="curTab === 2">
						<image :src="dImg" mode="widthFix"></image>
					</view>
				</view>
			</view>
			
			<view class="btn-group flex justify-around align-center">
				<view class="btn-buy-wrap">
					<button class="btn-buy" @click="buyNow">立即购买</button>
				</view>
				<view class="btn-cart-wrap">
					<button class="btn-cart" @click="addToCart">加入购物车</button>
				</view>
			</view>
		</view>
		
		<not-login
			:show="showNeedLog"
			@close="closeLoginModal"
			@confirm="handleToLogin"
		></not-login>
	</view>
</template>

<script>
	import basicInfo from './basicinfo/basicinfo.vue'
	import appraise from './appraise/appraise.vue'
	import { mapState } from 'vuex'
	export default {
		components: {
			basicInfo,
			appraise
		},
		computed: {
			...mapState({
				userinfo: state => state.user.userinfo
			})
		},
		data() {
			return {
				detail: {},
				coverList: [],
				options: [],
				promote: {},
				tabList: [
					{name: '基本信息', id: 0},
					{name: '商品评价', id: 1},
					{name: '商品详情', id: 2},
				],
				curTab: 0,
				fnames: [],
				twoId: 0,
				dImg: '',
				showPop: false,
				curOption: 0,
				showNeedLog: false
			}
		},
		onLoad({ id }) {
			this.getDetails(id)
			this.getPromote()
		},
		methods: {
			getDetails(id) {
				this.$get(`/1.1/classes/details?where={"id": ${id}}`).then(res => {
					this.detail = res.results ? res.results[0] : {}
					const { pic } = this.detail
					const url = pic?.url
					this.coverList = pic?.list.map(item => url + item.m)
					this.options = this.detail.list
					this.detail.curSize = this.options ? this.options[0] : {}
					this.fnames = this.detail.fname?.split(',')
					this.twoId = this.detail.twoId
					const detailImg = this.detail.details
					this.dImg = detailImg?.match(/\"(.*?)\"/)[1] || ''
				})
			},
			getPromote() {
				this.$get(`/1.1/classes/promote`).then(res => {
					this.promote = res.results[0].data.data[0]
				})
			},
			handleTab(idx) {
				this.curTab = idx
			},
			handleColse() {
				this.showPop = false
			},
			handleSizeChange(idx, option) {
				this.curOption = idx
				this.detail.curSize = option
			},
			addToCart() {
				if(!this.userinfo.objectId) {
					return this.showNeedLog = true
				}
				this.detail.isChecked = true
				this.detail.con = 1
				this.$store.commit('addToCart', JSON.parse(JSON.stringify(this.detail)))
				uni.showToast({
					title: '添加成功',
					icon: 'none'
				})
			},
			openCart() {
				uni.navigateTo({
					url: '/sub_pages/cart/cart'
				})
			},
			toSale() {
				uni.navigateTo({
					url: '/sub_pages/sale/sale'
				})
			},
			buyNow() {
				this.addToCart()
				if(!this.showNeedLog) {
					uni.navigateTo({
						url: '/sub_pages/cart/cart'
					})
				}
			},
			closeLoginModal(val) {
				this.showNeedLog = val
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
	.detail {
		padding-top: 100rpx;
		padding-bottom: 120rpx;
	}
	
	.banner {
		width: 100%;
		height: 750rpx;
		
		.swiper-item {
			height: 100%;
		}
	}
	
	.main-container {
		padding: 15rpx;
		
		.main-title {
			.title-cn {
				margin: 20rpx 0;
				font-size: 50rpx;
			}
			.title-en {
				font-size: 32rpx;
			}
		}
		
		.option-list {
			display: flex;
			margin-top: 40rpx;
			align-items: center;
			border-bottom: 1px solid #f4f4f4;
			color: #888888;
			
			.option-item {
				padding: 20rpx 0;
				
				.option-weight {
					font-size: 32rpx;
				}
				.option-des {
					font-size: 24rpx;
				}
				
			}
			.active {
				background-color: #ffcd20;
				color: #000;
			}
		}
		
		.price {
			padding: 20rpx 0;
			border-bottom: 1px solid #f4f4f4;
			.num {
				padding-left: 10rpx;
				font-size: 50rpx;
			}
		}
		
		.info {
			display: flex;
			flex-wrap: wrap;
			padding-top: 20rpx;
			border-bottom: 1px solid #f4f4f4;
			color: #888888;
			
			.info-item {
				display: flex;
				margin-bottom: 20rpx;
				padding-left: 20rpx;
				text {
					padding-left: 8rpx;
				}
			}
		}
		
		.basic-tags {
			display: flex;
			padding: 20rpx;
			border-bottom: 1px solid #f4f4f4;
			.tag-item {
				margin-left: 20rpx;
				padding: 0 20rpx;
				border: 1px solid #d3d3d3;
				border-radius: 10rpx;
				font-size: 24rpx;
			}
		}
		
		.tips {
			height: 90rpx;
			line-height: 90rpx;
			padding-left: 20rpx;
			border-bottom: 1px solid #f4f4f4;
		}
		
		.brief {
			padding: 20rpx 0;
			line-height: 40rpx;
			font-size: 24rpx;
			.brief-en {
				margin-top: 8rpx;
				color: #888;
			}
		}
		
		.promote {
			padding-bottom: 20rpx;
			border-bottom: 1px solid #f4f4f4;
			color: #888;
			.pro-detail,
			.sale-text {
				line-height: 50rpx;
			}
			.main {
				.tag {
					padding: 4rpx;
					color: #f51127;
					border: 1px solid #f51127;
					border-radius: 16rpx;
				}
				.sale-desc {
					padding-left: 10rpx;
				}
			}
		}
		
		.pop-con {
			height: 30vh;
			
			.pop-title {
				height: 100rpx;
				line-height: 100rpx;
				font-size: 40rpx;
				font-weight: bold;
				border-bottom: 2px solid #f4f4f4;
			}
			
			.pop-main {
				padding: 20rpx;
				border-bottom: 1px solid #e9e9e9;
				
				.pop-tag {
					padding: 4rpx;
					color: #f51127;
					border: 1px solid #f51127;
					border-radius: 16rpx;
				}
				.pop-desc {
					line-height: 50rpx;
				}
			}
		}
		
		.tabs {
			border-bottom: 1px solid #f4f4f4;
			.tab-item {
				height: 100rpx;
				width: 33%;
				line-height: 100rpx;
				font-size: 40rpx;
				text-align: center;
			}
			
			.active {
				border-bottom: 3px solid #ffcd20;
			}
		}
		
		.pro-info {
			padding-bottom: 20rpx;
			border-bottom: 1px solid #f4f4f4;
		}
		
		.btn-group {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 120rpx;
			background-color: #fff;
			z-index: 999;
			box-shadow: 0 -2rpx 6rpx rgba($color: #000000, $alpha: .3);
			
			margin-top: 20rpx;
			button {
				width: 350rpx;
				height: 90rpx;
				line-height: 90rpx;
				font-size: 32rpx;
				border: none;
			}
			.btn-buy {
				background-color: #857a72;
				color: #fff;
			}
			.btn-cart {
				background-color: #ffe32a;
			}
		}
		
		.detail-img {
			width: 100%;
			
			image {
				width: 100%;
			}
		}
	}
</style>
