<template>
  <div class="shadow-none m-0 radius-0 mt-3" style="min-height: 70vh;">
    <div class="">
      <h4 class="mb-1 noselect font-weight-bold text-center mb-3">
        {{$t('WALLET.BUY')}} SmartHoldem [STH]
      </h4>
      <h4 class="text-center">
        <span class="text-uppercase" v-if="selects.currency"> for <img :src="'https://ex.xbts.io/asset-symbols/'+selects.currency+'.png'"
                                                                       width="20px"/> {{selects.currency}} </span>
        <span @click="getDepHistory" class="text-right float-right pointer"><span v-show="!$root.isMobile">{{$t('WALLET.HISTORY')}} Deps</span> <i
          class="tim-icons icon-watch-time"></i></span>
        <br/>
      </h4>
      <span class="small float-right" style="margin-top: -20px;" v-show="loading">Loading data..</span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-8 font-weight-bold">
          <span class="small ml-1 w-100 pr-2" style="margin-top:-20px !important; float:left; clear:both;"
                v-if="currency[selects.currency] && selects.currency">
            * min {{currency[selects.currency].min}} {{selects.currency.toUpperCase()}}
            <span class="text-right float-right">1 {{currency[selects.currency].ticker}} ≈ {{currency[selects.currency].price}} STH</span>
          </span>
          <base-input
            :placeholder="$t('WALLET.YOU_SEND')"
            :readonly="readonly"
            @input="onInputSend"
            class="w-100 float-left mr-2 text-uppercase"
            type="text"
            v-model="amountSend"
          >
          </base-input>
        </div>
        <div class="col-md-4 noselect">
          <el-select
            @change="currentCurrency"
            class="select-info w-100 noselect"
            placeholder="Select Asset"
            size="large"
            v-model="selects.currency"
          >
            <el-option
              :key="option.label"
              :label="option.label"
              :value="option.value"
              class="select-info noselect"
              v-for="option in selects.coins"
            >
            </el-option>
          </el-select>
        </div>

        <div class="col-md-8 mt-2">
          <base-input
            :placeholder="$t('WALLET.YOU_GET') + ' STH'"
            class="w-100 text-receive"
            readonly
            type="text"
            v-model="amountReceiveText"
          >
          </base-input>
          <span class="small ml-1" style="margin-top:-4px !important; float:left; clear:both;margin-bottom:-6px">* {{$t('WALLET.MAX_RECEIVE')}} {{sth.max}} STH {{$t('APP.ON')}} 1 {{$t('APP.OP')}}</span>
        </div>
        <div class="col-md-4 mb-2 mt-3">
          <base-button :disabled="disabled" @click="exchangeStart" class="mt-2 w-100 text-uppercase" round simple
                       type="warning">
            {{$t('WALLET.EXCHANGE')}}
          </base-button>
        </div>

      </div>


      <!-- MODAL Deposit address-->
      <modal
        :class="modalColor"
        :show-close="false"
        :show.sync="exchangeModal"
        headerClasses="justify-content-center"
        v-if="selects.currency"
      >
        <div class="modal-profile" slot="header">
          <i class="tim-icons icon-money-coins"></i>
        </div>
        <p class="text-center">{{$t('WALLET.RECEIVE')}} ≈ <span
          class="font-weight-bold text-success">{{amountReceive}}</span> STH for
          <span class="font-weight-bold text-success">{{amountSend}}</span> {{selects.currency.toUpperCase()}}</p>
        <p class="text-center">{{$t('WALLET.PROVIDED')}} XBTS.io</p>

        <!-- DEPOSIT ALTS -->
        <div v-show="addressDepositCurrent">

          <div class="text-center" v-if="addressDepositCurrent">
          </div>

          <el-tooltip
            :content="mixval.copied"
            :open-delay="300"
            placement="left"
            v-clipboard:copy="addressDepositCurrent"
            v-clipboard:success="clipboardSuccess"
          >
            <base-input
              :label="$t('WALLET.DEPOSIT_ADDRESS') + ' ' + currency[selects.currency].title + ' ' + currency[selects.currency].ticker"
              class="w-100"
              type="text"
              v-model="addressDepositCurrent"
            >
            </base-input>
          </el-tooltip>
        </div>

        <div v-show="!addressDepositCurrent && !btsAssets[selects.currency]">
          <base-button @click="getDepositAddress" class="w-100" type="dark">{{$t('WALLET.GET_ADDR_DEP')}}</base-button>
        </div>

        <!-- DEPOSIT ALTS END -->

        <!-- DEPOSIT Bitshares -->
        <div v-if="btsAssets[selects.currency]">
          <el-tooltip
            :content="mixval.copied"
            :open-delay="200"
            placement="left"
            v-clipboard:copy="currentAddress"
            v-clipboard:success="clipboardSuccess"
          >
            <base-input
              :label="$t('WALLET.REQ-MEMO')"
              :value="currentAddress"
              class="w-100 text-danger"
              type="text"
            >
            </base-input>
          </el-tooltip>

          <div class="bg-danger text-white p-2 rounded">Mandatory field <strong>memo</strong> when sending a transaction
            into Bitshares blockchain
          </div>
        </div>
        <!-- DEPOSIT Bitshares END-->

        <p class="text-left small">{{$t('WALLET.SEND_YOUR')}} {{currency[selects.currency].title}}
          {{currency[selects.currency].ticker}}
          {{$t('WALLET.BY_DETAILS')}}</p>
        <template slot="footer">
          <base-button
            @click="iSend"
            link
            type="neutral"
          >{{$t('WALLET.I_SEND')}} {{currency[selects.currency].title}} {{currency[selects.currency].ticker}}
          </base-button>
          <base-button
            @click="exchangeModal = false"
            link
            type="neutral"
          >{{$t('APP.CANCEL')}}
          </base-button>

        </template>
      </modal>

      <!-- HISTORY -->

      <modal
        :show-close="true"
        :show.sync="historyModal"
        class="modal-primary modal-history"
        headerClasses="justify-content-center"
      >
        <div @click="getDepHistory" class="modal-profile pointer" slot="header">
          <i class="tim-icons icon-refresh-02" title="refresh"></i>
        </div>
        <p class="text-center">Deposits Exchange {{$t('WALLET.HISTORY')}}</p>

        <table class="table text-white" v-if="$root.isMobile">
          <tr :key="idx" v-for="(item, idx) in depHistory">
            <el-tooltip
              :content="mixval.copied"
              :open-delay="300"
              placement="left"
              v-clipboard:copy="item.txIn"
              v-clipboard:success="clipboardSuccess"
            >
              <td>
                {{$t('WALLET.SENT')}} {{item.amount}} {{item.coin}}
                <span class="float-right text-success">Copy data <i class="tim-icons icon-single-copy-04"></i></span>
                <br><span class="small">{{$t('WALLET.FROM')}} {{item.senderId}}</span>
                <br><span
                class="small">{{item.coin}} tx {{item.txIn.substr(0, 10)}} . . . {{item.txIn.substr(-10)}}</span>
                <br><span>Status {{item.status}}</span>
                <br><span>{{$t('WALLET.PRICE')}} 1 {{item.coin}} = {{item.price}} STH</span>
                <br><span>{{$t('WALLET.RECEIVED')}} {{item.amountSTH}} STH</span>
                <br><span @click="openLink('https://blockexplorer.smartholdem.io/#/transaction/' + item.txSTH)" class="small text-success"
                          v-if="item.txSTH">STH tx {{item.txSTH.substr(0, 10)}} . . . {{item.txSTH.substr(-10)}}</span>
              </td>
            </el-tooltip>
          </tr>
        </table>

        <table class="table text-white" v-if="!$root.isMobile">
          <tr>
            <th>
              {{$t('WALLET.SENT')}}
            </th>
            <th>
              {{$t('WALLET.FROM')}}
            </th>
            <th>
              Tx
            </th>
            <th>
              Status
            </th>
            <th>
              {{$t('WALLET.PRICE')}}
            </th>
            <th>
              {{$t('WALLET.RECEIVED')}}
            </th>
            <th>
              Tx {{$t('WALLET.RECEIVING')}} STH
            </th>
          </tr>
          <tr :key="idx" v-for="(item, idx) in depHistory">
            <td>
              {{item.amount}} {{item.coin}}
            </td>
            <td>
              {{item.senderId}}
            </td>
            <td class="truncate pointer">
              <el-tooltip
                :content="mixval.copied"
                :open-delay="300"
                placement="left"
                v-clipboard:copy="item.txIn"
                v-clipboard:success="clipboardSuccess"
              >
              <span>
              {{item.txIn}}
                </span>
              </el-tooltip>
            </td>
            <td>
              {{item.status}}
            </td>
            <td>
              {{item.price}} STH
            </td>
            <td>
              {{item.amountSTH}} STH
            </td>
            <td class="truncate pointer">
              <el-tooltip
                :open-delay="300"
                content="Explore Tx"
                placement="left"
              >
                <span @click="openLink('https://blockexplorer.smartholdem.io/#/transaction/' + item.txSTH)"
                      v-if="item.txSTH">{{item.txSTH}}</span>
              </el-tooltip>
            </td>
          </tr>
        </table>
      </modal>
      <!-- HISTORY END -->

    </div>
  </div>
