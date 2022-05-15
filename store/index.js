import Vue from 'vue'
import Vuex from 'vuex'
import condition from './condition.js'
import user from './user.js'
import cart from './cart.js'
import sale from './sale.js'
import order from './order.js'
import city from './city.js'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		condition,
		user,
		cart,
		sale,
		order,
		city
	}
})