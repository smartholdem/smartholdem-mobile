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

import i18n from '@/i18n'
import CryptoJS from 'crypto-js'
import Blockchain from '@/services/blockchain'

export default {
  namespaced: true,

  state: {
    isWelcome: true,
    profiles: [],
    language: 'en',
    pinEncrypted: null, // encrypted hash
    settings: {
      sound: false,
      darkMode: false,
      lockAfter: 300,
    },
    accounts: [], // здесь будем хранить много адресов ключ = address > SHA384 > AES,
    contacts: {}, // contact list
  },

  getters: {
    isWelcome: state => state.isWelcome,
    profiles: state => state.profiles,
    language: state => state.language,
    pinEncrypted: state => state.pinEncrypted,
    settings: state => state.settings,
    accounts: state => state.accounts,
    contacts: state => state.contacts,
  },

  mutations: {
    SET_WELCOME (state, payload) {
      state.isWelcome = payload
    },
    SET_PROFILE (state, payload) {
      state.profiles.push(payload)
    },
    SET_SETTINGS (state, payload) {
      state.settings = payload
    },
    SET_RESET (state) {
      state.language = 'en'
      state.pinEncrypted = null
      state.accounts = []
    },
    SET_LANGUAGE (state, payload) {
      state.language = payload
    },
    SET_PIN_ENC (state, payload) {
      // полученный хэш шифруем тем же хэшем
      const hash = CryptoJS.SHA384(payload).toString()
      state.pinEncrypted = (CryptoJS.AES.encrypt(hash, hash)).toString() // msg, key
    },
    SET_ACCOUNT (state, payload) {
      //const hashPin = CryptoJS.SHA384(payload.pin).toString()
      const hashPin = payload.pin
      state.accounts[payload.address] = {
        address: payload.address,
        secret: (CryptoJS.AES.encrypt(payload.secret, hashPin)).toString(),
        pubKey: payload.pubKey,
      }
    },
    UPD_ACCOUNTS(state, payload) {
      state.accounts = payload
    },
    SET_CONTACT(state, payload) {
      state.contacts[payload.address] = payload
    },
    UPD_CONTACTS(state, payload) {
      state.contacts = payload
    },
  },

  actions: {
    async setIsWelcome ({ commit }, value) {
      commit('SET_WELCOME', value)
    },
    async setProfile ({ commit }, value) {
      commit('SET_PROFILE', value)
    },
    async setSettings ({ commit }, value) {
      commit('SET_SETTINGS', value)
    },
    appReset ({ commit }) {
      commit('SET_RESET')
    },
    setLanguage ({ commit }, value) {
      commit('SET_LANGUAGE', value)
      i18n.locale = value
    },
    setPinEnc ({ commit }, value) {
      commit('SET_PIN_ENC', value)
    },
    setAccount ({ commit }, value) {
      commit('SET_ACCOUNT', value)
    },
    async updateAccounts({ commit }, value) {
      commit('UPD_ACCOUNTS', value)
    },
    async walletDecrypt({ commit }, value) {
      //let currentHashPin = (CryptoJS.SHA384(value.pin)).toString()
      const accounts = await this.getters['app/accounts']
      let accountBytes = CryptoJS.AES.decrypt(accounts[value.address].secret.toString(), value.pin)
      return accountBytes.toString(CryptoJS.enc.Utf8)
    },
    async setContact({commit}, value) {
        commit('SET_CONTACT', {
          address: value.address,
          label: value.label,
          balance: await Blockchain.getAddressBalance(value.address),
        })
    },
    async updateContacts({ commit }, value) {
      commit('UPD_CONTACTS', value)
    },
    async fetchContacts({ commit }) {
      const contacts = await this.getters['app/contacts']
      let result = {}
      let keys = Object.keys(contacts)
      for (let i=0; i < keys.length; i++) {
        result[keys[i]] = {
          address: contacts[keys[i]].address,
          label: contacts[keys[i]].label,
          balance: await Blockchain.getAddressBalance(contacts[keys[i]].address),
        }
      }
      commit('UPD_CONTACTS', result)
    },
    async validatePinCode({ commit }, value) {
        const currentHashPin = (CryptoJS.SHA384(value.toString())).toString()
        const decryptCompare = (CryptoJS.AES.decrypt(this.getters['app/pinEncrypted'], currentHashPin)).toString(CryptoJS.enc.Utf8)
        if (decryptCompare && decryptCompare === currentHashPin) {
          return currentHashPin
        } else {
          return null
        }
    }
  }
}