</template>

<script>
import {Select, Option} from 'element-ui'
import {Modal} from '@/components'
import {exchange, network} from '@/config'
import axios from 'axios'

export default {
    name: "xbts",
    components: {
        Modal,
        [Option.name]: Option,
        [Select.name]: Select,
    },
    data() {
        return {
            loading: false,
            addressDepositCurrent: null,
            toolTipsContent: 'Click Copy',
            historyModal: false,
            exchangeModal: false,
            disabled: true,
            readonly: true,
            amountSend: null,
            amountReceive: null,
            amountReceiveText: null,
            selects: {
                currency: '',
                coins: [],
            },
            currency: {
                bts: {
                    title: "Bitshares",
                    min: 1,
                    price: 0,
                    precision: 5,
                    addressDeposit: 'smartholdem',
                    addressRefund: ''
                }
            },
            sth: {
                max: 80000
            },
            btsAssets: {
                "bts": "bts",
                "cny": "bts",
                "usd": "bts",
                "ruble": "bts",
                "evraz": "bts",
                "deex": "bts"
            }
        }
    },
    computed: {
        modalColor() {
            let result = 'modal-white'
            if ((this.$store.getters['app/settings']).darkMode) {
                result = 'modal-dark'
            }
            return result
        },
        depHistory() {
            return this.$store.getters['wallet/depHistory']
        },
        currentAddress() {
            return this.$store.getters['wallet/currentAddress']
        },
    },
    methods: {
        async getDepositAddress() {
            if (this.btsAssets[this.selects.currency]) {
                this.currency[this.selects.currency].addressDeposit = 'smartholdem'
            } else {
                this.currency[this.selects.currency].addressDeposit = await this.$store.dispatch('wallet/getDepAddress', {
                    coin: this.selects.currency,
                    recipientId: this.currentAddress,
                    v: this.currency[this.selects.currency].v,
                }) // depAddress.address
            }
            this.addressDepositCurrent = this.currency[this.selects.currency].addressDeposit
        },
        async getCurrency() {
            let coinsSelect = []
            try {
                let currencies = (await axios.get(exchange.API + '/api/list/currency')).data
                let keys = Object.keys(currencies)
                for (let i = 0; i < keys.length; i++) {
                    if (currencies[keys[i]].active) {
                        this.currency[keys[i]] = {
                            title: currencies[keys[i]].title,
                            ticker: currencies[keys[i]].ticker,
                            asset: currencies[keys[i]].asset,
                            min: currencies[keys[i]].min,
                            default: currencies[keys[i]].default,
                            price: currencies[keys[i]].price,
                            precision: currencies[keys[i]].precision,
                            addressDeposit: currencies[keys[i]].addressDeposit,
                            addressRefund: '',
                            v: currencies[keys[i]].v || '',
                        };
                        coinsSelect.push({
                            value: currencies[keys[i]].ticker.toLowerCase(),
                            label: currencies[keys[i]].title + ' ' + currencies[keys[i]].ticker
                        })
                    }
                }
            } catch (e) {

            }
            this.selects.coins = coinsSelect
        },
        async getDepHistory() {
            this.loading = true
            try {
                let history = (await axios.get(exchange.API + '/api/dep-history/' + this.currentAddress)).data
                if (history) {
                    await this.$store.dispatch('wallet/setDepHistory', history)
                }
                this.historyModal = true
            } catch (e) {

            }
            this.loading = false
        },
        async iSend() {
            this.exchangeModal = false
            this.notifyVue('top', 'center', 'info', this.$i18n.messages[this.$i18n.locale].WALLET.CHECK_DEP + ' - Deps History<br>' + this.$i18n.messages[this.$i18n.locale].WALLET.AFTER_CONF + '!')
            /*
            await axios.post(exchange.API + '/' + this.selects.currency + '/isend', {
              client: network.AGENT,
              addressRefund: this.currency[this.selects.currency].addressRefund,
              addressSTH: this.currentAddress
            })
              .then(function (response) {
                // console.log(response.data)
              })
              */
        },
        async currentCurrency() {
            this.addressDepositCurrent = null
            this.loading = true
            if (this.selects.currency !== '') {
                const price = (await axios.get(exchange.API + '/api/price/XBTSX.STH/' + this.currency[this.selects.currency].asset)).data
                this.sth.max = price.limits.max
                this.currency[this.selects.currency].price = (price.exchange.highest_bid * 1).toFixed(this.currency[this.selects.currency].precision) * 1
                if (this.selects.currency === 'btc') {
                    this.currency[this.selects.currency].price = (this.currency[this.selects.currency].price).toFixed(0) * 1
                }
                this.readonly = false
                this.amountSend = this.currency[this.selects.currency].default
                this.onInputSend()
            }
            this.loading = false
        },
        onInputSend() {
            if (this.selects.currency) {
                this.amountReceive = (this.amountSend * this.currency[this.selects.currency].price).toFixed(2) * 1
                this.disabled = this.amountReceive > this.sth.max || this.currency[this.selects.currency].min > this.amountSend
                this.amountReceiveText = this.amountReceive + ' STH'
            }
        },
        async exchangeStart() {
            await this.getDepositAddress()
            const price = (await axios.get(exchange.API + '/api/price/XBTSX.STH/' + this.currency[this.selects.currency].asset)).data
            this.sth.max = price.limits.max
            this.currency[this.selects.currency].price = (price.exchange.highest_bid * 1).toFixed(this.currency[this.selects.currency].precision) * 1
            this.onInputSend()
            this.exchangeModal = this.amountReceive < this.sth.max
        },
        notifyVue(verticalAlign, horizontalAlign, type = 'success', msg = 'Success') {
            this.$notify({
                message: msg,
                timeout: 12000,
                icon: 'tim-icons icon-bell-55',
                horizontalAlign: horizontalAlign,
                verticalAlign: verticalAlign,
                type: type
            });
        },
    },
    async created() {
        this.getCurrency()
    }
}
</script>

