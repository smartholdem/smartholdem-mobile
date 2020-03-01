<template>
  <div>
    <div class="row mt-0">
      <div class="col-md-12 m-0 w-100 p-0">
        <div class="m-0">
          <card class="bg-white pb-2" style="margin-bottom: 3px; position: sticky; top: 50px;z-index:1;">
            <template slot="header" class="">
              <div class="row">
                <div class="col-md-1">
                  <VueQrcode v-if="currentAddress && !$root.isMobile" class="qr-wallet" :value="currentAddress"
                             :options="{size:98}"/>
                </div>
                <div class="col-md-4 pl-2 text-center">

                  <p title="Your Public Address" class="small font-weight-bold"
                     v-clipboard="() => currentAddress">
                    <i class="tim-icons icon-single-copy-04 pointer"></i>
                    {{currentAddress}}
                  </p>


                  <h4 class="card-title font-weight-normal"><span v-if="!$root.isMobile">{{$t('WALLET.BALANCE')}}</span>
                    <span class="font-weight-bold">{{ walletBalance.balance }}</span>
                    STH</h4>
                  <h4 v-if="accountData.delegate" class="card-title">
                    <span class="font-weight-bold"><i class="tim-icons icon-bank pb-1"></i> {{ accountData.delegate.username }}</span>
                    <span class="ml-2 badge badge-dark">rank {{ accountData.delegate.rate }}</span>
                    &nbsp;<span v-if="accountData.vote"
                                @click="showModalVote({address: accountData.address, delegate: accountData.vote, voteType: '-'})"
                                class="pointer badge badge-white ">voted for {{accountData.vote.username}} <i
                    title="remove vote" class="tim-icons icon-simple-remove"></i></span>
                  </h4>

                  <h4 v-if="addressName" class="card-title">
                    <span class="font-weight-bold"><i class="tim-icons icon-tag pb-1"></i> {{ addressName }}</span>
                    &nbsp;<span v-if="accountData.vote"
                                @click="showModalVote({address: accountData.address, delegate: accountData.vote, voteType: '-'})"
                                class="pointer badge badge-white ">voted for {{accountData.vote.username}} <i
                    title="remove vote" class="tim-icons icon-simple-remove"></i></span>
                  </h4>


                </div>
                <div class="col-md-7 pl-4 text-center">
                  <base-button v-if="$root.isMobile" @click="showModalSend(currentAddress)"
                               :disabled="accountData.balance < 1.01" class="" type="primary" round icon simple>
                    <i class="tim-icons icon-spaceship" style="font-size: 1.3rem"></i>
                  </base-button>

                  <base-button v-if="!$root.isMobile" @click="showModalSend(currentAddress)"
                               :disabled="accountData.balance < 1.01" type="primary" round simple>
                      <span><i class="tim-icons icon-spaceship" style="font-size: 1.3rem"></i> SEND</span>
                  </base-button>

                  <base-button v-if="!accountData.delegate && $root.isMobile" type="default" :disabled="accountData.balance < 55000"
                               @click="showModalDelegate" simple round icon class="ml-2 text-uppercase" style="">
                    <i class="tim-icons icon-bank pb-1" style="font-size: 0.96rem"></i>
                  </base-button>

                  <base-button v-if="!accountData.delegate && !$root.isMobile" type="default" :disabled="accountData.balance < 55000"
                               @click="showModalDelegate" simple round class="ml-2 text-uppercase" style="">
                    <i class="tim-icons icon-bank pb-1" style="font-size: 0.96rem"></i> Register Delegate
                  </base-button>

                  <base-button v-if="!$root.isMobile" :disabled="true" type="default" simple round
                               class="ml-2 text-uppercase">
                    <i class="tim-icons icon-lock-circle pb-1" style="font-size: 0.96rem"></i> 2nd password
                  </base-button>

                  <base-button v-if="!accountData.delegate" @click="showModalLabel($route.params.address)" type="info"
                               round icon
                               simple class="ml-2">
                      <i class="tim-icons icon-tag" style="font-size: 1.3rem"></i>
                  </base-button>

                  <base-button @click="walletDecrypt(currentAddress)" type="info" round icon simple class="ml-2">
                      <i class="tim-icons icon-key-25" style="font-size: 1.3rem"></i>
                  </base-button>

                  <base-button type="default" round icon simple class="ml-2">
                      <i class="fas fa-qrcode" style="font-size: 1.3rem"></i>
                  </base-button>

                </div>
              </div>
            </template>
          </card>

          <card class="bg-white" style="margin-top: 5px;">
            <div class="card-body">
              <div v-if="$root.isMobile">
                <div v-if="mobileTabs === 0" class="row">
                  <div class="col-md-12">
                    <Transactions :address="currentAddress"/>
                  </div>
                </div>

                <div v-if="mobileTabs === 1" class="row">
                  <div class="col-md-12">
                    <Delegates/>
                  </div>
                </div>

                <div v-if="mobileTabs === 2" class="row">
                  <div class="col-md-12">
                    <Xbts/>
                  </div>
                </div>
              </div>

              <div v-if="!$root.isMobile" class="wallet-tabs">
                <tabs type="danger">
                  <tab-pane :label="'Transactions ' + totalTx">
                    <div class="row">
                      <div class="col-md-12">
                        <Transactions :address="currentAddress"/>
                      </div>
                    </div>
                  </tab-pane>

                  <tab-pane label="Delegates">
                    <div class="row">
                      <div class="col-md-12">
                        <Delegates/>
                      </div>
                    </div>
                  </tab-pane>

                  <tab-pane label="Purchase STH">
                    <div class="row">
                      <div class="col-md-7">
                        <Xbts/>
                      </div>
                      <div class="col-md-5">
                        <card class="bg-gradient-white">
                          <ul>
                            <li>Select asset for exchange (ex. BTC, LTC etc.)</li>
                            <li>Enter asset amount for send & get STH for receive</li>
                            <li>Press button Exchange</li>
                            <li>Get Deposit Address for selected asset</li>
                            <li>Send your asset (ex. BTC, LTC etc.) on deposit address</li>
                            <li>Click History Deps for check your deposit</li>
                            <li>After confirming the transaction, your STH balance will be update!</li>
                          </ul>
                        </card>
                      </div>
                    </div>
                  </tab-pane>
                </tabs>
              </div>
            </div>
          </card>

        </div>
      </div>
    </div>

    <!-- Show Priv key -->
    <modal
      :show.sync="modalPrivateShow"
      class="modal-black"
      :show-close="true"
      headerClasses="justify-content-center"
    >

      <div slot="header" class="modal-profile">
        <i class="tim-icons icon-key-25"></i>
      </div>

      <h3 class="text-center">Your Private Data</h3>

      <p class="text-center text-white">For address <i class="tim-icons icon-wallet-43"></i> {{account.address}}</p>
      <p class="text-warning small text-center">!Never share your secret key with third parties. Store your passphrase
        in a secure place.</p>
      <hr class="bg-primary">
      <p class="text-white text-center">- YOUR SECRET PASSPHRASE -</p>
      <p class="text-white font-weight-light" title="copy private key" v-clipboard="() => account.secret">
        <i class="tim-icons icon-single-copy-04 pointer"></i> {{account.secret}}
      </p>

      <template slot="footer">

      </template>
    </modal>


    <div v-if="modal.delegate.show">
      <ModalTxDelegate :showModalDelegate="modal.delegate.show" :address="modal.delegate.address"
                       @onModalClose="modal.delegate.show = false"/>
    </div>


    <div v-if="$root.isMobile">
      <BotBtnWlt/>
    </div>

  </div>
