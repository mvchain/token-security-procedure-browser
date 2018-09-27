import { getTable, createAddress, downAddress, signTable, fee, modifyFee, deleteInfo } from '@/api/home.js'
const user = {
  state: {
    tableData: {},
    signTableData: {},
    feeData: {}
  },

  mutations: {
    SET_TABLE_DATA: (state, tableData) => {
      state.tableData = tableData
    },
    SET_SIGN_TABLE_DATA: (state, signTableData) => {
      state.signTableData = signTableData
    },
    SET_FEE: (state, feeData) => {
      state.feeData = feeData
    }
  },

  actions: {
    getAddressTable: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        getTable(payload).then(res => {
          commit('SET_TABLE_DATA', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getCreateAddress: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        createAddress(payload).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getDownAddress: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        downAddress(payload).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getSignTable: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        signTable(payload).then((res) => {
          commit('SET_SIGN_TABLE_DATA', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getFee: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        fee().then((res) => {
          commit('SET_FEE', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    putFee: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        modifyFee(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getDelete: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        deleteInfo(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
