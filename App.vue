<script>
	export default {
		onLaunch: function() {
			try {
				plus.navigator.setFullscreen(true)
				const user = uni.getStorageSync('userinfo')
				const city = uni.getStorageSync('city')
				if (user) {
					this.$store.commit('initInfo', user)
				}
				if(city) {
					this.$store.commit('initCity', city)
				}
			} catch (e) {
				uni.showToast({
					title: '获取用户信息失败',
					icon: 'none'
				})
			}
		},
		onShow: function() {
		},
		onHide: function() {
		}
	}
</script>

<style lang="scss">
	@import '/colorui/main.css';
	@import '/colorui/icon.css';
	
	/* 引入字体图标 */
	@import '/static/font/iconfont.css';
	
	html,
	body {
		width: 100%;
	}
	/*每个页面公共css */
</style>
