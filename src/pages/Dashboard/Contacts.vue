<template>
  <div>
    <div class="table-full-width" style="margin-bottom: 0px;">
      <div class="mb-4 w-100">
        <h4 class="text-center">Contacts
          <span class="text-right float-right" style="margin-top: -10px;">
            <base-button @click="showModalAddContact()" type="info" icon simple round class="" style="">
            <i class="tim-icons icon-simple-add" style=""></i>
          </base-button>
          </span>

        </h4>

      </div>

      <table class="table w-100">
        <tbody>
        <tr v-for="(item, idx) in contactList" :key="idx + 'contact'" class="pointer">
          <td @click="showModal('modal:qr', {address: item.address, label: item.label, isContact: true})">
            <span class="font-weight-bolder">{{ item.label}}</span>
            <span class="small">
              <br>{{ item.address}}
              <br>{{ item.balance.toFixed(0)}} STH
            </span>
          </td>
          <td>
            <base-dropdown
              menu-on-right=""
              tag="div"
              title-classes="btn btn-link btn-icon"
            >
              <i slot="title" class="tim-icons icon-settings-gear-63"></i>
              <span class="dropdown-item" v-clipboard="() => item.address"> <i class="tim-icons icon-single-copy-04 pointer"></i> Copy</span>
              <span class="dropdown-item" @click="showModal('modal:qr', {address: item.address, label: item.label, isContact: true})"> <i class="fas fa-qrcode"></i> QR-Code</span>
              <span class="dropdown-item" @click="removeContact(item.address)"> <i class="tim-icons icon-trash-simple"></i> Remove</span>

            </base-dropdown>
          </td>

        </tr>
        </tbody>
      </table>




    </div>

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
    async showModal(evt, options = {}) {
      if (this.$root.pin) {
        eventBus.emit(evt, options) // ex 'modal:qr', {address: ..., label: null}
      } else {
        eventBus.emit('modal:unlock')
      }
    },
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
