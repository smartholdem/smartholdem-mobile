<template>
  <div>
    <card v-if="show" class="top-layer">
      <h4 @click="close" class="p-3 text-uppercase w-100 text-center"><i class="tim-icons icon-double-left float-left pt-1"></i>
        <span v-show="!isContact" class="text-center">{{$t('WALLET.RECEIVE')}} STH</span>
        <span v-show="isContact" class="text-center">Contact Address</span>
      </h4>
      <p v-show="label" class="text-center">{{label}}</p>
      <p class="pt-3 text-center">{{$t('APP.ADDR_COPY')}}</p>
      <el-tooltip
        :content="mixval.copied"
        v-clipboard:success="clipboardSuccess"
        v-clipboard:copy="address"
        effect="light"
      >
      <p class="text-center"

      >{{address}}</p>
      </el-tooltip>
      <div class="text-center mt-4">
        <VueQrcode v-if="address" class="qr-wallet" :value="qrData" :options="{size:192}"/>
      </div>

      <div v-show="!isContact">
      <base-input
        type="text"
        :label="$t('WALLET.AMOUNT')"
        placeholder="Enter Amount"
        addon-left-icon="tim-icons icon-coins"
        v-model="model.amount"
      >
      </base-input>

        <base-input
          type="text"
          :label="$t('WALLET.MEMO')"
          placeholder="Enter Memo"
          addon-left-icon="tim-icons icon-paper"
          v-model="model.memo"
        >
        </base-input>
      </div>
    </card>
  </div>
</template>

<script>
import VueQrcode from '@/util/QRCode'

export default {
  name: "ReceiveSth",
  props: {
    show: false,
    address: '',
    label: '',
    isContact: false,
  },
  data() {
    return {
      model: {
        amount: '',
        memo: '',
      },
      toolTipsContent: {
        copy: "Copy"
      }
    }
  },
  components: {
    VueQrcode,
  },
  computed: {
    qrData() {
      return JSON.stringify(
        {
          a: this.address,
          amount: this.model.amount || null,
          vendorField: this.model.memo || null,
          asset: 'sth',
          label: this.label || null
        }
      )
    }
  },
  methods: {
    async close() {
      this.$emit('onQrClose')
      this.model =  {
        amount: '',
        memo: '',
        label: '',
      }
    },
  },
}
</script>

<style>
  .top-layer {
    position: fixed;
    z-index: 10000;
    top: 0;
    left: 0;
    /*background: #fff;*/
    height: 100vh;
    width: 100%;
    border-radius:0;
  }

</style>
