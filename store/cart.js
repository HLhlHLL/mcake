import { $get, $post, $put } from '@/utils/request.js'
import { getLocalStorage } from '@/utils/shared.js'

function updateCart(objectId, cartList) {
	$put(`/1.1/classes/cart/${objectId}`, {
		cartList
	})
}

export default {
	state() {
		return {
			cartList: [],
			recomList: []
		}
	},
	actions: {
		async getRecommendsList({commit}) {
			const { results } = await $get('/1.1/classes/recommends')
			commit('setRecommendsList', results)
		},
		async getCartList({commit}, objectId) {
			const { results } = await $get(`/1.1/classes/cart?where={"objectId": "${objectId}"}`)
			commit('setCartList', { list: results[0]?.cartList, objectId})
		}
	},
	mutations: {
		addToCart(state, good) {
			if(good.cartIndex >= 0) {
				state.cartList[good.cartIndex] = good
			} else {
				state.cartList?.push(good)
			}
			updateCart(state.objectId, state.cartList)
		},
		changeSingleBox(state, index) {
			state.cartList[index].isChecked = !state.cartList[index].isChecked
			updateCart(state.objectId, state.cartList)
		},
		changeAllBox(state, status) {
			state.cartList.forEach(item => {
				item.isChecked = status
			})
			updateCart(state.objectId, state.cartList)
		},
		removeGood(state, idx) {
			state.cartList.splice(idx, 1)
			updateCart(state.objectId, state.cartList)
		},
		setRecommendsList(state, list) {
			state.recomList = list
		},
		setCartList(state, {list, objectId}) {
			state.cartList = list
			state.objectId = objectId
		}
	},
	getters: {
		checkAll(state) {
			const length = state.cartList?.length
			return length > 0 ? state.cartList.every(item => item.isChecked) : false
		},
		totalPrice(state) {
			return state.cartList?.reduce((prev, cur) => {
				if(cur.isChecked) {
					return prev += parseInt(cur.curSize.pprice) * cur.con
				}
				return prev
			}, 0)
		},
		totalNum(state) {
			return state.cartList?.reduce((prev, cur) => {
				if(cur.isChecked) {
					return prev += cur.con
				}
				return prev
			}, 0)
		}
	}
}