import Vue from 'vue';
import Vuex from 'vuex';
import Api from '@/api/index'
import { setUser, setSetting } from '@/utils/auth'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 存放状态
        isLogin: false,//是否登录
        user: null,//用户信息
		setting: null,//系统设置
    },
    getters: {
        // state的计算属性
        isLogin:state => state.isLogin,
        user:state => state.user,
		setting:state => state.setting
    },
    mutations: {
        // 更改state中状态的逻辑，同步操作
		//设置用户信息
        setUser(state, user){
			if(user){
				state.isLogin = true
				state.user = user
				//保存用户信息
				setUser(user)
			}
        },
		//设置app设置
		setSetting(state, setting){
			if(setting){
				state.setting = setting
				//保存网站设置信息
				setSetting(setting)
			}
		}
    },
    actions: {
        // 提交mutation，异步操作
		//获取网站设置信息
		getAppSetting({ commit }){
			Api.get("/setting/getInfo/").then(res => {
				if(res.code == 20000){
					commit('setSetting', res.data)
				}
			})
		},
		//获取用户信息
		getUserInfo({ commit }){
			return new Promise((resolve, reject) => {
				Api.get("/user/").then(res => {
					if(res.code == 20000){
						commit('setUser', res.data)
					}
					//返回数据
					resolve(res)
				})
			})
		}
    },
});