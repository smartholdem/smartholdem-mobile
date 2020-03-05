<template>
  <card card-body-classes="table-full-width" style="margin-bottom: 0px;">
    <base-button type="info" round class="btn-sm float-right mt-0">
      <i class="tim-icons icon-zoom-split"></i> Search Delegate
    </base-button>
    <small>
      Voting is an optional, but important mechanism that keeps the SmartHoldem network secure. The 64 delegates with
      the most votes from the network are responsible for verifying and forging transactions into new blocks. Now
      registered {{Delegates.count}} delegates.
    </small>
    <!-- tx desktop -->


    <el-table :row-class-name="tableRowClassName" :data="Delegates.list" :maxHeight="$root.height - 350">
      <el-table-column
        sortable
        className=""
        min-width="10"
        label="Rate"
        property="rate"
      >
      </el-table-column>

      <el-table-column
        className=""
        min-width="40"
        label="Username"
        property="username"
      >
      </el-table-column>

      <el-table-column
        className=""
        min-width="10"
        label="Vote %"
        property="approval"
      >
      </el-table-column>

      <el-table-column
        className=""
        min-width="10"
        label="Actions"
      >
        <div slot-scope="{ row }" class="mt-1">
          <div v-if="accountData.vote">
            <base-button v-if="accountData.vote.username === row.username"
                         @click="showModalVote({address: accountData.address, delegate: accountData.vote, voteType: '-'})"
                         type="warning" round icon class="mr-1">
              <el-tooltip
                content="Remove Vote"
                effect="light"
                :open-delay="300"
                placement="top"
              >
                <i class="tim-icons icon-simple-delete"></i>
              </el-tooltip>
            </base-button>
          </div>

          <div v-if="!accountData.vote">
            <base-button @click="showModalVote({address: accountData.address, delegate: row, voteType: '+'})"
                         type="success" round icon class="mr-1">
              <el-tooltip
                :content="'Vote for ' + row.username"
                effect="light"
                :open-delay="300"
                placement="top"
              >
                <i class="tim-icons icon-simple-add"></i>
              </el-tooltip>
            </base-button>
          </div>
        </div>
      </el-table-column>

    </el-table>

  </card>
</template>

<script>
import {Table, TableColumn} from 'element-ui'
import eventBus from '@/plugins/event-bus'

export default {
  name: "Delegates",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  props: {
    address: {
      type: String,
      required: false,
    }
  },
  computed: {
    Delegates() {
      const result = this.$store.getters['blockchain/delegates']
      return result
    },
    accountData() {
      const result = this.$store.getters['blockchain/selectedAccount']
      return result
    }
  },
  methods: {
    async showModalVote(data) {
      if (this.$root.pin) {
        eventBus.emit('modal:vote', data)
      } else {
        eventBus.emit('modal:unlock')
      }
    },
    tableRowClassName({row}) {
      if (this.accountData.vote) {
        if (this.accountData.vote.username === row.username) {
          return 'table-secondary';
        }
      }
      return '';
    }
  },
  async created() {
    await this.$store.dispatch('blockchain/fetchDelegates')
  }
}
</script>

<style scoped>

</style>
