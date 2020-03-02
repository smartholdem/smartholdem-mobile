<template>
  <div>
    <p>Нажмите на адрес чтобы скопировать в буфер обмена</p>
    <p>{{address}}</p>
    <div>
      <VueQrcode v-if="address" class="qr-wallet" :value="address" :options="{size:128}"/>
    </div>
  </div>
</template>

<script>
import VueQrcode from '@/util/QRCode'

export default {
  name: "ReceiveSth",
  props: {
    address: null,
  },
  components: {
    VueQrcode,
  },
}
</script>

<style scoped>

</style>
