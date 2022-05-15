<template>
	<view class="address">
		<nav-head
			goBack
			goCart
			@clickLeft="toCart"
			@handelShowHome="handleShowHome"
			@handleShowMoreGoods="handleShowMoreGoods"
			@handleShowUserInfo="handleShowUserInfo"
		></nav-head>
		
		<view class="add-main">
			<view class="s-wrap flex">
				<view class="s-ipt">
					<input type="text" placeholder="请输入收货人姓名、手机号、地址关键词">
				</view>
				<view class="s-btn">
					搜索
				</view>
			</view>
			
			<view class="add-wrap">
				<view class="add-list">
					<address-info
						v-for="(add, index) in addressList"
						:key="add.username"
						:info="add"
						:idx="index"
						@setDefault="setDefault"
						@deleteAdd="deleteAdd"
						@selectAdd="selectAdd"
					></address-info>
				</view>
				
				<view class="not-found" v-if="addressList.length === 0">
					收货地址未找到
				</view>
				
				<view class="add-sel flex justify-center">
					<view class="add">
						<view class="i-plus flex justify-center" @click="toAddDetail">
							<view class="cuIcon-add"></view>
						</view>
						<view class="add-text">
							新增地址
						</view>
					</view>
				</view>
				<view class="add-sel flex justify-center">
					<view class="add">
						<view class="i-plus flex justify-center">
							<view class="cuIcon-add"></view>
						</view>
						<view class="add-text">
							网点自提
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import AddressInfo from './addresinfo/addressinfo.vue'
	import { mapState } from 'vuex'
	export default {
		components: {
			AddressInfo
		},
		computed: {
			...mapState({
				addressList: state => state.order.orderData.addressList || [],
				objectId: state => state.user.userinfo?.objectId
			})
		},
		data() {
			return {
				
			}
		},
		methods: {
			toCart() {
				uni.navigateTo({
					url: '/sub_pages/cart/cart'
				})
			},
			setDefault(idx) {
				this.addressList.forEach(item => {
					item.status = false
					item.isSel = false
				})
				this.$set(this.addressList[idx], 'status', true)
				this.$set(this.addressList[idx], 'isSel', true)
				this.submitChange()
			},
			deleteAdd(idx) {
				this.addressList.splice(idx, 1)
				this.submitChange()
			},
			selectAdd(idx, checked) {
				this.addressList.forEach(item => {
					item.isSel = false
				})
				this.addressList[idx].isSel = true
				this.submitChange()
				this.$store.commit('setCurAddress', this.addressList[idx])
				uni.navigateTo({
					url: '/sub_pages/order/order'
				})
			},
			toAddDetail() {
				uni.navigateTo({
					url: '/sub_pages/address-detail/address-detail'
				})
			},
			submitChange() {
				this.$put(`/1.1/classes/address/${this.objectId}`, {
					addressList: this.addressList
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

<style lang="scss"scoped>
	.address {
		padding-top: 100rpx;
		padding-bottom: 120rpx;
	}
	
	.s-wrap {
		padding: 10rpx;
		background-color: #e6e6e6;
		.s-ipt {
			flex: 6;
			input {
				height: 80rpx;
				line-height: 80rpx;
				padding: 0 20rpx;
				font-size: 24rpx;
				background-color: #fff;
				border-radius: 10rpx;
			}
		}
		.s-btn {
			flex: 1;
			height: 80rpx;
			margin-left: 10rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 24rpx;
			background-color: #ffe32a;
			border-top: 2px solid #ffe32a;
			border-left: 2px solid #ffe32a;
			border-right: 2px solid #ab981c;
			border-bottom: 2px solid #ab981c;
			border-radius: 12rpx;
			color: #9ca450;
		}
	}
	
	.not-found {
		margin: 80rpx 0;
		text-align: center;
		color: #8d8d8d;
	}
	
	.add-wrap {
		padding: 0 20rpx 20rpx;
	}
	
	.add {
		width: 50%;
		text-align: center;
		margin-top: 60rpx;
		.cuIcon-add {
			width: 80rpx;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 60rpx;
			color: #fff;
			border-radius: 50%;
			background-color: #ffe32a;
		}
		.add-text {
			font-size: 32rpx;
			padding: 20rpx 0;
			color: #8d8d8d;
		}
	}

</style>
