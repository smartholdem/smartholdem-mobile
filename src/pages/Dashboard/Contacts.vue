<template>
  <div class="row">
    <div :class.sync="'pb-3 layer-head'+ ' ' + $root.modalColor">
      <router-link to="/wallet" class="back-wallet pl-4 pr-5"><i class="tim-icons icon-minimal-left"></i></router-link>
      <span>{{$t('PG.CONTACTS')}}</span>
      <span class="text-right float-right mr-2" style="margin-top: -5px;">
            <base-button @click="showModalAddConact" type="info" icon simple round class="btn-sm" style="">
            <i class="tim-icons icon-simple-add" style=""></i>
          </base-button>
          </span>

    </div>

    <div class="layer-content w-100">

      <img v-if="!contactList.length" class="w-100" src="~@/assets/img/add.png"/>

      <table class="table w-100">
        <tbody>
        <tr v-for="(item, idx) in contactList" :key="idx + 'contact'" class="pointer">
          <td class="pl-3" @click="showModal('modal:qr', {address: item.address, label: item.label, isContact: true})">
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
      <div v-if="modal.contacts.show">
        <ModalAddContact :show="modal.contacts.show" @onModalClose="modal.contacts.show = false"/>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '@/plugins/event-bus'
import {openUrl} from 'src/util/url'
import ModalAddContact from '@/components/Wallet/ModalAddContact'

export default {
  name: "Contacts",
  components: {
    ModalAddContact,
  },
  data() {
    return {
      modal: {
        contacts: {
          show: false,
        },
      },
    }
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
    async showModalAddConact() {
      this.modal.contacts.show = false
      this.modal.contacts.show = true
    },
    async showModal(evt, options = {}) {
      if (this.$root.pin) {
        this.$eventBus.emit(evt, options) // ex 'modal:qr', {address: ..., label: null}
      } else {
        this.$eventBus.emit('modal:unlock')
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
  },
  async created() {
    await this.$store.dispatch('app/fetchContacts')

    this.$eventBus.on('onModalClose', async () => {
      this.modal.contacts.show = false
    })
  }


}
</script>

<style scoped>

</style>
