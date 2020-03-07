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

import Wallet from '@/services/wallet'
import Network from '@/services/network'

export default {
  namespaced: true,

  state: {
    bestPeer: {
      ip: '80.211.220.200',
      port: 6100,
      delay: 6
    },
    seed: {
      url: 'node0.smartholdem.io',
      delay: 0
    },
  },

  getters: {
    bestPeer: state => state.bestPeer,
    seed: state => state.seed
  },

  mutations: {
    SET_BEST_PEER(state, payload) {
      state.bestPeer = payload
    },
    SET_SEED(state, payload) {
      state.seed = payload
    }
  },

  actions: {
    async getBestPeer({commit}) {
      const bestPeer = await Wallet.getBestPeer()
      if (!bestPeer) {
        return
      }
      commit('SET_BEST_PEER', bestPeer)
      return bestPeer
    },
    async getSeed({commit}) {
      const seed = await Network.networkInit()
      if (!seed) {
        return
      }
      commit('SET_SEED', seed)
    },
  }
}
