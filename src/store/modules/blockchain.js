/*
 * Copyright (c) 2020 TechnoL0g.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import Blockchain from '@/services/blockchain'

export default {
  namespaced: true,

  state: {
    delegates: {
      list: [],
      count: 0,
    },
    standbyDelegates: {
      list: [],
      count: 0,
    },
    status: {
      "epoch": "2017-11-21T13:00:00.000Z",
      "height": 835759, "fee": 10000000,
      "milestone": 0,
      "nethash": "fc46bfaf9379121dd6b09f5014595c7b7bd52a0a6d57c5aff790b42a73c76da7",
      "reward": 200000000,
      "supply": 24167151800000000
    },
    fees: {
      "send": 10000000,
      "vote": 100000000,
      "secondsignature": 500000000,
      "delegate": 5500000000,
      "multisignature": 500000000
    },
    xbtsCandidates: [],
    xbtsWinners: [],
    selectedAccount: {},
  },

  getters: {
    delegates: state => state.delegates,
    status: state => state.status,
    fees: state => state.fees,
    xbtsCandidates: state => state.xbtsCandidates,
    xbtsWinners: state => state.xbtsWinners,
    selectedAccount: state => state.selectedAccount,
  },

  mutations: {
    SET_DELEGATES(state, payload) {
      state.delegates = payload
    },
    SET_STATUS(state, payload) {
      state.status = payload
    },
    SET_FEES(state, payload) {
      state.fees = payload
    },
    SET_CANDIDATE(state, payload) {
      state.xbtsCandidates = payload
    },
    SET_WINNERS(state, payload) {
      state.xbtsWinners = payload
    },
    SET_SELECTED_ACCOUNT(state, payload) {
      state.selectedAccount = payload
    },
  },

  actions: {
    async fetchDelegates({commit}, value = 0) {
      const data = await Blockchain.getDelegates(value);
      if (data.count > 0) {
        commit('SET_DELEGATES', data)
      }
    },
    async getStatus({commit}) {
      const data = await Blockchain.getStatus()
      commit('SET_STATUS', data)
    },
    async getAccount({commit}, value) {
      if (!value) {return}
      let data = await Blockchain.getAccount(value)
      commit('SET_SELECTED_ACCOUNT', data)
      return data
    },
    async getFees({commit}) {
      const data = await Blockchain.getFees()
      commit('SET_FEES', data)
    },
    async getXbtsCandidates({commit}) {
      const data = await Blockchain.xbtsCandidates()
      if (data) {
        commit('SET_CANDIDATE', data)
      }
    },
    async getXbtsWinners({commit}) {
      const data = await Blockchain.xbtsWinners()
      if (data) {
        commit('SET_WINNERS', data)
      }
    },
  }
}
