import {network, exchange} from '@/config'
import smartholdemApi from 'sthjs-wrapper'
import moment from 'moment'
import axios from 'axios'

const sthJs = require('sthjs')
const crypto = require('crypto')

//console.log('network.NODE', network.NODE)

/*
async function netInit() {
  try {
    const hash = (await axios.get('https://'+network.NODE+'/api/blocks/getNetHash')).data
    if (hash) {
      await smartholdemApi.setPreferredNode(network.NODE); // default node
      await smartholdemApi.init('main'); //main or dev
    } else {
      console.log('err:reinit')
      await smartholdemApi.init('main'); //main or dev
    }

  } catch(e) {
    await smartholdemApi.init('main'); //main or dev
  }
}

netInit()
*/

class Wallet {

  async getSthMarket() {
    const currencies = ['BTC', 'ETH', 'RUB', 'CNY', 'USD', 'JPY', 'EUR', 'GBP', 'PLN', 'TRY', 'MXN', 'BRL', 'NZD', 'NOK', 'KRW']
    const markets = currencies.join(',')
    const url = 'https://api.coinpaprika.com/v1/tickers/sth-smartholdem?quotes=' + markets
    try {
      const result = (await axios.get(url)).data
      const preparedData = {
        "STH": 1,
        "BTC": result.quotes.BTC ? result.quotes.BTC.price.toFixed(8) * 1 : 0,
        "ETH": result.quotes.ETH ? result.quotes.ETH.price.toFixed(8) * 1 : 0,
        "RUB": result.quotes.RUB ? result.quotes.RUB.price.toFixed(3) * 1 : 0,
        "CNY": result.quotes.CNY ? result.quotes.CNY.price.toFixed(4) * 1 : 0,
        "USD": result.quotes.USD ? result.quotes.USD.price.toFixed(5) * 1 : 0,
        "JPY": result.quotes.JPY ? result.quotes.JPY.price.toFixed(5) * 1 : 0,
        "EUR": result.quotes.EUR ? result.quotes.EUR.price.toFixed(5) * 1 : 0,
        "GBP": result.quotes.GBP ? result.quotes.GBP.price.toFixed(5) * 1 : 0,
        "PLN": result.quotes.PLN ? result.quotes.PLN.price.toFixed(5) * 1 : 0,
        "TRY": result.quotes.TRY ? result.quotes.TRY.price.toFixed(5) * 1 : 0,
        "MXN": result.quotes.MXN ? result.quotes.MXN.price.toFixed(5) * 1 : 0,
        "BRL": result.quotes.BRL ? result.quotes.BRL.price.toFixed(5) * 1 : 0,
        "NZD": result.quotes.NZD ? result.quotes.NZD.price.toFixed(5) * 1 : 0,
        "NOK": result.quotes.NOK ? result.quotes.NOK.price.toFixed(5) * 1 : 0,
        "KRW": result.quotes.KRW ? result.quotes.KRW.price.toFixed(5) * 1 : 0,
      }
      // console.log(preparedData)
      return preparedData
    } catch (e) {
      return null
    }
  }

  async networkInit(ip) {
    smartholdemApi.setPreferredNode(ip); // default node
    smartholdemApi.init('main'); //main or dev
  }

  async getPeers() {
    smartholdemApi.setPreferredNode(network.NODE); // default node
    smartholdemApi.init('main'); //main or dev
    return new Promise((resolve, reject) => {
      smartholdemApi.getPeersList((error, success, response) => {
        if (error) {
          reject(null)
        } else {
          resolve(response.peers)
        }
      })
    })
  }

  async getBestPeer() {
    const peers = await this.getPeers()
    let availablePeers = []
    for (let i = 0; i < peers.length; i++) {
      if (peers[i].status === 'OK' && peers[i].errors === 0) {
        try {
          const peer = (await axios.get('http://' + peers[i].ip + ':' + peers[i].port + '/api/peers/version')).data
          if (peer.success === true) {
            availablePeers.push({
              ip: peers[i].ip,
              port: peers[i].port,
              delay: peers[i].delay,
            })
          }
        } catch (e) {

        }
      }
    }

    let ping = 1000
    let bestPeer = {}
    for (let i = 0; i < availablePeers.length; i++) {
      if (availablePeers[i].delay < ping) {
        ping = availablePeers[i].delay
        bestPeer = availablePeers[i]
      }
    }

    await this.networkInit(bestPeer.ip)
    return bestPeer
  }

  async getDepAddress(options) {
    let result = null;
    let versions = {
      "btc": exchange.VERSION,
      "doge": exchange.VERSION,
      "ltc": exchange.VERSION,
      "dash": exchange.VERSION,
      "post": exchange.VERSION,
      "btg": exchange.VERSION,
    };
    let versionURL = versions[options.coin] ? exchange.VERSION : ''; // до полного обновления апи использовать версионность
    try {
      result = (await axios.get(exchange.API + versionURL + '/' + options.coin + '/deposit-address/' + options.recipientId)).data.address
    } catch (e) {
      result = null
    }
    return result
  }

  /**
   * secret
   * recipient
   * amount
   * msg - optional
   *
   * @param options
   * @returns {Promise<void>}
   */

  async prepareTx(options) {
    const msg = options.msg ? options.msg : null
    const tx = smartholdemApi.createTransaction(
      options.secret,
      options.recipient,
      (options.amount * Math.pow(10, 8)).toPrecision(20).split('.')[0] * 1,
      {vendorField: msg}
    )
    return tx
  }

