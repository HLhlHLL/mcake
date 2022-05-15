import { $put, $get } from '@/utils/request.js'
import { getLocalStorage } from '@/utils/shared.js'

export default {
	state() {
		return {
			orderData: {
				addressList: [],
				curAddress: {},
				curEditAddress: {}
			}
		}
	},
	actions: {
		async getAddressList({commit}, objectId) {
			const data = await $get(`/1.1/classes/address?where={"objectId": "${objectId}"}`)
			const list = data.results[0]?.addressList
			commit('setAddressList', {list, objectId})
		},
		addNewAddressAct({ commit }, newAddress) {
			commit('addAddressMut', newAddress)
		},
		editAddressAct({ commit }, editAddress) {
			commit('editAddressMut', editAddress)
		},
		saveEditAddressAct({ commit }, editAddress) {
			commit('saveEditAddressMut', editAddress)
		}
	},
	mutations: {
		setAddressList(state, {list, objectId}) {
			state.objectId = objectId
			state.orderData.addressList = list
			list?.forEach(item => {
				if(item.status) {
					state.orderData.curAddress = item
				}
			})
		},
		setCurAddress(state, curAddress) {
			state.orderData.curAddress = curAddress
		},
		addAddressMut(state, newAddress) {
			state.orderData.addressList.push(newAddress)
			$put(`/1.1/classes/address/${state.objectId}`, {
				addressList: state.orderData.addressList
			})
		},
		editAddressMut(state, editAddress) {
			state.orderData.curEditAddress = editAddress
		},
		saveEditAddressMut(state, {id, address}) {
			state.orderData.addressList[id] = address
			$put(`/1.1/classes/address/${state.objectId}`, {
				addressList: state.orderData.addressList
			})
		},
		resetCurEditAddress(state) {
			state.orderData.curEditAddress = {}
		}
	},
	getters: {
		username(state) {
			return state.orderData.curAddress.username
		},
		phone(state) {
			return state.orderData.curAddress.phone
		},
		city(state) {
			return state.orderData.curAddress.city
		},
		region(state) {
			return state.orderData.curAddress.region
		},
		detail(state) {
			return state.orderData.curAddress.detail
		},
		hasDefaultAddress(state) {
			const list = state.orderData.addressList || []
			return list.some(item => item.status)
		}
	}
}