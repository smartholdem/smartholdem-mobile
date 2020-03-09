<template>
  <div>
    <div class="row">

      <div class="pl-3 pr-3 pt-3">
        <div class="mb-3">
          <span class="badge badge-success big-badge mr-1">SmartHolders <span class="font-weight-bolder p-2">{{holders.total.holders}}</span></span>
          <span class="badge badge-success big-badge">Total Hold <span class="font-weight-bolder p-2">{{(holders.total.realAmount * 1).toFixed(0)}}</span> STH</span>

          <span class="btn btn-outline-warning btn-sm float-right pointer m-0"
                @click="navUrl('https://community.smartholdem.io/topic/530/staking-at-xbts-up-to-50-of-trading-profit')"
          >
            Join Now
          </span>
          <p class="small">
            The <strong>SmartHOLDER Staking Program</strong> gives benefits to the STH owners. Investing in SmartHoldem
            Coin, you have the right for a share of earnings 50% of the XBTS DEX trading proceeds, which are generated
            by trading fees on the XBTS exchange. Increase your crypto portfolio regardless of how the market moves.
          </p>
          <p class="small">
            You can place your SmartHoldem coins STH and get profit from XBTS twice a month. The stake in the
            SmartHOLDER Staking Program will freeze and block your coins in the blockchain for the timer of 1-3-6-12
            months. The longer duration of the stake provides for the higher pay-out rate. During the staking period you
            will automatically take part in the distribution of payments on the 1st and 15th day of each month.
          </p>
        </div>

        <div>
          <table class="table mb-0 small w-100">
            <thead class="">
            <tr>
              <th scope="col" class="border-bottom-0">Asset</th>
              <th scope="col" class="border-bottom-0">* 50% fees</th>
              <th scope="col" class="border-bottom-0">** progress</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(itemPay, idxPay) in assetsPay" :key="'Pay'+ idxPay" class="pointer">
              <td class="text-left"><img width="24px"
                                         :src="'https://ex.xbts.io/asset-symbols/'+itemPay.ticker.toLowerCase()+'.png'"
                                         class="asset-symbol mr-2"/>
              </td>
              <td class="text-left">{{itemPay.ticker}}<br/>{{(itemPay.accumulated_fees / 2).toFixed(8)}}</td>
              <td class="text-left text-success"><i class="far fa-check-square"></i>&nbsp;
                {{(itemPay.accumulated_fees / itemPay.min * 100).toFixed(0)}}%
              </td>
            </tr>
            <tr v-for="(item,idxNoq) in assetsNoq" :key="idxNoq" class="pointer">
              <td class="text-left"><img width="24px"
                                         :src="'https://ex.xbts.io/asset-symbols/'+item.ticker.toLowerCase()+'.png'"
                                         class="asset-symbol mr-2"/>
              </td>

              <td class="text-left"><span class="">{{item.ticker}}</span><br/>{{(item.accumulated_fees /
                2).toFixed(8)}}
              </td>
              <td class="text-left "><i class="far fa-clock"></i>&nbsp;
                {{(item.accumulated_fees / item.min * 100).toFixed(0)}}%
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import {TabPane, Tabs, Collapse, CollapseItem} from 'src/components';
import {openUrl} from 'src/util/url'

export default {
  name: "SmartHolder",
  components: {
    TabPane,
    Tabs,
    Collapse,
    CollapseItem,
  },
  methods: {
    navUrl(url) {
      openUrl(url)
    },
  },
  computed: {
    assetsNoq() {
      return this.$store.getters['smartholder/assetsNoq']
    },
    assetsPay() {
      return this.$store.getters['smartholder/assetsPay']
    },
    holders() {
      return this.$store.getters['smartholder/holders']
    }
  },
  async created() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    let timestamp = Date.now()
    const currDate = new Date(timestamp);
    const currDay = currDate.getDate()
    let currMonth = currDate.getMonth()
    let currYr = currDate.getFullYear()
    const payDay = currDay > 15 ? 1 : 15

    if (currMonth === 11 && currDay > 15) {
      currMonth = -1
      currYr++
    }
    const payMonth = currDay > 15 ? currMonth + 1 : currMonth
    this.nextPayout = payDay + ' ' + months[payMonth] + ' ' + currYr
  }
}
</script>

<style scoped>
  .main-panel > .content {
    padding: 50px 30px 30px 280px;
  }
</style>