  async broadcastTx(tx) {
    let result = new Promise((resolve, reject) => {
      smartholdemApi.sendTransactions([tx], (error, success, response) => {
        if (response.success && !error && response.transactionIds) {
          resolve(response.transactionIds[0])
        }
        reject(null)
      })
    })
    return result
  }

  async sendTx(options) {

    /*
        var vendorField, secondPassphrase = null
        var version = 0x3f
        var fee = 100000000
        vendorField = options.msg ? options.msg : null
        console.log('options',options)
        var transaction = sth.transaction.createTransaction(options.recipient, (options.amount * Math.pow(10, 8)), vendorField, options.secret, secondPassphrase, version, fee);
        console.log('transaction',transaction)
    */


    const tx = smartholdemApi.createTransaction(
      options.secret,
      options.recipient,
      (options.amount * Math.pow(10, 8)).toPrecision(20).split('.')[0] * 1,
      {vendorField: options.msg}
    )
    return new Promise((resolve, reject) => {
      smartholdemApi.sendTransactions([tx], (error, success, response) => {
        if (response.success && !error && response.transactionIds) {
          resolve(response.transactionIds[0])
        } else {
          reject(null)
        }
      })
    })
  }

  async fetchBalance(address) {
    return new Promise((resolve, reject) => {
      smartholdemApi.getBalance(address, (error, success, response) => {
        if (success) {
          const balance = (response.balance / 10 ** 8).toFixed(2) * 1
          // console.log(balance)
          resolve(balance)
        } else {
          reject(0)
        }
      })
    })
  }

  async getTransaction(txId) {
    return new Promise((resolve, reject) => {
      smartholdemApi.getTransaction(txId, (error, success, response) => {
        if (!error) {
          resolve(response.transaction)
        } else {
          reject(false)
        }
      })
    })
  }

  async fetchTransactions(address, offset) {
    // console.log('fetchTransactions', offset)

    const limit = 25
    const uri = 'https://' + network.NODE + '/api/transactions?orderBy=timestamp:desc&offset=' + offset + '&limit=' + limit + '&recipientId=' + address + '&senderId=' + address
    //  console.log(uri)
    const response = (await axios.get(uri)).data

    if (response.success) {
      let result = {
        count: 0,
        offset: offset,
        transactions: []
      }

      let txs = []

      for (let i = 0; i < response.transactions.length; i++) {
        let op = response.transactions[i].recipientId === address ? '+' : '-'
        let tm = moment.unix((1511269200 + response.transactions[i].timestamp))
        let amount = response.transactions[i].amount / 10 ** 8
        if (op === '-') {
          amount = amount + (response.transactions[i].fee / 10 ** 8)
        }
        // console.log(amount)
        txs.push({
          id: response.transactions[i].id,
          confirmations: response.transactions[i].confirmations,
          time: tm.format("YYYY.MM.DD HH:mm:ss"),
          amount: op + (amount).toFixed(2) * 1,
          senderId: response.transactions[i].senderId,
          recipientId: response.transactions[i].recipientId,
          vendorField: response.transactions[i].vendorField,
          op: op
        })
      }
      result.offset = 0 // offset + txs.length
      result.count = response.count * 1
      result.transactions = txs
      return result

    }

  }

  async signMessage(message, passphrase) {
    let hash = crypto.createHash('sha256')
    hash = hash.update(Buffer.from(message, 'utf-8')).digest()
    const ecpair = sthJs.crypto.getKeys(passphrase)
    return ({signature: ecpair.sign(hash).toDER().toString('hex')}) // return obj.signature
  }

  async verifyMessage(message, publicKey, signature) {
    // check for hexadecimal, otherwise the signature check would may fail
    const re = /[0-9A-Fa-f]{6}/g
    if (!re.test(publicKey) || !re.test(signature)) {
      // return here already because the process will fail otherwise
      return false
    }
    let hash = crypto.createHash('sha256')
    hash = hash.update(Buffer.from(message, 'utf-8')).digest()
    const ecpair = sthJs.ECPair.fromPublicKeyBuffer(Buffer.from(publicKey, 'hex'))
    const ecsignature = sthJs.ECSignature.fromDER(Buffer.from(signature, 'hex'))
    return (ecpair.verify(hash, ecsignature))
  }

  /** NEW **/

  async validateAddress(address) {
    return sthJs.crypto.validateAddress(address)
  }

  async prepareTxNative(options) {
    let vendorField, secondPassphrase = null
    let version = 0x3f
    let fee = 100000000
    vendorField = options.memo ? options.memo : null
    return sthJs.transaction.createTransaction(options.recipient, (options.amount * Math.pow(10, 8)).toPrecision(21).split('.')[0] * 1, vendorField, options.secret, secondPassphrase, version, fee)
  }

  async createVoteTransaction(passPhrase, votes, secondPass){
    return sthJs.vote.createVote(passPhrase, votes, secondPass)
  }

  async broadcastTxNative(tx, seed) {
    let result = {
      success: false,
      transactionIds: [],
    }
    try {
      const data = await axios.post('https://' + seed + '/peer/transactions', {transactions: [tx]}, {
          headers: {
            "Content-Type": "application/json",
            "os": "sth-client",
            "version": "0.6.0",
            "nethash": 'fc46bfaf9379121dd6b09f5014595c7b7bd52a0a6d57c5aff790b42a73c76da7',
            "port": 1
          },
        }
      )
      result = data.data
    } catch (e) {
      //console.log('broadcast err', e)
      result.success = false
    }
    return result
  }

  async createDelegateTransaction(passPhrase, delegateName, secondPass) {
    return sthJs.delegate.createDelegate(passPhrase, delegateName, secondPass);
  }

}

export default new Wallet()
