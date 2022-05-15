<template>
	<view class="appraise">
		<view class="ap-item" v-for="(item,index) in list" :key="index">
			<view class="info-head flex justify-between">
				<view class="head-left flex">
					<view class="avatar">
						<image :src="item.uhead" mode="widthFix"></image>
					</view>
					<view class="level">
						<text class="fs-24">v</text>
						{{ item.rid }}
					</view>
					<view class="userid">
						<text style="padding-right: 10rpx;">会员:</text>
						{{ item.uname }}
					</view>
				</view>
				<view class="head-right fs-24">
					{{ item.ctime }}
				</view>
			</view>
			<view class="info-content">
				{{ item.content }}
			</view>
			<view class="info-img flex flex-wrap" v-if="item.img.length > 0">
				<view class="img-wrap" v-for="(img,index) in item.img" :key="index">
					<image :src="img.src"></image>
				</view>
			</view>
		</view>
		
		<view class="blank text-center" v-if="last">
			——没有更多评价——
		</view>
		
		<view class="btn-group flex justify-center">
			<view class="pre">
				<button class="pre-btn" :disabled="!skip" @click="handlePrev">上一页</button>
			</view>
			<view class="next">
				<button class="next-btn" :disabled="last" @click="handleNext">下一页</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'appraise',
		props: {
			twoId: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				list: [],
				limit: 5,
				skip: 0,
				last: false,
				id: undefined
			}
		},
		mounted() {
			this.id = this.twoId
			this.getPage(this.id)
		},
		methods: {
			getPage(twoId) {
				const skip = this.skip * this.limit
				this.$get(`/1.1/classes/appraise?where={"twoId": ${twoId}}&limit=${this.limit}&skip=${skip}`).then(res => {
					if(res.results.length < 5) {
						this.last = true
					}
					this.list = res.results
				})
			},
			handlePrev() {
				this.last = false
				this.skip--
				this.getPage(this.id)
			},
			handleNext() {
				this.skip++
				this.getPage(this.id)
			}
		},
		watch: {
			twoId(newVal, oldVal) {
				this.id = newVal
				this.getPage(this.id)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.appraise {
		margin-top: 20rpx;
	}
	
	.ap-item {
		background-color: #f9f9f9;
		margin-bottom: 20rpx;
		padding: 20rpx;
		color: #888;
		
		.head-left {
			position: relative;
			margin-bottom: 20rpx;
			
			.avatar {
				width: 56rpx;
				height: 56rpx;
				border-radius: 50%;
				overflow: hidden;
				
				image {
					width: 56rpx;
				}
			}
			
			.level {
				position: absolute;
				width: 40rpx;
				height: 40rpx;
				line-height: 40rpx;
				left: 30rpx;
				bottom: -10rpx;
				text-align: center;
				background-color: #ffe32a;
				border-radius: 50%;
				z-index: 2;
			}
			
			.userid {
				padding: 10rpx 0 0 20rpx;
				font-size: 24rpx;
			}
		}
		
		.info-img {
			margin-top: 10rpx;
			
			image {
				margin-right: 10rpx;
				width: 120rpx;
				height: 120rpx;
			}
		}
	}
	
	.blank {
		margin: 20rpx 0;
		color: #999;
	}

	.btn-group {
		button {
			margin: 0 10rpx;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 28rpx;
		}
	}
</style>
