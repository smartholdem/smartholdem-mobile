<template>
  <card card-body-classes="table-full-width" style="margin-bottom: 0px;">
    <!--<h4 slot="header" class="card-title">{{$t('WALLET.TRANSACTIONS')}} <span class="font-weight-bold">{{totalTx}}</span></h4>-->

    <!-- tx desktop -->
    <el-table v-if="!$root.isMobile" :data="candidates" :maxHeight="$root.height - 512" stripe>
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
        min-width="100"
        label="Coin"
      >
        <div class="text-darker" slot-scope="{ row }">
          {{row.name}}
        </div>
      </el-table-column>

      <el-table-column
        :content="mixval.copied"
        v-clipboard:success="clipboardSuccess"
        v-clipboard:copy="row.address"
        min-width="100"
        label="Vote Address"
      >
        <div class="font-weight-bold text-darker" slot-scope="{ row }">
          <i class="tim-icons icon-single-copy-04 pointer"></i> {{row.address}}
        </div>
      </el-table-column>

      <el-table-column
        className=""
        min-width="100"
        label="Votes STH"
      >
        <div class="font-weight-bold" slot-scope="{ row }">
          {{row.weight}}
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
  computed: {
    candidates() {
      return this.$store.getters['blockchain/xbtsCandidates']
    },
  },
  async created() {
    await this.$store.dispatch('blockchain/getXbtsCandidates')
  }
}
</script>

<style scoped>

</style>
