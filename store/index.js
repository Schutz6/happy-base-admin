import Vue from 'vue';
import Vuex from 'vuex';
import Api from '@/api/index'

import { setUser, setParams, setMenus, setProject, setProjects } from '@/utils/auth'
import { filterMenus } from '@/utils/util'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 存放状态
        isLogin: false,//是否登录
        user: null,//用户信息
		params: null,//参数信息
		initMenus: [],//初始菜单数据
		menus: [],//过滤后的菜单数据
		datas: {},//静态数据
		routes: [],//路由
		project: null,//当前项目
		projects: [],//项目数据
    },
    getters: {
        // state的计算属性
        isLogin:state => state.isLogin,
        user:state => state.user,
		params:state => state.params,
		initMenus:state => state.initMenus,
		menus:state => state.menus,
		datas:state => state.datas,
		routes:state => state.routes,
		project:state => state.project,
		projects:state => state.projects
    },
    mutations: {
        // 更改state中状态的逻辑，同步操作
		//设置路由
		setRoutes(state, routes){
			state.routes = routes
		},
		//设置静态数据
		setDatas(state, datas){
			state.datas = datas
		},
		//设置菜单数据
		setMenus(state, menus){
			//保存菜单数据
			setMenus(menus)
			state.initMenus = menus
		},
		//过滤菜单
		filterMenus(state){
			if(state.initMenus.length > 0 && state.project){
				//设置过滤后的菜单数据
				state.menus = filterMenus(state.initMenus, state.project.value)
			}
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
		},
		//设置项目信息
		setProject(state, project){
			if(project){
				state.project = project
				//保存项目信息
				setProject(project)
			}
		},
		setProjects(state, projects){
			if(projects){
				state.projects = projects
				//保存项目信息
				setProjects(projects)
			}
		}
    },
    actions: {
        // 提交mutation，异步操作
		//设置路由
		setRoutes({ commit }, routes){
			commit('setRoutes', routes)
		},
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
						commit('filterMenus')
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