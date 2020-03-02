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
import Blockchain from '@/services/blockchain'

export default {
  namespaced: true,

  state: {
    currencies: [
      {
        ticker: "BTC",
        title: "Bitcoin",
        precision: 8,
        symbol: 'Ƀ'
      },
      {
        ticker: "ETH",
        title: "Ethereum",
        precision: 8,
        symbol: '⬨'
      },
      {
        ticker: "RUB",
        title: "Russian Ruble",
        precision: 2,
        symbol: '₽'
      },
      {
        ticker: "CNY",
        title: "Yuan",
        precision: 2,
        symbol: '¥'
      },
      {
        ticker: "USD",
        title: "Dollars",
        precision: 4,
        symbol: '$'
      },
      {
        ticker: "JPY",
        title: "Japanese Yen",
        precision: 2,
        symbol: '¥'
      },
      {
        ticker: "EUR",
        title: "Euro",
        precision: 4,
        symbol: '€'
      },
      {
        ticker: "GBP",
        title: "Pound Sterling",
        precision: 4,
        symbol: '£'
      },
      {
        ticker: "PLN",
        title: "Polish Zloty",
        precision: 2,
        symbol: 'zł'
      },
      {
        ticker: "TRY",
        title: "Turkish Lira",
        precision: 2,
        symbol: '₺'
      },
      {
        ticker: "MXN",
        title: "Mexican Peso",
        precision: 2,
        symbol: '₱'
      },
      {
        ticker: "BRL",
        title: "Brazil Real",
        precision: 2,
        symbol: 'R$'
      },
      {
        ticker: "NZD",
        title: "New Zeland Dollar",
        precision: 2,
        symbol: 'NZ$'
      },
      {
        ticker: "NOK",
        title: "Norway Krone",
        precision: 2,
        symbol: 'kr'
      },
      {
        ticker: "KRW",
        title: "South Korea Won",
        precision: 2,
        symbol: '₩'
      },
    ],
    marketPrice: {
      "STH": 1,
      "BTC": 0.00000100,
      "ETH": 0,
      "RUB": 0,
      "CNY": 0,
      "USD": 0,
      "JPY": 0,
      "EUR": 0
    },
    defaultCurrency: {
      ticker: 'USD',
      symbol: '$',
      precision: 2
    },
    balance: 0.00,
    txOffset: 0,
    txCount: 0,
    transactions: [],
    depHistory: [],
    depAddrs: {
      "bts": "smartholdem",
      "btc": "",
      "ltc": "",
      "doge": "",
      "post": "",
      "42": "",
      "mdl": "",
      "onion": "",
      "xspec": "",
      "uni": "",
      "cny": "smartholdem",
      "usd": "smartholdem",
      "ruble": "smartholdem",
      "jpy": "smartholdem",
      "evraz": "smartholdem",
      "deex": "smartholdem"
    },
    balances: {
      accounts: [],
      totalBalance: 0,
    }, // obj keys {address, balance}
    currentAddress: '',
    txs: [], // obj key address
    labels: {}, // addresses names labels {address: label}
  },

  getters: {
    currencies: state => state.currencies,
    marketPrice: state => state.marketPrice,
    defaultCurrency: state => state.defaultCurrency,
    balance: state => state.balance,
    txOffset: state => state.txOffset,
    txCount: state => state.txCount,
    transactions: state => state.transactions,
    depHistory: state => state.depHistory,
    depAddrs: state => state.depAddrs,
    balances: state => state.balances,
    currentAddress: state => state.currentAddress,
    txs: state => state.txs,
    labels: state => state.labels,
  },

  mutations: {
    SET_DEFAULT_CURRENCY(state, payload) {
      state.defaultCurrency = payload
    },
    SET_STH_MARKET(state, payload) {
      state.marketPrice = payload
    },
    SET_WALLET_RESET(state) {
      state.balance = 0.00
      state.txOffset = 0
      state.txCount = 0
      state.transactions = []
      state.depHistory = []
      state.depAddrs = {
        "bts": "smartholdem",
        "btc": "",
        "ltc": "",
        "doge": "",
        "post": "",
        "42": "",
        "mdl": "",
        "onion": ""
      }
      state.balances = {
        accounts: [],
        totalBalance: 0,
      }
    },
    SET_DEP_ADDR(state, payload) {
      state.depAddrs[payload.coin] = payload.address
    },
    SET_DEP_HISTORY(state, payload) {
      state.depHistory = payload
    },
    SET_BALANCE(state, payload) {
      state.balance = payload
    },
    SET_TX_OFFSET(state, payload) {
      state.txOffset = payload
    },
    SET_TX_COUNT(state, payload) {
      state.txCount = payload
    },
    SET_TRANSACTIONS(state, payload) {
      state.transactions = payload
    },
    /** NEW **/
    SET_BALANCES(state, payload) {
      state.balances = payload
    },
    SET_CURRENT_ADDRESS(state, payload) {
      state.currentAddress = payload
    },
    SET_TXS(state, payload) {
      state.txs = payload
    },
    SET_LABEL(state, payload) {
      state.labels[payload.address] = payload.label
    },
  },

  actions: {
    setDefaultCurrency({commit}, value) {
      commit('SET_DEFAULT_CURRENCY', value)
    },
    walletReset({commit}) {
      commit('SET_WALLET_RESET', true)
    },
    setDepHistory({commit}, value) {
      commit('SET_DEP_HISTORY', value)
    },
    setBalance({commit}, value) {
      commit('SET_BALANCE', value)
    },
    setTxOffset({commit}, value) {
      commit('SET_TX_OFFSET', value)
    },
    setTxCount({commit}, value) {
      commit('SET_TX_COUNT', value)
    },
    setTransactions({commit}, value) {
      commit('SET_TRANSACTIONS', value)
    },
    async getDepAddress({commit}, value) {
      let address = await this.getters['wallet/depAddrs'][value.coin]
      if (!address) {
        address = await Wallet.getDepAddress(value)
        if (address) {
          commit('SET_DEP_ADDR', {
            coin: value.coin,
            address: address
          })
        }
      }
      return address
    },
    async getSthMarket({commit}, value) {
      const data = await Wallet.getSthMarket(value)
      if (!data) return
      commit('SET_STH_MARKET', data)
    },
    async sendTx({commit}, value) {
      return (await Wallet.sendTx(value))
    },
    async prepareTx({commit}, value) {
      return await Wallet.prepareTx(value)
    },
    async broadcastTx({commit}, value) {
      return await Wallet.broadcastTx(value)
    },
    async refreshBalance({commit}) {
      /*
      if (!this.getters['app/account']['address']) return
      const data = await Wallet.fetchBalance(this.getters['app/account']['address'])
      //if (!data) return
      commit('SET_BALANCE', data);
      */
    },
    async fetchTransactions({commit}) {
      /*
      if (!this.getters['app/account']['address']) return
      const data = await Wallet.fetchTransactions(this.getters['app/account']['address'], this.getters['wallet/txOffset'])
      if (!data) return
      commit('SET_TRANSACTIONS', data.transactions)
      commit('SET_TX_COUNT', data.count)
      commit('SET_TX_OFFSET', data.offset)
      //  commit('SET_TX_OFFSET', 0)
      */
    },
    async getTransaction({commit}, value) {
      return await Wallet.getTransaction(value)
    },

    /** NEW **/
    async getBalances({commit}) {
      const accounts = await this.getters['app/accounts']
      let keys = Object.keys(accounts)
      if (keys.length > 0) {
        const data = await Blockchain.getBalances(accounts)
        if (data) {
          commit('SET_BALANCES', data)
        }
      }
    },
    async setCurrentAddress({commit}, value) {
      if (value) {
        commit('SET_CURRENT_ADDRESS', value)
      }
    },
    async getTxsByAddress({commit}, offset = 0) {
      const currentAddress = this.getters['wallet/currentAddress']
      if (!currentAddress) {
        return
      }
      const data = await Blockchain.fetchTxsByAddress(currentAddress, offset)
      if (!data) return
      if (data) {
        commit('SET_TXS', data)
      }
    },
    async setLabel({commit}, value) {
      if (value) {
        commit('SET_LABEL', value)
      }
    },
    async validateAddress({commit}, value) {
      return await Wallet.validateAddress(value)
    },
    async prepareTxNative({commit}, value) {
      return await Wallet.prepareTxNative(value)
    },
    async broadcastTxNative({commit}, value) {
      const seed = this.getters['network/seed']
      return await Wallet.broadcastTxNative(value, seed.url)
    },
    async TxVote({commit}, value) {
      // add + or -
      const seed = this.getters['network/seed']
      const tx = await Wallet.createVoteTransaction(value.secret, [value.vote], value.secondSecret || null)
      return await Wallet.broadcastTxNative(tx, seed.url)
    },
    async TxDelegateRegister({commit}, value) {
      const seed = this.getters['network/seed']
      const tx = await Wallet.createDelegateTransaction(value.secret, value.name, value.secondSecret || null)
      return await Wallet.broadcastTxNative(tx, seed.url)
    },
  }
}
