<template>
	<view class="not-login" v-if="isShow">
		<view class="main-box">
			<view class="title">
				<text>温馨提示</text>
			</view>
			<view class="content">
				<text>您需要先登录才能继续您的操作</text>
			</view>
			<view class="btn-group flex justify-between">
				<view class="btn-cancel" @click="handleClose">
					以后再说
				</view>
				<view class="btn-login" @click="handleConfirm">
					立即登录
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'not-login',
		emits: ['close', 'confirm'],
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		mounted() {
			this.isShow = this.show
		},
		data() {
			return {
				isShow: false
			}
		},
		methods: {
			handleClose() {
				this.isShow = !this.isShow
				this.$emit('close', this.isShow)
			},
			handleConfirm() {
				this.isShow = !this.isShow
				this.$emit('confirm')
			}
		},
		watch: {
			show(newVal) {
				this.isShow = newVal
			}
		}
	}
</script>

<style lang="scss" scoped>
	.not-login {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba($color: #808080, $alpha: .8);
		z-index: 1000;
		
		.main-box {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 90%;
			height: 232rpx;
			background-color: #fff;
			border-radius: 10rpx;
			
			.title {
				font-size: 32rpx;
				font-weight: bold;
				text-align: center;
				padding: 20rpx 20rpx 0;
				color: #333;
			}
			
			.content {
				font-size: 26rpx;
				text-align: center;
				padding: 32rpx;
				color: #999999;
			}
			
			.btn-group {
				height: 75rpx;
				line-height: 75rpx;
				font-size: 32rpx;
				text-align: center;
				
				.btn-cancel {
					background-color: #857a72;
					flex: 1;
					border-bottom-left-radius: 10rpx;
					color: #fff;
				}
				
				.btn-login {
					background-color: #ffe32a;
					flex: 1;
					border-bottom-right-radius: 10rpx;
				}
			}
		}
	}
</style>