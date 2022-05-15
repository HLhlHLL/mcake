<template>
	<view
		class="cu-checkbox"
		:style="{
			color: isChecked ? '#fff' : '#d3d3d3',
			backgroundColor: isChecked ? color : '#fff',
			borderRadius: circle ? '50%' : '10rpx'
		}"
		@click="handleClick"
	>
		<text class="cuIcon-check"></text>
	</view>
</template>

<script>
	export default {
		name: 'cu-checkbox',
		props: {
			checked: {
				type: Boolean,
				default: false
			},
			color: {
				type: String,
				default: '#2979ff'
			},
			circle: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				isChecked: false
			}
		},
		mounted() {
			this.isChecked = this.checked
		},
		methods: {
			handleClick() {
				this.isChecked = !this.isChecked
				this.$emit('change', this.isChecked)
			}
		},
		watch: {
			checked: {
				handler(newVal) {
					this.isChecked = newVal
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cu-checkbox {
		width: 40rpx;
		height: 40rpx;
		line-height: 38rpx;
		text-align: center;
		font-weight: bold;
		border: 1px solid #f1f1f1;
	}
</style>
