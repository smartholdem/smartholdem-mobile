<template>
  <div>
    <div class="row mt-0">
      <div class="col-md-12 m-0 w-100 p-0">
        <div class="m-0">
          <card v-if="mobileTabs !== 2"  class="pb-2 radius-0" style="margin-bottom: 3px; position: sticky; top: 50px;z-index:1;">
            <div class="">
              <div class="row">
                <div class="col-md-4 pl-2 text-center">

                  <p title="Your Public Address" class="small font-weight-bold"
                     v-clipboard="() => $route.params.address"
                     v-clipboard:success="clipboardSuccessHandler"
                  >
                    <i class="tim-icons icon-single-copy-04 pointer"></i>
                    {{$route.params.address}}
                  </p>


                  <h4 class="card-title font-weight-normal">
                    <span class="font-weight-bold">{{ walletBalance.balance }}</span>
                    STH</h4>
                  <h4 v-if="accountData.delegate" class="card-title">
                    <span class="font-weight-bold"><i class="tim-icons icon-bank pb-1"></i> {{ accountData.delegate.username }}</span>
                    <span class="ml-2 badge badge-dark">rank {{ accountData.delegate.rate }}</span>
                    &nbsp;<span v-if="accountData.vote"
                                @click="showModal('modal:vote',{address: accountData.address, delegate: accountData.vote, voteType: '-'})"
                                class="pointer badge badge-white ">{{$t('WALLET.VOTED_FOR')}} {{accountData.vote.username}} <i
                    title="remove vote" class="tim-icons icon-simple-remove"></i></span>
                  </h4>

                  <h4 :v-if="!accountData.delegate" class="card-title">
                    <span class="font-weight-bold" v-show="addressName"><i class="tim-icons icon-tag pb-1"></i> {{ addressName }}</span>
                    &nbsp;<span v-if="accountData.vote"
                                @click="showModal('modal:vote',{address: accountData.address, delegate: accountData.vote, voteType: '-'})"
                                class="pointer badge badge-white">{{$t('WALLET.VOTED_FOR')}} {{accountData.vote.username}} <i
                    title="remove vote" class="tim-icons icon-simple-remove"></i></span>
                  </h4>


                </div>
                <div class="col-md-7 pl-4 text-center">
                  <base-button @click="showModal('modal:send',$route.params.address)"
                               :disabled="accountData.balance < 1.01" class="" type="primary" simple round icon>
                    <i class="tim-icons icon-spaceship" style="font-size: 1.3rem"></i>
                  </base-button>

                  <base-button v-if="!accountData.delegate" type="primary" :disabled="accountData.balance < 55000"
                               @click="showModalDelegate" simple round icon class="ml-2 text-uppercase" style="">
                    <i class="tim-icons icon-bank pb-1" style="font-size: 0.96rem"></i>
                  </base-button>

                  <base-button v-if="!accountData.delegate" @click="showModal('modal:label',$route.params.address)"
                               type="warning"
                               round icon
                               simple class="ml-2">
                    <i class="tim-icons icon-tag" style="font-size: 1.3rem"></i>
                  </base-button>

                  <base-button @click="showModal('modal:private', {address: $route.params.address})" type="warning"
                               round icon simple class="ml-2">
                    <i class="tim-icons icon-key-25" style="font-size: 1.3rem"></i>
                  </base-button>

                  <base-button @click="showModal('modal:qr', {address: $route.params.address, label: addressName || null})" type="warning" round icon simple class="ml-2">
                    <i class="fas fa-qrcode" style="font-size: 1.3rem"></i>
                  </base-button>

                  <base-button @click="removeAddress($route.params.address)" type="danger" round icon simple
                               class="ml-2">
                    <i class="tim-icons icon-trash-simple" style="font-size: 1.3rem"></i>
                  </base-button>

                  <base-button v-if="!$root.isMobile" :disabled="true" type="default" simple round
                               class="ml-2 text-uppercase">
                    <i class="tim-icons icon-lock-circle pb-1" style="font-size: 0.96rem"></i> 2nd password
                  </base-button>

                </div>
              </div>
            </div>
          </card>

          <card class="radius-0" style="margin-top: 3px;">
            <div class="">
              <div>
                <div v-if="mobileTabs === 0" class="row">
                  <div class="col-md-12">
                    <Transactions :address="$route.params.address"/>
                  </div>
                </div>

                <div v-if="mobileTabs === 2" class="row m-0 p-0">
                    <Xbts/>
                </div>
              </div>

            </div>
          </card>

        </div>
      </div>
    </div>

    <div v-if="modal.delegate.show">
      <ModalTxDelegate :showModalDelegate="modal.delegate.show" :address="modal.delegate.address"
                       @onModalClose="modal.delegate.show = false"/>
    </div>


    <div v-if="$root.isMobile">
      <BotBtnWlt/>
    </div>

    <div v-if="show.qrRead">
      <QrReadAddrSend :show="show.qrRead" @onQrClose="show.qrRead = false"/>
    </div>


  </div>
