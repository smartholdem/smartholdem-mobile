import axios from 'axios'
import {network} from '@/config'
import moment from "moment/moment";


class Blockchain {

  async findPeers() {

  }

  async getDelegates(offset = 0) {
    let result = {
      list: [],
      count: 0,
    };
    try {
      const data = (await axios.get('https://' + network.NODE + '/api/delegates?limit=64&offset=' + offset)).data;
      result = {
        list: data.delegates,
        count: data.totalCount,
      }
    } catch (e) {
      console.log(e);
    }
    return result
  }

  async getStatus() {
    let result = {
      "epoch": "2017-11-21T13:00:00.000Z",
      "height": 835759,
      "fee": 10000000,
      "milestone": 0,
      "nethash": "fc46bfaf9379121dd6b09f5014595c7b7bd52a0a6d57c5aff790b42a73c76da7",
      "reward": 200000000,
      "supply": 24167151800000000
    };
    try {
      const data = (await axios.get('https://' + network.NODE + '/api/blocks/getStatus')).data;
      result.height = data.height;
      result.supply = (data.supply / 10 ** 8);
      result.fee = (data.fee / 10 ** 8).toFixed(2);
      result.reward = (data.reward / 10 ** 8).toFixed(2);

      const dataTx = (await axios.get('https://' + network.NODE + '/api/transactions?limit=1&orderBy=timestamp:desc')).data;
      result.txCount = dataTx.count
    } catch (e) {

    }
    return result
  }

  async getAddressBalance(address) {
    let result = 0;
    try {
      const data = (await axios.get('https://' + network.NODE + '/api/accounts/getBalance?address=' + address)).data;
      result = data.balance / 10 ** 8
    } catch (e) {

    }
    return result
  }

  async getVote(address) {
    let result = null;
    try {
      const data = (await axios.get('https://' + network.NODE + '/api/accounts/delegates?address=' + address)).data;
      if (data.delegates.length > 0) {
        result = data.delegates[0]
      }
    } catch (e) {

    }
    return result
  }

  async getBalances(addresses) {
    let result = {
      accounts: [],
      totalBalance: 0
    };
    let keys = Object.keys(addresses);
    let total = 0;
    for (let i = 0; i < keys.length; i++) {
      let balance = await this.getAddressBalance(keys[i]);
      let vote = await this.getVote(keys[i]);
      let delegate = null;
      if (addresses[keys[i]].pubKey) {
        delegate = await this.getDelegate(addresses[keys[i]].pubKey) || null
      }

      result.accounts[keys[i]] = {
        address: addresses[keys[i]].address,
        balance: balance,
        vote: vote,
        delegate: delegate
      };
      total = total + balance
    }
    result.totalBalance = total;
    return result
  }


  async fetchTxsByAddress(address, offset = 0) {
    const limit = 25;
    const uri = 'https://' + network.NODE + '/api/transactions?orderBy=timestamp:desc&offset=' + offset + '&limit=' + limit + '&recipientId=' + address + '&senderId=' + address
    const response = (await axios.get(uri)).data;

    if (response.success) {
      let result = {
        count: 0,
        transactions: []
      };

      let txs = [];

      //console.log('response', response)

      for (let i = 0; i < response.transactions.length; i++) {
        //if (response.transactions[i].type === 0) {
          let op = response.transactions[i].recipientId === address ? '+' : '-';
          let tm = moment.unix((1511269200 + response.transactions[i].timestamp));
          let amount = response.transactions[i].amount > 0 ? response.transactions[i].amount / 10 ** 8 : 0;
          if (response.transactions[i].type === 3) {
            op = '-'
          }
          if (op === '-') {
            amount = amount + (response.transactions[i].fee / 10 ** 8)
          }

          txs.push({
            id: response.transactions[i].id,
            confirmations: response.transactions[i].confirmations,
            time: tm.format("YYYY.MM.DD HH:mm:ss"),
            amount: op + (amount).toFixed(2) * 1,
            senderId: response.transactions[i].senderId,
            recipientId: response.transactions[i].recipientId,
            vendorField: response.transactions[i].vendorField,
            type: response.transactions[i].type,
            asset: response.transactions[i].asset,
            op: op,
          })
        //}
      }
      result.count = response.count * 1
      result.transactions = txs
      return result

    }
  }

  async getAccount(address) {
    let result = {
      balance: 0,
      delegate: null
    }
    try {
      const data = (await axios.get('https://' + network.NODE + '/api/accounts?address=' + address)).data

      if (data.success) {
        result = data.account
        result.balance = data.account.balance / 10 ** 8
        result.delegate = await this.getDelegate(result.publicKey) || null
        result.vote = await this.getVote(result.address) || null
      }
    } catch (e) {

    }
    return result
  }

  async getDelegate(pubKey) {
    let result = {}
    try {
      const data = (await axios.get('https://' + network.NODE + '/api/delegates/get?publicKey=' + pubKey)).data
      result = data.delegate
      result.vote = data.delegate.vote / 10 ** 8
    } catch (e) {

    }
    return result
  }

  async delegateSearch(name) {
    let result = {}
    try {
      const data = (await axios.get('https://' + network.NODE + '/api/delegates/search?q=' + name)).data
      result = data.delegates
    } catch (e) {

    }
    return result
  }

  async getFees() {
    let result = {}
    try {
      const data = (await axios.get('https://' + network.NODE + '/api/blocks/getFees')).data
      result = data.fees
      result.send = data.fees.send / 10 ** 8
      result.vote = data.fees.vote / 10 ** 8
      result.secondsignature = data.fees.secondsignature / 10 ** 8
      result.delegate = data.fees.delegate / 10 ** 8
      result.multisignature = data.fees.multisignature / 10 ** 8
    } catch (e) {

    }
    return result
  }

  async xbtsCandidates() {
    let result = []
    try {
      const data = (await axios.get(network.XBTS_VOTE + 'list/candidates')).data
      result = data
    } catch (e) {

    }
    return result
  }

  async xbtsWinners() {
    let result = []
    try {
      const data = (await axios.get(network.XBTS_VOTE + 'list/winners')).data
      result = data
    } catch (e) {

    }
    return result
  }

}

export default new Blockchain()
