/**
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
 **/

import Gm from '@/services/gm'

export default {
  namespaced: true,

  state: {
    codes: {},
    totalGM: {
      total: {
        bank: {
          address: "SVrAmzmekqNuTGY54JqJe2HXSHcuPd7JmJ",
          "amount": 0
        }
      },
    },
    totalSTH: 0,
  },

  getters: {
    codes: state => state.codes,
    totalGM: state => state.totalGM,
    totalSTH: state => state.totalSTH,
  },

  mutations: {
    SET_RESET(state) {
      state.codes = {}
    },
    SET_GM_CODE(state, payload) {
      state.codes[payload.pub] = payload
    },
    REFRESH_CODES(state, payload) {
      for (let i=0; i < payload.length; i++) {
        state.codes[payload[i].code].status = payload[i].status
      }
    },
    SET_STATUS_CODE(state, payload) {
      state.codes[payload.code].status = payload.status
    },
    SET_TOTAL_STH(state, payload) {
      state.totalSTH = payload
    },
    SET_TOTAL_GM(state, payload) {
      state.totalGM = payload
    },
  },

  actions: {
    async reset({commit}) {
      commit('SET_RESET')
    },
    async setStatusCode({commit}, value) {
        commit('SET_STATUS_CODE', value)
    },

    async createNewCode({commit}, value) {
      let data = await Gm.newCode(value)
      if (data) {
        commit('SET_GM_CODE', data.code)
      }
      return data
    },

    async validatePubCode({}, value) {
      return await Gm.validatePubCode(value)
    },

    async activateGmCode({commit}, value) {
      return await Gm.activateGmCode(value)
    },

    async refreshGmCode({commit}, value) {
      let data = await Gm.refreshGmCode(value)
      if (data) {
        commit('REFRESH_CODES', data.codes)
      }
      return data
    },

  }
}