</template>

<script>

import {TabPane, Tabs, Collapse, CollapseItem} from 'src/components';
import {Modal} from '@/components'
import Transactions from '@/components/Wallet/Transactions'
import Delegates from '@/components/Blockchain/Delegates'
import Xbts from '@/components/Exchange/Xbts'
//import NumberFormat from 'number-format.js'
import VueQrcode from '@/util/QRCode'
import {network} from '@/config'
//import CryptoJS from 'crypto-js'
//import moment from 'moment'
import {BaseAlert} from 'src/components'
import eventBus from '@/plugins/event-bus'

import ModalTxDelegate from '@/components/Wallet/ModalTxDelegate'
import BotBtnWlt from '@/components/Mobile/BotBtnWlt'

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
    VueQrcode,
    Delegates,
    BaseAlert,
    ModalTxDelegate,
    BotBtnWlt,
  },
  data() {
    return {
      mobileTabs: 0,
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
        secret: null
      },
      pin: '',
      disabled: true,
      showNext: false,
      modalSend: false,
      modalTx: false,
      modalPrivateShow: false,
      modalClasses: {
        address: '',
        amount: ''
      },
      send: {
        address: null,
        amount: null,
        memo: null,
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
      return this.$store.getters['wallet/labels'][this.currentAddress]
    },
    totalTx() {
      return this.$store.getters['wallet/txs']['count']
    },
    /*
    validateSend() {
      if (this.modalClasses.address === 'has-success' && this.remainingBalance >= 0) {
        return false
      } else {
        return true
      }
    },
    */
    currentAddress() {
      return this.$store.getters['wallet/currentAddress']
    },
    walletBalance() {
      return (this.$store.getters['wallet/balances']['accounts'][this.currentAddress])
    },
    accountData() {
      const result = this.$store.getters['blockchain/selectedAccount']
      //console.log(result)
      return result
    }
  },
  methods: {
    async removeAddress(key) {
      let accounts = await this.$store.getters['app/accounts']
      delete accounts[key]
      await this.$store.dispatch('app/updateAccounts', accounts)
      await this.$store.dispatch('wallet/setCurrentAddress', null)
      //await this.$store.dispatch('wallet/getBalances')
      this.$router.push({path: '/dashboard'})
    },
    async showModalDelegate() {
      if (this.$root.pin) {
        this.modal.delegate.show = true
      } else {
        eventBus.emit('modal:unlock')
      }
    },
    async showModalVote(data) {
      if (this.$root.pin) {
        eventBus.emit('modal:vote', data)
      } else {
        eventBus.emit('modal:unlock')
      }
    },
    async showModalLabel(address) {
      eventBus.emit('modal:label', address)
    },
    async showModalSend(address) {
      if (this.$root.pin) {
        eventBus.emit('modal:send', address)
      } else {
        eventBus.emit('modal:unlock')
      }
    },
    async walletDecrypt(address) {
      if (this.$root.pin) {
        const result = await this.$store.dispatch('app/walletDecrypt', {
          address: address,
          pin: this.$root.pin
        })
        this.account.address = address
        this.account.secret = result
        this.modalPrivateShow = true
      } else {
        eventBus.emit('modal:unlock')
        this.modalPrivateShow = false
      }
    },
    clipboardSuccessHandler({value, event}) {
      this.toolTipsContent.copy = 'Copied to clipboard';
      setTimeout(() => (this.toolTipsContent.copy = 'Copy'), 1500);
    },
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

  },
  watch: {
    $route(to, from) {

    }
  }
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

