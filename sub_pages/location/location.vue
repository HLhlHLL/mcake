<template>
	<view class="location">
		<nav-head simple :city="city.city"></nav-head>
		
		<view class="main">
			<view class="icon-wrap flex flex-direction align-center">
				<view class="loc-icon">
					<view class="iconfont icon-setlocation"></view>
				</view>
				<view class="hint">
					请选择您所在城市
				</view>
			</view>
			
			<view class="city-list">
				<view
					:class="['city-item flex justify-between', curIdx === index ? 'active' : '']"
					v-for="(item,index) in cityList"
					:key="index"
					@click="handleSelectCity(index, item)"
				>
					<view class="ct-cn">
						{{ item.city }}
					</view>
					<view class="ct-en">
						{{ item.en }}
					</view>
					<view class="cuIcon-right text-right"></view>
				</view>
			</view>
			
			<view class="footer">
				更多城市敬请期待
			</view>
			
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState({
				cityList: state => state.city.cityList,
				city: state => state.city.cityinfo
			})
		},
		data() {
			return {
				curIdx: 0,
				curCity: {}
			}
		},
		onLoad() {
			this.curIdx = this.city.cityId - 1
		},
		methods: {
			handleSelectCity(idx, city) {
				this.curIdx = idx
				this.curCity = city
				this.$store.commit('selectCity', city)
				uni.navigateTo({
					url: '/pages/home/home'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.location {
		height: 100vh;
		padding: 100rpx 30rpx 0;
		background-color: #d5e1eb;
	}
	
	.main {
		.icon-wrap {
			margin-top: 40rpx;
			.loc-icon {
				width: 210rpx;
				height: 210rpx;
				line-height: 210rpx;
				text-align: center;
				background-color: #fff;
				border-radius: 50%;
				.icon-setlocation {
					color: #d5e1eb;
					font-size: 100rpx;
				}
			}
			.hint {
				margin-top: 40rpx;
				color: #fff;
			}
		}
		
		.city-list {
			margin-top: 40rpx;
			.city-item {
				margin-top: 20rpx;
				padding: 0 30rpx;
				height: 120rpx;
				line-height: 120rpx;
				background-color: #fff;
				border-radius: 20rpx;
				.ct-cn {
					font-size: 40rpx;
					color: #000;
				}
				
				.ct-en,
				.cuIcon-right {
					color: #d0d0d0;
					font-size: 32rpx;
				}
			}
			
			.active {
				background-color: #ffd645;
				
				.ct-en {
					color: #000;
				}
				.cuIcon-right {
					color: #fff;
				}
			}
		}
		
		.footer {
			text-align: center;
			margin-top: 40rpx;
			color: #8d8d8d;
		}
	}
	
</style>
