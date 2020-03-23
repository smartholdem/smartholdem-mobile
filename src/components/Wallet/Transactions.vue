<template>
  <div class="table-full-width shadow-none " style="margin-bottom: 0px; box-shadow: none !important;">

    <!-- tx mobile devices -->
    <div v-if="!txs.transactions.length" class="text-center">No Transactions</div>
    <table class="table">
      <tr v-for="(item, idx) in txs.transactions" :key="idx">
        <td style="border-top: none; border-bottom: solid 1px #555;">
          <span v-show="item.op === '-'" class="badge badge-danger big-badge">{{item.amount}} STH</span>
          <span v-show="item.op === '+'" class="badge badge-success big-badge">{{item.amount}} STH</span>
          <el-tooltip
            :content="mixval.copied"
            v-clipboard:success="clipboardSuccess"
            v-clipboard:copy="item.id"
            effect="light"
            :open-delay="300"
            placement="top"
          >
            <span class="float-right badge badge-secondary  big-badge pointer"><i
              class="tim-icons icon-single-copy-04"></i></span>
          </el-tooltip>
          <br/>Tx <span class="small font-weight-normal">{{item.id.substr(0, 10)}}...{{item.id.substr(-10)}}</span>
          <br/>
          <span class="truncate">{{$t('WALLET.CONF')}}
          <span v-if="item.confirmations < 64">{{item.confirmations}}</span>
          <span v-if="item.confirmations > 64">64+</span>
        </span>
          <br/><span class="truncate">{{item.time}}</span>
          <br/><span class="small font-weight-normal">From {{item.senderId}}</span>
          <br/><span class="small font-weight-normal">To {{item.recipientId}}</span>
        </td>
      </tr>
    </table>

  </div>
</template>

<script>
import {Table, TableColumn} from 'element-ui'
import eventBus from '@/plugins/event-bus'

export default {
  name: "Transactions",
  data() {
    return {
      unconfirmed: [],
      timerUpTx: null,
      timerPeriodic: null,
      transactions: [],
      notified: null,
    }
  },
  props: {
    address: '',
    type: String
  },
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  methods: {
    async startUpdate() {
      clearTimeout(this.timerUpTx);
      let timeStop = true
      this.timerUpTx = setTimeout(async () => {
        await this.$store.dispatch('wallet/getTxsByAddress')
        for (let i = 0; i < this.txs.transactions.length; i++) {
          if (this.txs.transactions[i].confirmations < 64) {
            timeStop = false
            if ((this.settingsData).notify) {
              this.notifyTx(this.txs.transactions[i].id, this.txs.transactions[i].confirmations)
            }
            break
          }
        }
        if (timeStop) {
          clearTimeout(this.timerUpTx);
        } else {
          await this.$store.dispatch('wallet/getTxsByAddress')
          await this.startUpdate()
        }
      }, 11000)
    },
    removeUtx(idx) {
      this.unconfirmed.splice(idx, 1)
    },
    notifyTx(txId, confirmations) {
      if (this.notified !== txId) {
        if (confirmations < 64) {
          this.notified = txId
          eventBus.emit('notify:txin', txId)
        }
      }
    }
  },
  computed: {
    settingsData() {
      return this.$store.getters['app/settings']
    },
    txs() {
      let result = {
        count: 0,
        transactions: []
      }
      const txsData = this.$store.getters['wallet/txs']
      if (txsData.transactions) {
        result.count = txsData.count
        for (let i = 0; i < this.unconfirmed.length; i++) {
          let remove = false
          for (let j = 0; j < txsData.transactions.length; j++) {
            if (txsData.transactions[j].id === this.unconfirmed[i].id) {
              remove = true
              this.removeUtx(i)
              break
            }
          }
          if (!remove) {
            result.transactions.push(this.unconfirmed[i])
          }
        }
        for (let i = 0; i < txsData.transactions.length; i++) {
          result.transactions.push(txsData.transactions[i])
        }
      }
      //console.log(result)
      return result
    },
  },
  async created() {
    await this.$store.dispatch('wallet/getTxsByAddress')

    this.$eventBus.on('addtx:unconfirmed', async (data) => {
      this.unconfirmed.push(data)
      await this.startUpdate()
    })
    await this.startUpdate()
    clearInterval(this.timerPeriodic)
    this.timerPeriodic = setInterval(async () => {
      await this.startUpdate()
      await this.$store.dispatch('wallet/getBalances')
    }, 30000)
  },
}
</script>

<style scoped>

</style>
