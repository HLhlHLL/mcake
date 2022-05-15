import { $post, $put } from '../utils/request.js'
import { getLocalStorage, setLocalStorage } from '../utils/shared.js'
import cart from './cart.js'

export default {
	state() {
		return {
			userinfo: {}
		}
	},
	mutations: {
		initInfo(state, info) {
			state.userinfo = info
		}
	},
	actions: {
		userRegister({commit}, { username, password }) {
			$post('/1.1/users', { username, password }).then(res => {
				const { objectId, code } = res
				if(!objectId && code === 202) {
					return uni.showToast({
						title: '用户名已存在',
						icon: 'none'
					})
				}
				$post('/1.1/classes/cart', {
					objectId,
					cartList: []
				})
				$post('/1.1/classes/address', {
					objectId,
					addressList: []
				})
				uni.showToast({
					title: '注册成功',
					icon: 'none'
				})
				setTimeout(() => {
					uni.navigateTo({
						url: '/sub_pages/login/login'
					})
				}, 1000)
			})
		},
		userLogin({ commit, dispatch }, info) {
			$post('/1.1/login', info).then(res => {
				const { objectId, code } = res
				const title = code === 211 ? '用户名不存在' : '密码错误'
				if(!objectId && code) {
					return uni.showToast({
						title,
						icon: 'none'
					})
				}
				commit('initInfo', res)
				setLocalStorage('userinfo', res)
				dispatch('getCartList', objectId, { root: true })
				uni.navigateTo({
					url: '/pages/home/home'
				})
			}).catch(err => {
				
			})
		}
	}
}