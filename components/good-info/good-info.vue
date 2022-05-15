<template>
	<view class="good-info" v-if="showLay" @click.stop @touchmove.stop.prevent>
		<view class="info-wrap">
			<view class="good-itd flex">
				<view class="good-img">
					<image :src="good.img"></image>
				</view>
				<view class="good-title">
					<view class="title-cn">
						{{ good.name }}
					</view>
					<view class="title-en">
						{{ good.french }}
					</view>
					<view class="good-price">
						<text class="fs-24">￥</text>
						{{ good.price }}
					</view>
					<text class="icon-close cuIcon-close" @click="handleClose"></text>
				</view>
			</view>
			<view class="good-size flex justify-between">
				<view class="size-title">
					规格选择
				</view>
				<view class="size-select text-center" @click="handleShowSelectItem">
					{{ good.spec }}
					<text v-if="good.weight !== '0' && good.weight">({{ good.weight }})</text>
					<text style="padding: 0 10rpx;" v-if="good.curSize && good.curSize.edible !== ''">-</text>
					{{ good.curSize ? good.curSize.edible : ''}}
					<text class="cuIcon-unfold fs-32"></text>
					<view class="selections" v-if="showSelectItem">
						<view
							:class="['select-item', curSizeId === index ? 'active' : '']"
							v-for="(select, index) in good.list"
							:key="index"
							@click="eidtSize(index)"
						>
							{{ select.spec }}
							<text v-if="select.weight !== '0' && select.weight">({{ select.weight }})</text>
							<text style="padding: 0 10rpx;" v-if="select.edible !== ''">-</text>
							{{ select.edible }}
						</view>
					</view>
				</view>
			</view>
			<view class="good-num flex justify-between">
				<view class="num-tilte">
					数量选择
				</view>
				<view class="counter flex">
					<view :class="['minus', good.con > 1 ? 'active' : '']" @click="changeCount('m')">
						<text class="cuIcon-move"></text>
					</view>
					<view class="number">
						{{ good.con }}
					</view>
					<view :class="['plus', good.con < 100 ? 'active' : '']" @click="changeCount('p')">
						<text class="cuIcon-add"></text>
					</view>
				</view>
			</view>
			<view class="btn-group flex">
				<view class="btn-cancel" @click="handleClose">
					取消
				</view>
				<view class="btn-confirm" @click="handleConfirm">
					确认
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'good-info',
		emits: ['close'],
		props: {
			show: {
				type: Boolean,
				default: false
			},
			itemData: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				showLay: false,
				showSelectItem: false,
				good: {},
				curSize: {},
				curSizeId: 0
			}
		},
		watch: {
			show(newVal) {
				this.showLay = newVal
			},
			itemData(newVal) {
				this.good = newVal
				this.curSize = this.good.curSize
			}
		},
		mounted() {
			this.timer = null
		},
		beforeDestroy() {
			this.good = {}
			this.curSize = {}
		},
		methods: {
			handleClose() {
				this.showLay = false
				this.$emit('close', this.showLay)
			},
			handleShowSelectItem() {
				this.showSelectItem = !this.showSelectItem
			},
			eidtSize(idx) {
				this.curSizeId = idx
				this.good.curSize = this.good.list[idx]
				this.good.spec = this.good.curSize.spec
			},
			changeCount(type) {
				if(this.timer) return
				this.timer = setTimeout(() => {
					switch(type) {
						case 'm':
						this.good.con > 2 ? this.good.con-- : this.good.con = 1
						break
						case 'p':
						this.good.con < 100 ? this.good.con++ : this.good.con = 99
						break
					}
					this.timer = null
				}, 500)
			},
			handleConfirm() {
				this.$store.commit('addToCart', this.good)
				this.showLay = false
				this.$emit('close', this.showLay)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.good-info {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999;
		background-color: rgba($color: #b3b3b3, $alpha: .5);
	}
	
	.info-wrap {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 90%;
		height: 500rpx;
		background-color: #fff;
		border-radius: 10rpx;
		
		.good-itd {
			padding: 20rpx;
			border-bottom: 1px solid #eaeaea;
			image{
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
			}
			
			.good-title {
				position: relative;
				width: 500rpx;
				padding-left: 30rpx;
				font-size: 24rpx;
				
				.title-cn,
				.title-en,
				.good-price {
					line-height: 40rpx;
				}
				
				.title-en {
					color: #8d8d8d;
				}
				
				.icon-close {
					position: absolute;
					top: 0;
					right: 0;
					font-size: 32rpx;
				}
			}
		}
		
		.good-size,
		.good-num {
			padding: 20rpx;
			line-height: 40rpx;
			font-size: 24rpx;
			border-bottom: 1px solid #eaeaea;
			color: #8d8d8d;
		}
		
		.good-size {
			.size-select {
				position: relative;
				.selections {
					position: absolute;
					top: 60rpx;
					right: 0;

					.select-item {
						width: 320rpx;
						height: 60rpx;
						line-height: 60rpx;
						background-color: #fff;
						color: #767676;
					}
					
					.active {
						background-color: #767676;
						color: #fff;
					}
				}
				
				.fs-32 {
					padding-left: 10rpx;
					font-weight: bold;
					vertical-align: middle;
				}
			}
		}
		
		.good-num {
			.minus,
			.number,
			.plus {
				width: 56rpx;
				height: 56rpx;
				line-height: 56rpx;
				font-size: 32rpx;
				text-align: center;
				background-color: #f2f3f5;
				border-radius: 10rpx;
				color: #000;
			}
			
			.number {
				margin: 0 10rpx;
			}
			
			.minus,
			.plus {
				font-weight: bold;
			}
			
			.active {
				background-color: #ffe32a;
			}
			
		}
		
		.btn-group {
			.btn-cancel,
			.btn-confirm {
				flex: 1;
				height: 90rpx;
				font-size: 36rpx;
				text-align: center;
				line-height: 90rpx;
			}
			
			.btn-cancel {
				background-color: #888888;
				color: #fff;
				border-bottom-left-radius: 10rpx;
			}
			
			.btn-confirm {
				background-color: #ffe32a;
				border-bottom-right-radius: 10rpx;
			}
		}
	}
</style>