</template>

<script>

import {TabPane, Tabs, Collapse, CollapseItem} from 'src/components';
import {Modal} from '@/components'
import Transactions from '@/components/Wallet/Transactions'
import Xbts from '@/components/Exchange/Xbts'
//import NumberFormat from 'number-format.js'
import {network} from '@/config'
//import CryptoJS from 'crypto-js'
//import moment from 'moment'
import {BaseAlert} from 'src/components'
import eventBus from '@/plugins/event-bus'

import ModalTxDelegate from '@/components/Wallet/ModalTxDelegate'
import BotBtnWlt from '@/components/Mobile/BotBtnWlt'
import ReceiveSth from '@/components/Mobile/ReceiveSth'
import QrReadAddrSend from '@/components/Mobile/QrReadAddrSend'

export default {
  name: "Address",
  components: {
    Modal,
    TabPane,
    Tabs,
    Collapse,
    CollapseItem,
    Transactions,
    Xbts,
    BaseAlert,
    ModalTxDelegate,
    BotBtnWlt,
    ReceiveSth,
    QrReadAddrSend,
  },
  data() {
    return {
      mobileTabs: 0,
      show: {
        qrRead: false,
      },
      modal: {
        delegate: {
          show: false,
          address: ''
        }
      },
      isValidAddress: false,
      activeName: 'first',
      account: {
        address: null,
        label: '',
      },
      toolTipsContent: {
        copy: "Copy"
      }
    };
  },
  computed: {
    routeAddress() {
      return `${this.$route.params.address}`;
    },
    contactList() {
      const data = this.$store.getters['app/contacts']
      let keys = Object.keys(data)
      let result = []
      for (let i = 0; i < keys.length; i++) {
        result.push(data[keys[i]])
      }
      return result
    },
    addressName() {
      return this.$store.getters['wallet/labels'][this.$route.params.address]
    },
    totalTx() {
      return this.$store.getters['wallet/txs']['count']
    },
    currentAddress() {
      return this.$store.getters['wallet/currentAddress']
    },
    walletBalance() {
      return (this.$store.getters['wallet/balances']['accounts'][this.$route.params.address])
    },
    accountData() {
      const result = this.$store.getters['blockchain/selectedAccount']
      return result
    }
  },
  methods: {
    async showModal(evt, options = {}) {
      if (this.$root.pin) {
        eventBus.emit(evt, options) // ex modal:qr
      } else {
        eventBus.emit('modal:unlock')
      }
    },
    async removeAddress(key) {
      let accounts = await this.$store.getters['app/accounts']
      delete accounts[key]
      await this.$store.dispatch('app/updateAccounts', accounts)
      await this.$store.dispatch('wallet/setCurrentAddress', null)
      this.$router.push({path: '/wallet'})
    },
    async showModalDelegate() {
      if (this.$root.pin) {
        this.modal.delegate.show = true
      } else {
        eventBus.emit('modal:unlock')
      }
    },
    clipboardSuccessHandler() {
      this.toolTipsContent.copy = 'Copied to clipboard';
      setTimeout(() => (this.toolTipsContent.copy = 'Copy'), 1500);
    },
  },
  mounted() {
    this.account.label = this.$store.getters['wallet/labels'][this.$route.params.address]
  },
  async created() {
    await this.$store.dispatch('wallet/setCurrentAddress', this.$route.params.address)
    await this.$store.dispatch('blockchain/getAccount', this.$route.params.address)

    this.$eventBus.on('close:modal', async () => {
      this.modal = {
        delegate: {
          show: false,
          address: ''
        },
      }
    })

    this.$eventBus.on('address:tab', async (idx) => {
      this.mobileTabs = idx
    })

    this.$eventBus.on('layer:qrforsend', async () => {
      this.show.qrRead = true
    })

    this.$eventBus.on('qr:forsend', async (data) => {
      this.show.qrRead = false
    })

    eventBus.on('label:up', async (data) => {
      this.account.label = data.label
      this.addressName
    })



  },
  /*
  watch: {
    $route(to, from) {

    }
  }
  */
}
</script>

<style>
  .modal.modal-info .input-group-prepend .input-group-text {
    background: none;
  }

  .input-group-focus .input-group-prepend .input-group-text {
    background: none !important;
  }

  #modalTx .modal-dialog {
    max-width: 625px;
  }

  @media (min-width: 576px) {
    .modal-dialog {
      max-width: 650px;
      margin: 1.75rem auto;
    }
  }



</style>

