import App from './App'
import Api from '@/api/index'
import store from '@/store/index'
import Vue from 'vue'


Vue.config.productionTip = false
Vue.prototype.$api = Api


App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
app.$mount()