<template>
  <div>
    <div class="row">
      <div class="text-center ml-auto mr-auto">
        <base-dropdown
          tag="li"
          :menu-on-right="!$rtl.isRTL"
          title-tag="a"
          title-classes="nav-link"
          class="navbar-brand currency-balance"
        >
          <template
            slot="title"
            style="color: rgb(9, 223, 251) !important;"
          >

            <el-tooltip
              :visible-arrow="false"
              :content="'1 ' + defaultCurrency.ticker + ' = ' + (1 / prices[defaultCurrency.ticker]).toFixed(2) + ' STH'"
              :open-delay="300"
              placement="bottom"
            >
            <span class="text-decoration-none font-weight-normal" style="">Total <img src="images/sth48.png"
                                                                                      width="20px"/> {{accountBalanceSTH}} <small
              class="color-brown font-weight-bold"> </small>
              <span
                style="font-size: 0.9em;color: lightslategray;border: solid 1px lightslategray;"
                class="badge badge-white font-weight-normal">{{defaultCurrency.symbol}}{{accountBalance}}</span></span>
            </el-tooltip>
          </template>

          <li class="nav-link bg-white" v-for="(item, idx) in currencies" :key="idx">
            <span @click="setDefaultCurrency(item.ticker, item.symbol, item.precision)" class="nav-item dropdown-item">{{item.title}} {{item.symbol}}</span>
          </li>
        </base-dropdown>
      </div>

      <div class="w-100 hide-scroll" style="overflow-x:auto;">
        <div v-if="wallets.length < 1" class="text-center">
          <p>No Wallets</p>

          <div class="col-md-12">
          <base-button @click="openRouter('/wallet-create')" type="primary" round simple class="w-100 text-uppercase font-weight-bolder" style="">
            <i class="tim-icons icon-credit-card pb-1 mr-2" style="font-size: 1rem;"></i> Create New Wallet
          </base-button>

          <p>- OR -</p>

          <base-button @click="openRouter('/wallet-import')" type="primary" round simple class="w-100 text-uppercase font-weight-bolder" style="">
            <i class="tim-icons icon-refresh-01 pb-1 mr-2"></i>Import Wallet
          </base-button>
          </div>
        </div>


        <div :style="'width:'+(360*wallets.length) + 'px;'">
          <card v-for="item in wallets" :key="item.address" class="ml-2 mr-2 account-style bgg1">
            <router-link :to="'/address/' + item.address" class="text-white">
              <span v-if="!item.delegate && item.label"><i class="tim-icons icon-tag pb-1"></i> {{item.label}}</span>
              <span v-if="item.delegate"><i class="tim-icons icon-bank pb-1"></i> {{item.delegate.username}}</span>
              <br>{{item.balance}} STH
              <br>
              <span v-if="!item.delegate">{{item.address}}</span>

            </router-link>
          </card>
        </div>
      </div>

    </div>


      <BotBtnWlt/>


  </div>
</template>

<script>

import {Table, TableColumn} from 'element-ui';
import BotBtnWlt from '@/components/Mobile/BotBtnWlt'
import eventBus from '@/plugins/event-bus'

export default {
  name: "Wallet",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    BotBtnWlt,
  },
  data() {
    return {
      showActions: false,
      tableData: []
    };
  },
  computed: {
    wallets() {
      let result = []
      let balances = (this.$store.getters['wallet/balances'])
      let keys = Object.keys(balances.accounts)
      if (keys.length > 0) {
        for (let i = 0; i < keys.length; i++) {
          balances.accounts[keys[i]].label = this.getLabel(keys[i])
          result.push(balances.accounts[keys[i]])
        }
      }
      return result
    },
    accountBalanceSTH() {
      let balances = this.$store.getters['wallet/balances']
      return (balances.totalBalance).toFixed(2)
    },
    currencies() {
      return this.$store.getters['wallet/currencies']
    },
    defaultCurrency() {
      return this.$store.getters['wallet/defaultCurrency']
    },
    prices() {
      return this.$store.getters['wallet/marketPrice']
    },
    accountBalance() {
      return (this.accountBalanceSTH * this.prices[this.defaultCurrency.ticker]).toFixed(this.defaultCurrency.precision)
    },
  },
  methods: {
    openRouter(url){
      if (!this.$root.pin) {
        eventBus.emit('modal:unlock')
      } else {
        this.$router.push({path: url})
      }
      this.showActions = false
    },
    async setDefaultCurrency(ticker, symbol, precision) {
      await this.$store.dispatch('wallet/setDefaultCurrency', {
        ticker: ticker,
        symbol: symbol,
        precision: precision
      })
    },
    getLabel(address) {
      return this.$store.getters['wallet/labels'][address]
    },
    async showModalLabel(address) {
      eventBus.emit('modal:label', address)
    },
    async showModalVote(data) {
      eventBus.emit('modal:vote', data)
    },
    async removeAddress(key) {
      let accounts = await this.$store.getters['app/accounts']
      delete accounts[key]
      await this.$store.dispatch('app/updateAccounts', accounts)
      await this.$store.dispatch('wallet/getBalances')
    },
  },
  async created() {
    await this.$store.dispatch('wallet/getBalances')
    /*
    this.$eventBus.on('app-isonline', (data) => {
      this.isOnline = data
      this.$root.isOnline = data
    })
    */
  }
}
</script>

<style>
  .hide-scroll::-webkit-scrollbar {
    display: none !important;
  }

  .account-style {
    width: 340px;
    float: left;
    color: #fff;
    height: 100px;
    -webkit-app-region: drag;
  }

  .bgg0 {
    background: rgb(2, 0, 36);
    background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(69, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%);
  }

  .bgg1 {
    background: rgb(131, 58, 180);
    background: linear-gradient(36deg, rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%) !important;
  }

  .currency-balance .dropdown-menu {
    max-height: 70vh !important;
    overflow-y: auto;
  }

  .dropdown-menu span:hover {
    color: #000 !important;
  }

  .dropdown-menu .dropdown-item, .bootstrap-select .dropdown-menu.inner li a {
    margin: 0 !important;
  }

  .currency-balance .nav-link {
    display: block;
  }

  .currency-balance {
    padding-top: 8px !important;
  }
</style>
