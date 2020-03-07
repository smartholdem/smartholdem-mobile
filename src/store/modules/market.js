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

import Market from '@/services/market'

export default {
  namespaced: true,

  state: {
    priceHistory: {
      day: {
        values: [],
        labels: [],
      },
      week: {
        values: [],
        labels: [],
      },
      month: {
        values: [],
        labels: [],
      },
      min: 100,
      max: 0
    },
    chartData: {},
  },

  getters: {
    priceHistory: state => state.priceHistory,
    chartData: state => state.chartData,
  },

  mutations: {
    SET_PRICE_HISTORY(state, payload) {
      state.priceHistory = payload
    },
    SET_CHART_DATA(state, payload) {
      state.chartData = payload
    },
  },

  actions: {
    async getPriceChart({commit}) {
        //const data = await Market.getPriceChart()
        //commit('SET_CHART_DATA', data)
    },
  }
}
