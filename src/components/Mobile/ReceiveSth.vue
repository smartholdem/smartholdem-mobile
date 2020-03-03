<template>
  <div>
    <card v-if="show" class="top-layer">
      <h4 @click="close" class="p-3 text-uppercase w-100 text-center"><i class="tim-icons icon-double-left float-left pt-1"></i> <span class="text-center">Receive STH</span></h4>
      <p class="pt-3 text-center">Click on the address to copy</p>
      <el-tooltip
        :content="toolTipsContent.copy"
        effect="light"
        :open-delay="300"
        placement="top"
      >
      <p class="text-center font-weight-bolder" v-clipboard="() => address" v-clipboard:success="clipboardSuccessHandler"><i class="tim-icons icon-single-copy-04 pointer"></i> {{address}}</p>
      </el-tooltip>
      <div class="text-center mt-4">
        <VueQrcode v-if="address" class="qr-wallet" :value="qrData" :options="{size:192}"/>
      </div>

      <div>
      <base-input
        type="text"
        label="Amount"
        placeholder="Enter Amount"
        addon-left-icon="tim-icons icon-coins"
        v-model="model.amount"
      >
      </base-input>

        <base-input
          type="text"
          label="Memo"
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
    address: null,
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
          asset: 'sth'
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
      }
    },
    clipboardSuccessHandler({value, event}) {
      this.toolTipsContent.copy = 'Copied to clipboard';
      setTimeout(() => (this.toolTipsContent.copy = 'Copy'), 1500);
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
