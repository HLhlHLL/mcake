import { $get } from '@/utils/request.js'
export default {
	state() {
		return {
			saleList: []
		}
	},
	actions: {
		async getSaleList({commit} ,page) {
			const skip = page * 8
			const { results } = await $get(`/1.1/classes/sales?limit=8&skip=${skip}`)
			commit('setSaleList', results)
			const status = results.length > 0
			return Promise.resolve({status})
		}
	},
	mutations: {
		setSaleList(state, list) {
			state.saleList = list
		}
	}
}