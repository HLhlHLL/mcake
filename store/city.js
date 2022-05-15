import { setLocalStorage } from '@/utils/shared.js'
	
export default {
	state() {
		return {
			cityList: [
				{
					city: '上海市',
					en: 'Shang Hai Shi',
					cityId: 1
				},
				{
					city: '北京市',
					en: 'Bei Jing Shi',
					cityId: 2
				},
				{
					city: '杭州市',
					en: 'Hang Zhou Shi',
					cityId: 3
				}
			],
			cityinfo: {}
		}
	},
	mutations: {
		initCity(state) {
			state.cityinfo = state.cityList[0]
		},
		selectCity(state, city) {
			state.cityinfo = city
			setLocalStorage('city', city)
		}
	}
}