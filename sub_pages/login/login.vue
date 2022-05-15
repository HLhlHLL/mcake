<template>
	<view class="login">
		<view class="header">
			<text class="goback-icon cuIcon-back fs-36" @click="handleGoBack"></text>
		</view>
		<view class="logo text-center">
			MCAKE
		</view>
		<u--form
			labelPosition="left"
			ref="form"
			:model="model"
			:rules="rules"
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
					placeholder="请输入用户名"
					fontSize="28rpx"
				></u--input>
			</u-form-item>
			<u-form-item
				leftIcon="lock"
				prop="formData.password"
				:leftIconStyle="{
					'font-size': '50rpx',
					'padding-left': '20rpx'
				}"
			>
				<u--input
					v-model="model.formData.password"
					password
					border="none"
					placeholder="请输入密码"
					fontSize="28rpx"
				></u--input>
			</u-form-item>
			<u-button
				text="登录"
				color="#ffe32a"
				:customStyle="{
					'color': '#000'
				}"
				@click="handleLogin"
			></u-button>
		</u--form>
		
		<view class="hint text-center">
			<text>还没有账号？</text>
			<text class="log-text" @click="toReg">立即注册</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					formData: {
						username: '',
						password: '',
					}
				},
				rules: {
					'formData.username': {
						type: 'string',
						required: true,
						message: '请输入正确的用户名',
						trigger: ['blur']
					},
					'formData.password': {
						type: 'string',
						required: true,
						message: '请输入密码',
						trigger: ['blur']
					}
				}
			}
		},
		methods: {
			handleLogin() {
				const { username, password } = this.model.formData
				this.$refs.form.validate().then(res => {
					this.$store.dispatch('userLogin', { username, password})
				}).catch(err => {
					uni.showToast({
						title: '验证未通过，登录失败',
						icon: 'none'
					})
				})
			},
			toReg() {
				uni.navigateTo({
					url: '/sub_pages/regist/regist'
				})
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
	.logo {
		font-size: 100rpx;
	}
	
	.login {
		padding: 0 20rpx;
	}
	
	.header {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		
		.goback-icon {
			color: #888;
		}
	}
	
	.u-form {
		width: 70%;
		margin: 0 auto;
		
		.u-form-item {
			padding: 10rpx 0;
			background-color: #eee;
			border: 5px solid #fff;
			border-radius: 50rpx;
		}
		
		.u-button {
			width: 100%;
			margin-top: 20rpx;
		}
	}
	
	.hint {
		margin: 40rpx 0;
		
		.log-text {
			color: #ac991b;
		}
	}
</style>
