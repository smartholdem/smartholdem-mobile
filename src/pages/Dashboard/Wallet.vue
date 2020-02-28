<template>
  <div>
    <div class="row">

      <div class="w-100 hide-scroll" style="overflow-x:auto;">

        <div :style="'width:'+(360*wallets.length) + 'px;'">

      <card v-for="item in wallets" :key="item.address" class="ml-2 mr-2 bgg1" style="width:340px; float:left; color:#fff;height: 100px;-webkit-app-region: drag;background: linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(46,15,31,1) 21%, rgba(255,0,121,1) 100%);">
        <router-link :to="'/address/' + item.address" class="text-white">
        {{item.balance}}
        <br><span v-if="item.delegate"><i class="tim-icons icon-bank pb-1"></i> {{item.delegate.username}}</span><span v-if="!item.delegate">{{item.address}}</span>
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
      for (let i = 0; i < keys.length; i++) {
        balances.accounts[keys[i]].label = this.getLabel(keys[i])
        result.push(balances.accounts[keys[i]])
      }
      return result
    },
  },
  methods: {
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

  .bgg1 {
    background: rgb(2,0,36);
    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(69,9,121,1) 35%, rgba(0,212,255,1) 100%);
  }
</style>
