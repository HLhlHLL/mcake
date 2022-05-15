<template>
	<scroll-view
		class="scroll"
		scroll-y="true"
		scroll-with-animation
		:scroll-into-view="anchor"
		@scroll="handleScroll"
	>
		<view>
			<view id="target"></view> <!-- 顶部标记点 -->
			<nav-head
				:city="city.city"
				:showMore="showMore"
				@setLocation="setLocation"
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
				<swiper-item
					v-for="item in bannerList"
					:key="item.objectId"
					@click="turnToAd(item.link)"
				>
					<view class="swiper-item">
						<image :src="item.img"></image>
					</view>
				</swiper-item>
			</swiper>

			<Category titleCn="本季推荐" titleEn="Seasonal Recommend" outline="查看更多"></Category>

			<scroll-view scroll-x="true">
				<view class="scroll-inner">
					<image
						mode="heightFix"
						v-for="(item,index) in recommendList"
						:key="item.id"
						:src="item.img"
						@click="handleShowDetail(item.id)"
					></image>
				</view>
			</scroll-view>

			<Category titleCn="法式风情" titleEn="French Classic" outline="查看更多"></Category>

			<view class="home-main">
				<image :src="limg" mode="widthFix"></image>
			</view>

			<view class="item-content">
				<good-item
					v-for="(item,index) in classicList"
					:key="item.id"
					:data="item"
					@click="handleShowDetail(item.id)"
					@addToCart="editGoodInfo"
				></good-item>
			</view>

			<view class="back-top" v-if="showTopBtn" @click="backToTop">
				<text class="cuIcon-top"></text>
			</view>
		</view>
		
		<good-info
			:itemData="cartItemData"
			:show="showGoodInfo"
			@close="closeGoodInfo"
		></good-info>
		
		<not-login
			:show="showNeedLog"
			@close="closeLoginModal"
			@confirm="handleToLogin"
		></not-login>
		
	</scroll-view>
</template>

<script>
	import Category from './category/category.vue'
	import { mapState } from 'vuex'
	export default {
		components: {
			Category
		},
		computed: {
			...mapState({
				userinfo: state => state.user.userinfo,
				city: state => state.city.cityinfo
			}),
			limg() {
				return this.classicList[0]?.limg
			}
		},
		data() {
			return {
				showTopBtn: false,
				anchor: '',
				bannerList: [],
				recommendList: [],
				classicList: [],
				showGoodInfo: false,
				cartItemData: {},
				showNeedLog: false,
				showMore: false
			}
		},
		onLoad() {
			if(!this.city) {
				this.$store.commit('initCity')
			}
			this.$get('/1.1/classes/banner').then(res => {
				this.bannerList = res.results
			})
			this.getGoods()
		},
		methods: {
			getGoods() {
				this.$get('/1.1/classes/goods?limit=10&skip=0').then(res => {
					this.recommendList = res.results.slice(0, 3)
					this.classicList = res.results.slice(3)
				})
			},
			handleScroll(e) {
				const { scrollTop } = e.detail
				this.showTopBtn = scrollTop > 650
				if (this.anchor) this.anchor = ''
			},
			backToTop() {
				this.anchor = 'target'
			},
			turnToAd(link) {
				uni.navigateTo({
					url: `./banner-ad?link=${link}`
				})
			},
			handleShowDetail(id) {
				uni.navigateTo({
					url: '/sub_pages/detail/detail?id=' + id
				})
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
	.banner {
		width: 100%;
		height: 850rpx;

		.swiper-item {
			height: 850rpx;

			image {
				width: 100%;
				height: 850rpx;
			}
		}
	}

	.scroll-inner {
		white-space: nowrap;

		image {
			height: 290rpx;
		}
	}

	.home-main {
		image {
			width: 100%;
		}
	}

	.item-content {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 15rpx;
	}

	.back-top {
		position: fixed;
		bottom: 100rpx;
		right: 40rpx;
		width: 100rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 40rpx;
		border-radius: 50%;
		background-color: #fff;
		box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: .5);
	}

	.scroll {
		height: 100vh;
		padding-top: 100rpx;
	}
</style>
