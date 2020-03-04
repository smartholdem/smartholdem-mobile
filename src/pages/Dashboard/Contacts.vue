<template>
  <div>
    <card card-body-classes="table-full-width" style="margin-bottom: 0px;">
      <base-button @click="showModalAddContact()" type="info" icon simple round class="float-right" style="margin-bottom: -110px; z-index:10;">
        <i class="tim-icons icon-simple-add" style=""></i>
      </base-button>

      <!-- tx desktop -->
      <el-table :data="contactList" stripe>

        <el-table-column
          className=""
          min-width="50"
          label="Name"
          property="label"
          sortable
        >
          <div class="" slot-scope="{ row }">

            <span class="font-weight-bolder">{{ row.label}}</span>
            <span v-if="$root.isMobile" class="small">
              <br>{{ row.address}}
              <br>{{ row.balance}} STH
            </span>

            <base-button type="danger" icon simple class="float-right btn-sm" @click="removeContact(row.address)">
              <i class="tim-icons icon-trash-simple"></i>
            </base-button>


          </div>
        </el-table-column>


      </el-table>

    </card>

  </div>
</template>

<script>
import eventBus from '@/plugins/event-bus'
import {Table, TableColumn} from 'element-ui'
import {openUrl} from 'src/util/url'

export default {
  name: "Contacts",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  computed: {
    contactList() {
      const data = this.$store.getters['app/contacts']
      let keys = Object.keys(data)
      let result = []
      for (let i = 0; i < keys.length; i++) {
        result.push(data[keys[i]])
      }
      return result
    },
  },
  methods: {
    navUrl(url) {
      openUrl(url)
    },
    async removeContact(key) {
      let accounts = await this.$store.getters['app/contacts']
      delete accounts[key]
      await this.$store.dispatch('app/updateContacts', accounts)
      await this.$store.dispatch('app/fetchContacts')
    },
    async getAccount(address) {
      await this.$store.dispatch('blockchain/getAccount', address)
    },
    async showModalAddContact() {
      eventBus.emit('modal:contacts')
    },
  },
  async created() {
    //await this.$store.dispatch('app/updateContacts', {})
    await this.$store.dispatch('app/fetchContacts')
  }


}
</script>

<style scoped>

</style>
