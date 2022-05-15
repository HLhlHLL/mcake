<template>
	<view class="address-info">
		<view class="default-tag" v-if="infoData.status">
			默
		</view>
		<view class="flex justify-between align-center">
			<cu-checkbox
				color="#ffe32a"
				circle
				:checked="infoData.isSel"
				@change="handleChange"
			></cu-checkbox>
			<view class="user-info">
				<view class="user-name">
					{{ infoData.username }}, {{ infoData.phone }}
				</view>
				<view class="address">
					{{ infoData.city }}
					{{ infoData.region }}
					{{ infoData.detail }}
				</view>
			</view>
			<view class="edit cuIcon-edit" @click="editAddress"></view>
		</view>
		
		<view class="footer flex justify-between align-center">
			<view class="default-add" @click="setDefault">
				<text class="cuIcon-edit" v-if="!infoData.status"></text>
				默认地址
			</view>
			<u-line direction="col" length="30rpx" color="#999"></u-line>
			<view class="delete" @click="deleteAdd">
				<text class="cuIcon-delete"></text>
				<text>删除</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'address-info',
		props: {
			info: {
				type: Object,
				default: () => {}
			},
			idx: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				infoData: {}
			}
		},
		beforeMount() {
			this.infoData = this.info
		},
		methods: {
			setDefault() {
				this.$emit('setDefault', this.idx)
			},
			deleteAdd() {
				this.$emit('deleteAdd', this.idx)
			},
			handleChange(val) {
				this.$emit('selectAdd', this.idx, val)
			},
			editAddress() {
				this.$store.dispatch('editAddressAct', this.infoData)
				uni.navigateTo({
					url: `../address-detail/address-detail?id=${this.idx}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.address-info {
		position: relative;
		padding: 20rpx;
		margin-top: 20rpx;
		border: 1px solid #e7e7e7;
		border-radius: 10rpx;
		overflow: hidden;
	}
	
	.default-tag {
		position: absolute;
		top: -8rpx;
		right: -36rpx;
		width: 100rpx;
		height: 50rpx;
		padding-top: 8rpx;
		text-align: center;
		transform: rotate(45deg);
		background-color: #ffbd23;
		box-sizing: border-box;
		
		.tag {
		}
	}
	
	.user-info {
		width: 600rpx;
		padding-left: 20rpx;
		
		.user-name {
			font-size: 30rpx;
			font-weight: bold;
			padding-bottom: 10rpx;
		}
		
		.address {
			font-size: 26rpx;
			color: #999;
		}
	}
	
	.edit {
		font-size: 40rpx;
		color: #b9b9b9;
	}
	
	.footer {
		margin-top: 20rpx;
		text-align: center;
		
		.default-add {
			flex: 1;
		}
		
		.delete {
			flex: 1;
			color: #999;
		}
	}
</style>