<template>
  <div class="row">
    <div class="layer-head">
      <router-link to="/wallet" class="back-wallet pl-4 pr-5"><i class="tim-icons icon-minimal-left"></i></router-link>
      <span>{{$t('PG.SET')}}</span>
    </div>

    <div class="layer-content w-100">
      <table class="table table-settings w-100">
        <tbody>
        <tr>
          <td><i class="text-danger tim-icons tim-icons-lg icon-world"></i></td>
          <td>{{$t('SET.LANG')}}</td>
          <td class="text-right">
            <base-dropdown
              menu-on-right=""
              tag="div"
              title-classes="btn btn-link font-weight-normal"
            >
              <span slot="title">
                {{$t('SET.LANG_NAME')}} <i class="tim-icons icon-minimal-down pb-1 pl-1"></i>
              </span>
              <span @click="setLocale('en')" class="dropdown-item"> English</span>
              <span @click="setLocale('ru')" class="dropdown-item"> Russian</span>
            </base-dropdown>
          </td>
        </tr>

        <tr>
          <td><i class="text-danger tim-icons tim-icons-lg icon-money-coins"></i></td>
          <td>{{$t('SET.CURRENCY')}}</td>
          <td class="text-right">
            <base-dropdown
              menu-on-right=""
              class="currency-balance"
              tag="div"
              title-classes="btn btn-link font-weight-normal"
            >
               <span slot="title">
                [{{defaultCurrency.symbol}}] {{defaultCurrency.ticker}} <i
                 class="tim-icons icon-minimal-down pb-1 pl-1"></i>
              </span>
              <li class="" v-for="(item, idx) in currencies" :key="idx">
                <span @click="setDefaultCurrency(item.ticker, item.symbol, item.precision)"
                      class="nav-item dropdown-item">{{item.title}} {{item.symbol}}</span>
              </li>
            </base-dropdown>
          </td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td></td>
        </tr>

        <tr @click="toggleMode">
          <td><i class="text-danger tim-icons tim-icons-lg icon-bulb-63"></i></td>
          <td>{{$t('SET.MODE')}}</td>
          <td class="text-right">
            <i class="tim-icons icon-triangle-right-17 pb-1 pl-1"></i>
          </td>
        </tr>


        <tr>
          <td><i class="text-danger tim-icons tim-icons-lg icon-bell-55"></i></td>
          <td>{{$t('SET.NOTIF')}}</td>
          <td class="text-right">
            <base-switch
              v-model="settings.notification"
              type="primary"
              on-text="ON"
              off-text="OFF"
            ></base-switch>
          </td>
        </tr>

        <tr class="">
          <td></td>
          <td></td>
          <td></td>
        </tr>

        <tr @click="showReset = !showReset">
          <td><i class="text-danger tim-icons tim-icons-lg icon-trash-simple"></i></td>
          <td>{{$t('SET.CLEAR')}}</td>
          <td class="text-right">
            <i class="tim-icons icon-triangle-right-17 pb-1 pl-1"></i>
          </td>
        </tr>

        <tr>
          <td><i class="text-danger tim-icons tim-icons-lg icon-alert-circle-exc"></i></td>
          <td>{{$t('SET.VER')}}</td>
          <td class="text-right">
            {{packageJson.version}}
          </td>
        </tr>


        </tbody>
      </table>
    </div>

    <div v-if="showReset">
      <ResetAll :modalReset="showReset" @onResetCancel="showReset = false"/>
    </div>

  </div>
</template>

<script>
import ResetAll from '@/components/Wallet/ResetAll'
import packageJson from '../../../package.json'
import {
  BaseSwitch,
} from 'src/components/index';

export default {
  name: "Settings",
  components: {
    ResetAll,
    BaseSwitch,
  },
  data() {
    return {
      settings: {
        notification: false,
      },
      showReset: false,
      packageJson,
      headColor: 'modal-white',
    }
  },
  computed: {
    defaultCurrency() {
      return this.$store.getters['wallet/defaultCurrency']
    },
    currencies() {
      return this.$store.getters['wallet/currencies']
    },
  },
  methods: {
    async toggleMode() {
      this.darkMode = !this.darkMode
      this.$store.dispatch('app/setSettings', {
        darkMode: this.darkMode
      })

      let docClasses = document.body.classList;

      if (this.darkMode) {
        docClasses.remove('white-content');
        this.$root.modalColor = 'modal-dark'
      } else {
        docClasses.add('white-content');
        this.$root.modalColor = 'modal-white'
      }
      this.headColor = this.$root.modalColor
    },
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
  async created() {
    this.headColor = this.$root.modalColor
  }
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
