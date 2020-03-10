<template>
  <div class="row">
    <!-- Stats Cards -->

    <div class="col-md-6 col-lg-6 mt-3">
      <div class="row">
        <div class="col-lg-6 col-md-6">
          <stats-card
            :title="numericFormat('# ##0.', blockchainStatus.supply)"
            sub-title="Total Supply STH"
            type="primary"
            icon="tim-icons icon-coins"
          >
            <div slot="footer" class="w-100"><i class="tim-icons icon-app"></i> Current height <span
              class="text-right float-right">{{numericFormat('# ##0.', blockchainStatus.height)}}</span></div>
          </stats-card>
        </div>

        <div class="col-lg-6 col-md-6">
          <stats-card
            :title="numericFormat('# ##0.', blockchainStatus.txCount)"
            sub-title="Blockchain transactions"
            type="primary"
            icon="tim-icons icon-bullet-list-67"
          >
            <div slot="footer" class="w-100"><i class="tim-icons icon-money-coins"></i> Current tx fee <span
              class="text-right float-right">{{blockchainStatus.fee}} STH</span></div>
          </stats-card>
        </div>

        <div class="col-lg-6 col-md-6">
          <stats-card
            :title="delegates.count.toString()"
            sub-title="Delegates"
            type="primary"
            icon="tim-icons icon-bank"
          >
            <div slot="footer" class="w-100"><i class="tim-icons icon-money-coins"></i> Block reward <span
              class="text-right float-right">{{blockchainStatus.reward}} STH</span></div>
          </stats-card>
        </div>

      </div>
    </div>

  </div>
</template>
<script>
import StatsCard from 'src/components/Cards/StatsCard';
import {colors} from '@/config';
import PriceChart from '@/components/Wallet/PriceChart';
import AddWalletBtns from '@/components/Wallet/AddWalletBtns'
import NumberFormat from 'number-format.js'
import {openUrl} from 'src/util/url'

export default {
  components: {
    StatsCard,
    PriceChart,
    AddWalletBtns,
  },
  data() {
    return {

    };
  },
  computed: {
    enableRTL() {
      return this.$route.query.enableRTL;
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
    blockchainStatus() {
      return this.$store.getters['blockchain/status']
    },
    delegates() {
      return this.$store.getters['blockchain/delegates']
    },
    fees() {
      return this.$store.getters['blockchain/fees']
    },

  },
  methods: {
    navUrl(url) {
      openUrl(url)
    },
    numericFormat(format = '# ##0.', amount) {
      return NumberFormat(format, amount)
    }
  },
  mounted() {
    this.i18n = this.$i18n;
    if (this.enableRTL) {
      this.i18n.locale = 'ar';
      this.$rtl.enableRTL();
    }
  },
  beforeDestroy() {
    if (this.$rtl.isRTL) {
      this.i18n.locale = 'en';
      this.$rtl.disableRTL();
    }
  }
};
</script>
<style></style>
