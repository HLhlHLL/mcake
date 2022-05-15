<template>
	<view>
		<web-view :src="webUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webUrl: ''
			}
		},
		onLoad(options) {
			const { link, key2, type } = options
			this.webUrl = `${link}&key2=${key2}&type=${type}`
		}
	}
</script>

<style lang="scss">

</style>
