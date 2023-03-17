import Vue from 'vue';
import Vuex from 'vuex';
import Api from '@/api/index'

import { setUser, setParams, setMenus } from '@/utils/auth'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 存放状态
        isLogin: false,//是否登录
        user: null,//用户信息
		params: null,//参数信息
		menus: [],//菜单数据
		datas: {},//静态数据
    },
    getters: {
        // state的计算属性
        isLogin:state => state.isLogin,
        user:state => state.user,
		params:state => state.params,
		menus:state => state.menus,
		datas:state => state.datas
    },
    mutations: {
        // 更改state中状态的逻辑，同步操作
		//设置静态数据
		setDatas(state, datas){
			state.datas = datas
		},
		//设置菜单数据
		setMenus(state, menus){
			state.menus = menus
			//保存菜单数据
			setMenus(menus)
		},
		//设置用户信息
        setUser(state, user){
			if(user){
				state.isLogin = true
				state.user = user
				//保存用户信息
				setUser(user)
			}
        },
		//设置参数信息
		setParams(state, params){
			if(params){
				state.params = params
				//保存参数信息
				setParams(params)
			}
		}
    },
    actions: {
        // 提交mutation，异步操作
		//获取参数信息
		getParams({ commit }){
			Api.get("/param/getList/").then(res => {
				if(res.code == 20000){
					commit('setParams', res.data)
				}
			})
		},
		//获取菜单数据
		getMenus({ commit }){
			return new Promise((resolve, reject) => {
				Api.get("/menu/getList/").then(res => {
					if(res.code == 20000){
						commit('setMenus', res.data)
					}
					//返回数据
					resolve(res)
				})
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