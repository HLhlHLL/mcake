<template>
	<view class="content">
		<view class="header">
			<text class="goback-icon cuIcon-back fs-36" @click="handleGoBack"></text>
		</view>
		<view class="card">
			<view class="avatar text-center flex flex-direction align-center justify-between">
				<view class="avatar-default" v-if="username === '未登录'" @click="handleToLogin">
					<view class="cuIcon-peoplefill"></view>
					<text>点击登录</text>
				</view>
				<image class="avatar-img" src="" v-else></image>
				<view class="fs-32">{{ username }}</view>
			</view>
			<view class="menu-list">
				<view class="menu-col">
					<view class="menu-item flex flex-direction padding-sm align-center"
						v-for="(item,index) in menuList">
						<text :class="['icon margin-bottom-xs',`cuIcon-${item.icon}`]"></text>
						{{ item.text }}
					</view>
				</view>
				<view class="menu-col">
					<view class="menu-item flex flex-direction padding-sm align-center"
						v-for="(item,index) in menuList">
						<text :class="['icon margin-bottom-xs',`cuIcon-${item.icon}`]"></text>
						{{ item.text }}
					</view>
				</view>
			</view>
		</view>
		<view class="logout-btn">
			<button @click="handleLogout">退出登录</button>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { removeLocalStorage } from '@/utils/shared.js'
	export default {
		computed: {
			...mapState({
				username: state => state.user.userinfo?.username || '未登录'
			})
		},
		data() {
			return {
				menuList: [
					{
						icon: 'formfill',
						text: '订单'
					}, {
						icon: 'deliver_fill',
						text: '待收货'
					}, {
						icon: 'moneybagfill',
						text: '待付款'
					}, {
						icon: 'crownfill',
						text: '会员等级'
					},
				]
			}
		},
		methods: {
			handleToLogin() {
				uni.navigateTo({
					url: '/sub_pages/login/login'
				})
			},
			handleLogout() {
				removeLocalStorage('userinfo')
				removeLocalStorage('city')
				this.handleToLogin()
			},
			handleGoBack() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 0 20rpx 40rpx 20rpx;
		
		.header {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			
			.goback-icon {
				color: #888;
			}
		}

		.card {
			background-color: #eee;
			border-radius: 10rpx;
			
			.avatar {
				margin-bottom: 20rpx;
				
				.avatar-default {
					width: 120rpx;
					height: 120rpx;
					margin: 10rpx;
					padding: 20rpx;
					line-height: 60rpx;
					border: 1px solid #9f9f9f;
					box-sizing: content-box;
					border-radius: 50%;
					color: #888;
					.cuIcon-peoplefill {
						font-size: 80rpx;
					}
				}
				
				.avatar-img {
					width: 150rpx;
					height: 150rpx;
					margin-top: -80rpx;
					border-radius: 50%;
				}
			}
			
			.menu-col {
				display: grid;
				grid-template-columns: repeat(4, auto);
			
				.menu-item {
					.icon {
						font-size: 60rpx;
						color: #999;
					}
				}
			}
		}
		
		.logout-btn {
			button {
				margin-top: 50rpx;
				border: none;
				background-color: #f0250f;
				color: #fff;
			}
		}
	}
</style>