<style>
  .text-receive input {
    /*color: #fff !important;*/
    cursor: default;
  }

  .modal.modal-exchange .modal-content {
    background: #606c88;
    background: -moz-linear-gradient(45deg, #606c88 0%, #3f4c6b 100%);
    background: -webkit-linear-gradient(45deg, #606c88 0%, #3f4c6b 100%);
    background: linear-gradient(45deg, #606c88 0%, #3f4c6b 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#606c88', endColorstr='#3f4c6b', GradientType=1);
    /*color: #ffffff;*/
  }

  .modal-exchange .modal-dialog {
    max-width: 515px;
  }

  .modal-history .modal-dialog {
    max-width: 98%;
  }

  .modal-history .modal-body {
    max-height: 78vh;
    overflow-y: auto;
  }

  .modal.modal-history .modal-content {
    background: #606c88;
    background: -moz-linear-gradient(45deg, #606c88 0%, #3f4c6b 100%);
    background: -webkit-linear-gradient(45deg, #606c88 0%, #3f4c6b 100%);
    background: linear-gradient(45deg, #606c88 0%, #3f4c6b 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#606c88', endColorstr='#3f4c6b', GradientType=1);
    /*color: #ffffff;*/
  }

  .truncate {
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .form-control[readonly] {
    color: #fff;
  }

  .white-content .form-control[readonly] {
    color: #000;
  }

  label {
    margin-bottom: 0.1rem;
  }

</style>
