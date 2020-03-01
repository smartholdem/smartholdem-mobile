<template>
  <card card-body-classes="table-full-width" style="margin-bottom: 0px;">
    <!--<h4 slot="header" class="card-title">{{$t('WALLET.TRANSACTIONS')}} <span class="font-weight-bold">{{totalTx}}</span></h4>-->

    <!-- tx mobile devices -->
    <table v-if="$root.isMobile" class="table text-darker">
      <tr v-for="(item, idx) in txs.transactions" :key="idx">
        <td style="border-top: none; border-bottom: solid 1px #333;"
            v-clipboard="() => item"
        >
          <span v-show="item.op === '-'" class="badge badge-danger big-badge">{{item.amount}} STH</span>
          <span v-show="item.op === '+'" class="badge badge-success big-badge">{{item.amount}} STH</span>
          <span class="float-right text-info"><i class="tim-icons icon-single-copy-04"></i></span>
          <br/>Tx <span class="small">{{item.id.substr(0, 10)}}...{{item.id.substr(-10)}}</span>
          <br/><span class="truncate">{{$t('WALLET.CONF')}} {{item.confirmations}}</span>
          <br/><span class="truncate">{{item.time}}</span>
          <br/><span class="small">From {{item.senderId.substr(0,10)}}..{{item.senderId.substr(-10)}}</span>
          <br/><span class="small">To {{item.recipientId.substr(0,10)}}..{{item.recipientId.substr(-10)}}</span>
        </td>
      </tr>
    </table>

    <!-- tx for desktop -->
    <el-table v-if="!$root.isMobile" :data="txs.transactions" :maxHeight="$root.height - 350" stripe>
      <el-table-column
        className=""
        min-width="100"
        label="Id"
        property="id"
      >
        <div class="" slot-scope="{ row }">
          <span class="text-info pointer" @click="navUrl('https://blockexplorer.smartholdem.io/#/transaction/'+row.id)">{{
            row.id.substr(0,8) + '...'+row.id.substr(-8)}}</span>
        </div>
      </el-table-column>
      <el-table-column
        min-width="76"
        sortable
        :label="$t('WALLET.CONF')"
        property="confirmations"
      >
        <div class="text-center" slot-scope="{ row }">
          <span v-show="row.confirmations > 63" class="" :title="'Confirmations ' + row.confirmations">confirmed</span>
          <span v-show="row.confirmations < 64" class="badge badge-dark big-badge">{{ row.confirmations}}</span>
        </div>
      </el-table-column>
      <el-table-column
        min-width="100"
        :label="$t('WALLET.TIME')"
        sortable
        property="confirmations"
      >
        <div class="" slot-scope="{ row }">
          <span class="">{{row.time.substr(0,10)}}</span>
          <span v-if="row.time !== 'wait'" style="font-size: 0.85em;" class="font-weight-normal"> {{row.time.substr(-8)}}</span>
        </div>
      </el-table-column>
      <el-table-column
        min-width="55"
        sortable
        align="right"
        header-align="right"
        :label="$t('WALLET.AMOUNT')"
        property="amount"
      >
        <div class="" slot-scope="{ row }" v-if="row.amount">
          <span v-show="row.amount[0] === '+'" class="badge badge-success big-badge w-100">{{ row.amount}}</span>
          <span v-show="row.amount[0] === '-'" class="badge badge-danger big-badge w-100">{{ row.amount}}</span>
        </div>
      </el-table-column>
      <el-table-column
        className="truncate"
        min-width="100"
        align="right"
        header-align="right"
        :label="$t('WALLET.SENDER')"
      >
        <div class="" slot-scope="{ row }">
          <span class="text-info pointer" @click="navUrl('https://blockexplorer.smartholdem.io/#/wallets/' + row.senderId)">{{
            row.senderId.substr(0,5) +
            '...'+row.senderId.substr(-5)}}
          </span>
        </div>
      </el-table-column>
      <el-table-column
        min-width="100"
        align="left"
        header-align="left"
        :label="$t('WALLET.RECIPIENT')"
      >
        <div class="text-left" slot-scope="{ row }">
          <span v-if="row.type === 0" class="text-info pointer"
             @click="navUrl('https://blockexplorer.smartholdem.io/#/wallets/'+row.recipientId)"
             >{{
            row.recipientId.substr(0,5) +
            '...'+row.recipientId.substr(-5)}}
          </span>

          <div v-if="row.type === 3">
            <span v-if="row.asset.votes[0][0] === '-'" class="badge badge-danger"><span>UN</span>VOTE</span>
            <span v-if="row.asset.votes[0][0] === '+'" class="badge badge-success"><span>ADD</span> VOTE</span>
          </div>


        </div>
      </el-table-column>

      <el-table-column
        min-width="100"
        align="left"
        header-align="left"
        label="Comment"
      >
        <div class="text-left" slot-scope="{ row }">
          <span v-if="row.vendorField" :title="row.vendorField">{{row.vendorField.substr(0,11)}}<span
            v-if="row.vendorField.length  > 12">..</span></span>
        </div>
      </el-table-column>
    </el-table>

  </card>
</template>

<script>
import {Table, TableColumn} from 'element-ui'
import {openUrl} from 'src/util/url'

export default {
  name: "Transactions",
  data() {
    return {
      unconfirmed: [],
      timerUpTx: null,
      timerPeriodic: null,
      transactions: []
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
    navUrl(url) {
      openUrl(url)
    },
    async startUpdate() {
      clearTimeout(this.timerUpTx);
      let timeStop = true
      this.timerUpTx = setTimeout(async () => {
        await this.$store.dispatch('wallet/getTxsByAddress')
        for (let i = 0; i < this.txs.transactions.length; i++) {
          if (this.txs.transactions[i].confirmations < 64) {
            timeStop = false
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
    }
  },
  computed: {
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


  }


}
</script>

<style scoped>

</style>
