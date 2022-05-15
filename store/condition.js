export default {
	state() {
		return {
			queryinfo: {
				bcid: 1
			}
		}
	},
	mutations: {
		changeCondition(state, data) {
			state.queryinfo = data
		}
	}
}