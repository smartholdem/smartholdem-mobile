<template>
  <div>
    <div v-if="show" class="top-layer">
      <h4 @click="close" class="p-3 text-uppercase w-100 text-center"><i class="tim-icons icon-double-left float-left pt-1"></i> <span class="text-center">Receive STH</span></h4>
      <p class="p-3">Click on the address to copy to the clipboard</p>
      <el-tooltip
        :content="toolTipsContent.copy"
        effect="light"
        :open-delay="300"
        placement="top"
      >
      <p class="text-center font-weight-bolder" v-clipboard="() => address" v-clipboard:success="clipboardSuccessHandler"><i class="tim-icons icon-single-copy-04 pointer"></i> {{address}}</p>
      </el-tooltip>
      <div class="text-center mt-4">
        <VueQrcode v-if="address" class="qr-wallet" :value="address" :options="{size:192}"/>
      </div>
    </div>
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
      toolTipsContent: {
        copy: "Copy"
      }
    }
  },
  components: {
    VueQrcode,
  },
  methods: {
    async close() {
      this.$emit('onQrClose')
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
    background: #fff;
    height: 100vh;
    width: 100%;
  }

</style>
