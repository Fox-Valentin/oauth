
import Vue from 'vue'

const state = {
  orderList: [],
  params: {}
}

const getters = {
  getOrderList: state => state.orderList
}

const actions = {
  fetchOrderlist ({commit, state}) {
    Vue.http.post('/api/getOrderList', state.params).then(
      (res) => {
        commit('updateOrderList', res.data.list)
      },
      (err) => {
        console.log(err)
      }
    )
  }
}

const mutations = {
  updateOrderList (state, payload) {
    state.orderList = payload
  },
  updateOrderParams (state, {key, val}) {
    state.params[key] = val
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
