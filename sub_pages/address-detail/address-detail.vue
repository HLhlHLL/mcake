<template>
	<view class="address-detail">
		<nav-head
			goBack
			goCart
			:city="city.city"
			@clickLeft="toCart"
			@handelShowHome="handleShowHome"
			@handleShowMoreGoods="handleShowMoreGoods"
			@handleShowUserInfo="handleShowUserInfo"
		></nav-head>
		<map class="map"></map>
		
		<u--form
			labelPosition="left"
			ref="form"
			:model="model"
		>
			<u-form-item
				leftIcon="account"
				prop="formData.username"
				:leftIconStyle="{
					'font-size': '50rpx',
					'padding-left': '20rpx'
				}"
			>
				<u--input
					v-model="model.formData.username"
					border="none"
					placeholder="请输入收货人姓名"
					fontSize="28rpx"
				></u--input>
			</u-form-item>
			<u-form-item
				leftIcon="phone"
				prop="formData.phone"
				:leftIconStyle="{
					'font-size': '50rpx',
					'padding-left': '20rpx'
				}"
			>
				<u--input
					v-model="model.formData.phone"
					border="none"
					placeholder="请输入手机号码"
					fontSize="28rpx"
				></u--input>
			</u-form-item>
			
			<view class="location flex align-center">
				<view class="loc-name flex align-center">
					<u-icon name="map" size="25"></u-icon>
					<view class="location-name">
						{{ city.city }}
					</view>
				</view>
				<view class="loc-sel" @click="hanleOpenPic">
					{{ this.model.formData.region ?  this.model.formData.region : '请选择地址'}}
				</view>
			</view>
			
			<u-form-item
				leftIcon="file-text"
				prop="formData.detail"
				:leftIconStyle="{
					'font-size': '50rpx',
					'padding-left': '20rpx'
				}"
			>
				<u--input
					v-model="model.formData.detail"
					border="none"
					placeholder="请输入详细地址"
					fontSize="28rpx"
				></u--input>
			</u-form-item>
			
			<u-picker
				:show="showPic"
				:columns="columns"
				@close="handleClosePic"
				@confirm="handleConfirmPic"
			></u-picker>
		
			<view class="set-default flex justify-center" v-if="!hasDefaultAddress">
				<cu-checkbox
					color="#ffe32a"
					circle
					:checked="isChecked"
					@change="handleCheck"
				></cu-checkbox>
				<view class="text">
					设为默认地址
				</view>
			</view>
			
			<view class="confirm-btn" @click="handleConfirmAll">
				保存并使用
			</view>
		</u--form>
	</view>
</template>

<script>
	import { mapGetters, mapState } from 'vuex'
	export default {
		computed: {
			...mapState({
				curEditAddress: state => state.order.orderData.curEditAddress,
				city: state => state.city.cityinfo
			}),
			...mapGetters(['hasDefaultAddress'])
		},
		onLoad(ops) {
			if(this.curEditAddress) {
				this.model.formData = this.curEditAddress
			}
			this.id = ops.id
		},
		onUnload() {
			this.$store.commit('resetCurEditAddress')
		},
		data() {
			return {
				id: undefined,
				model: {
					formData: {
						username: '',
						phone: '',
						city: '',
						region: '',
						detail: ''
					}
				},
				showPic: false,
				columns: [
						['双流区', '金牛区', '新都区']
				],
				isChecked: false
			}
		},
		methods: {
			hanleOpenPic() {
				this.showPic = true
			},
			handleClosePic() {
				this.showPic = false
			},
			handleConfirmPic(val) {
				this.model.formData.region = val.value[0]
				this.showPic = false
			},
			handleCheck(val) {
				this.isChecked = val
			},
			handleConfirmAll() {
				if(this.id >= 0) {
					this.$store.dispatch('saveEditAddressAct', {id: this.id, address: this.model.formData})
				} else {
					this.$set(this.model.formData, 'status', this.isChecked)
					if(this.isChecked) {
						this.$set(this.model.formData, 'isSel', true)
					}
					this.$store.dispatch('addNewAddressAct', this.model.formData)
				}
				uni.navigateBack({
					delta: 1
				})
			},
			toCart() {
				uni.navigateTo({
					url: '/sub_pages/cart/cart'
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
	.address-detail {
		padding-top: 100rpx;
	}
	
	.map {
		width: 100%;
		height: 520rpx;
		margin-bottom: 40rpx;
	}
	
	.location {
		color: #c6c6c6;
		font-size: 32rpx;
		padding: 20rpx;
		.loc-name {
			color: #8d8d8d;
			flex: 1;
			
			.location-name {
				padding-left: 20rpx;
			}
		}
		
		.loc-sel {
			color: #8d8d8d;
			flex: 1;
		}
		
		.loc-sel {
			text-align: center;
		}
	}
	
	.set-default {
		margin-top: 60rpx;
		font-size: 32rpx;
		.text {
			margin-left: 20rpx;
			color: #8d8d8d;
		}
	}
	
	.confirm-btn {
		position: fixed;
		bottom: 20rpx;
		left: 25rpx;
		width: 700rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		font-size: 32rpx;
		border-radius: 10rpx;
		background-color: #ffe32a;
	}
</style>
