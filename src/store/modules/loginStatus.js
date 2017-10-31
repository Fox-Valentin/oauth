import Vue from 'vue'

const state = {
  loginState: false,
  params: {}
}

const getters = {
  getLoginState : state => state.loginState
}

const mutations = {
  updateLoginState (state, payload) {
    state.loginState = payload
  },
  updateLoginParams (state, {key, val}) {
    state.params[key] = val
  }
}

const actions = {
  checkLoginStates ({commit, state}) {
    Vue.http.post('/api/isLogin', state.params).then((res) => {
      commit('updateLoginState', res.data.status)
    }, (err) => {
      console.log(err)
    })
  },
  updateLoginStates ({commit, state}) {
    Vue.http.post('/api/siginIn', state.params).then((res) => {
      commit('updateLoginState', res.data.status)
    }, (err) => {
      console.log(err)
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
