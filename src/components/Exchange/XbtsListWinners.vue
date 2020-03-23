<template>
  <card card-body-classes="table-full-width" style="margin-bottom: 0px;">
    <!--<h4 slot="header" class="card-title">{{$t('WALLET.TRANSACTIONS')}} <span class="font-weight-bold">{{totalTx}}</span></h4>-->

    <!-- tx desktop -->
    <el-table v-if="!$root.isMobile" :data="winners" :maxHeight="$root.height - 450" stripe>

      <el-table-column
        className=""
        min-width="10"
        label="#"
      >
        <div class="" slot-scope="{ row }">
          <img width="32px" :src="'https://ex.xbts.io/asset-symbols/'+row.ticker.toLowerCase()+'.png'"/>
        </div>
      </el-table-column>

      <el-table-column
        className=""
        min-width="20"
        label="Ticker"
      >
        <div class="" slot-scope="{ row }">
          {{row.ticker}}
        </div>
      </el-table-column>

      <el-table-column
        className=""
        min-width="50"
        label="Coin"
      >
        <div class="text-uppercase" slot-scope="{ row }">
          {{row.name}}
        </div>
      </el-table-column>

      <el-table-column
        className=""
        min-width="50"
        label="State"
      >
        <div class="text-uppercase mt-1" slot-scope="{ row }">
          <span v-if="row.state === 'listed'">{{row.state}}
            <base-button @click="openTicker(row.ticker.toUpperCase())" type="danger" round icon simple class="ml-2">
                  <el-tooltip
                    content="Trade Now"
                    effect="light"
                    :open-delay="300"
                    placement="top"
                  >
                    <i class="tim-icons icon-chart-bar-32" style="font-size: 1rem"></i>
                  </el-tooltip>
                </base-button>

            </span>
          <span v-if="row.state === 'winner'">{{row.state}}</span>
        </div>
      </el-table-column>

    </el-table>

  </card>
</template>

<script>
import {Table, TableColumn} from 'element-ui'

export default {
  name: "XbtsListCandidates",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  methods: {
    openTicker(ticker) {
      this.openLink('https://ex.xbts.io/#/market/XBTSX.'+ticker+'_BTS')
    }
  },
  computed: {
    winners() {
      let result = []
      const data = this.$store.getters['blockchain/xbtsWinners']
      for (let i=0; i < data.length; i++) {
        if (data[i].state === 'listed' || data[i].state === 'winner') {
          result.push(data[i])
        }
      }
      return result
    },
  },
  async created() {
    await this.$store.dispatch('blockchain/getXbtsWinners')
  }
}
</script>

<style scoped>

</style>
