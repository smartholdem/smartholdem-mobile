<template>
  <div class="row">
    <div :class.sync="'layer-head'+ ' ' + $root.modalColor">
      <router-link to="/wallet" class="back-wallet pl-4 pr-5"><i class="tim-icons icon-minimal-left"></i></router-link>
      <span>Settings</span>
    </div>

    <div class="layer-content w-100">
      <table class="table table-settings w-100">
        <tbody>
        <tr>
          <td><i class="text-danger tim-icons tim-icons-lg icon-world"></i></td>
          <td>Language</td>
          <td class="text-right">
            <base-dropdown
              menu-on-right=""
              tag="div"
              title-classes="btn btn-link"
              title="English"
            >
              <span slot="title">
                English <i class="tim-icons icon-minimal-down pb-1 pl-1"></i>
              </span>
              <span @click="setLocale('en')" class="dropdown-item"> English</span>
              <span @click="setLocale('ru')" class="dropdown-item"> Russian</span>
            </base-dropdown>
          </td>
        </tr>

        <tr>
          <td><i class="text-danger tim-icons tim-icons-lg icon-money-coins"></i></td>
          <td>Currency</td>
          <td class="text-right">
            <base-dropdown
              menu-on-right=""
              class="currency-balance"
              tag="div"
              title-classes="btn btn-link font-weight-normal"
              title="English"
            >
               <span slot="title">
                [{{defaultCurrency.symbol}}] {{defaultCurrency.ticker}} <i class="tim-icons icon-minimal-down pb-1 pl-1"></i>
              </span>
              <li class="" v-for="(item, idx) in currencies" :key="idx">
                <span @click="setDefaultCurrency(item.ticker, item.symbol, item.precision)" class="nav-item dropdown-item">{{item.title}} {{item.symbol}}</span>
              </li>
            </base-dropdown>
          </td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td></td>
        </tr>

        <tr>
          <td><i class="text-danger tim-icons tim-icons-lg icon-bulb-63"></i></td>
          <td>Dark & Light Mode</td>
          <td class="text-right">
            <i class="tim-icons icon-triangle-right-17 pb-1 pl-1"></i>
          </td>
        </tr>


        <tr>
          <td><i class="text-danger tim-icons tim-icons-lg icon-bell-55"></i></td>
          <td>Notifications</td>
          <td class="text-right">
            <i class="tim-icons icon-triangle-right-17 pb-1 pl-1"></i>
          </td>
        </tr>

        <tr class="">
          <td></td>
          <td></td>
          <td></td>
        </tr>

        <tr>
          <td><i class="text-danger tim-icons tim-icons-lg icon-trash-simple"></i></td>
          <td>Reset All Data</td>
          <td class="text-right">
            <i class="tim-icons icon-triangle-right-17 pb-1 pl-1"></i>
          </td>
        </tr>

        <tr>
          <td><i class="text-danger tim-icons tim-icons-lg icon-alert-circle-exc"></i></td>
          <td>Version</td>
          <td class="text-right">
            1.0.0
          </td>
        </tr>


        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
export default {
  name: "Settings",
  computed: {
    defaultCurrency() {
      return this.$store.getters['wallet/defaultCurrency']
    },
    currencies() {
      return this.$store.getters['wallet/currencies']
    },
  },
  methods: {
    async setDefaultCurrency(ticker, symbol, precision) {
      await this.$store.dispatch('wallet/setDefaultCurrency', {
        ticker: ticker,
        symbol: symbol,
        precision: precision
      })
    },
    setLocale(locale) {
      this.$i18n.locale = locale
      this.$store.dispatch('app/setLanguage', locale);
    },
  },
}
</script>

<style scoped>
  .table-settings td {
    padding-left: 15px;
  }

  .table-settings tr {
    border-bottom: solid 1px #2f253575
  }


</style>
