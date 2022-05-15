const getLocalStorage = (key) => {
	try {
		const value = uni.getStorageSync(key);
		if (value) {
			return value
		}
	} catch (e) {
	}
}

const setLocalStorage = (key, data) => {
	try {
		uni.setStorageSync(key, data);
	} catch (e) {
		// error
	}
}

const removeLocalStorage = (key) => {
	try {
		uni.removeStorageSync(key);
	} catch (e) {
		// error
	}
}

export {
	getLocalStorage,
	setLocalStorage,
	removeLocalStorage
}