import Vue from "vue";
const state = {
    currentUser_token:''
    }
const mutations = {
        setUser(state,user_token){
            window.localStorage.setItem("currentUser_token",user_token)
        }
    }
const getters = {
    getUserToken(){
        return window.localStorage.getItem("currentUser_token")
    }
}
export default {
    state,
    mutations,
    getters    
}