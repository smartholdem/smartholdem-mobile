/*
 * Copyright (c) 2019 TechnoL0g.
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

import SmartHolder from '@/services/smartholder'

export default {
  namespaced: true,

  state: {
    holders: {
      total: {
        bonusesAmount: "",
        holders: 10,
        realAmount: ""
      },
      holders: []
    },
    assetsPay: [],
    assetsNoq: [],
    reports: [],
    latestReport: 0
  },

  getters: {
    holders: state => state.holders,
    assetsPay: state => state.assetsPay,
    assetsNoq: state => state.assetsNoq,
    reports: state => state.reports,
    latestReport: state => state.latestReport,
  },

  mutations: {
    async SET_HOLDERS(state, payload) {
      state.holders = payload
    },
    async SET_ASSETS_PAY(state, payload) {
      state.assetsPay = payload
    },
    async SET_ASSETS_NOQ(state, payload) {
      state.assetsNoq = payload
    },
    async SET_REPORTS(state, payload) {
      state.reports = payload
    },
    async SET_LATEST_REPORT(state, payload) {
      state.latestReport = payload
    },
  },

  actions: {
    async getHolders({commit}) {
      const data = await SmartHolder.getHolders()
      if (!data) return
      commit('SET_HOLDERS', data);
    },
    async getAssetsPay({commit}) {
      const data = await SmartHolder.getAssetsPay()
      if (!data) return
      commit('SET_ASSETS_PAY', data);
    },
    async getAssetsNoq({commit}) {
      const data = await SmartHolder.getAssetsNoq()
      if (!data) return
      commit('SET_ASSETS_NOQ', data);
    },
    async setLatestReport({commit}, value) {
      commit('SET_LATEST_REPORT', data);
    },
    async latestReportCountRemote() {
      return await SmartHolder.latestReportCountRemote()
    },
    async fetchLatestReports({commit}) {
      const result = await SmartHolder.fetchLatestReports()
      if (!result) return
      commit('SET_REPORTS', result)
    }
  }
}
