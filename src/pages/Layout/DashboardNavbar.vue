<template>
  <base-nav
    v-model="showMenu"
    class="navbar-absolute top-navbar"
    :type="!darkMode ? 'white' : ''"
    :transparent="false"
  >
    <div slot="brand" class="navbar-wrapper">
      <div class="navbar-minimize d-inline">
        <sidebar-toggle-button/>
      </div>
      <div
        class="navbar-toggle d-inline"
        :class="{ toggled: $sidebar.showSidebar }"
      >
        <button type="button" class="navbar-toggler" @click="toggleSidebar">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </button>
      </div>

      <!--
      <router-link v-if="$root.isMobile" to="/wallet" class="text-decoration-none font-weight-normal text-dark" style="font-size: 20px;"> <img src="/images/sth48.png" width="24x"> {{accountBalanceSTH}}</router-link>
      <base-dropdown
        v-if="!$root.isMobile"
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        title-classes="nav-link"
        class="navbar-brand currency-balance"
      >
        <template
          slot="title"
          style="color: rgb(9, 223, 251) !important;"
        >

          <el-tooltip
            :visible-arrow="false"
            :content="'1 ' + defaultCurrency.ticker + ' = ' + (1 / prices[defaultCurrency.ticker]).toFixed(2) + ' STH'"
            :open-delay="300"
            placement="bottom"
          >
            <span class="text-decoration-none font-weight-normal" style=""> <img src="/images/sth48.png" width="20px"> {{accountBalanceSTH}} <small
              class="color-brown font-weight-bold">STH </small>
              <span
              style="font-size: 0.9em;color: lightslategray;border: solid 1px lightslategray;"
              class="badge badge-white font-weight-normal">{{defaultCurrency.symbol}}{{accountBalance}}</span></span>
          </el-tooltip>
        </template>

        <li class="nav-link bg-white" v-for="(item, idx) in currencies" :key="idx">
          <span @click="setDefaultCurrency(item.ticker, item.symbol, item.precision)" class="nav-item dropdown-item">{{item.title}} {{item.symbol}}</span>
        </li>
      </base-dropdown>
      -->
    </div>

    <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">

      <a class="navbar-brand" @click="toggleMode"><i class="tim-icons icon-bulb-63 pb-1"></i> Dark or Light</a>


      <base-dropdown
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        title-classes="nav-link"
        class="nav-item"
      >
        <template
          slot="title"
        >
          <div class="notification-green d-none d-lg-block d-xl-block"></div>
          <i title="online" class="tim-icons icon-wifi text-green"></i>
          <p class="d-lg-none">Connection</p>
        </template>
        <li class="nav-link">
          <span class="nav-item dropdown-item color-orange">Manage Networks</span>
        </li>
        <li class="nav-link">
          <span class="nav-item dropdown-item color-orange">Main Network (STH)</span>
        </li>
      </base-dropdown>

      <base-dropdown
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        title-classes="nav-link"
        class="nav-item"
      >
        <template
          slot="title"
        >
          <div class="d-none d-lg-block d-xl-block"></div>
          <i class="tim-icons icon-sound-wave"></i>
          <p class="d-lg-none">Networks</p>
        </template>

        <li class="nav-link">
          <span class="nav-item dropdown-item color-orange"
             style="min-width:220px;float:left;border-bottom: solid 1px #eee;clear:both;"
          >
            <span class="float-left">Peer</span><span class="float-right">{{seed.url}}</span>
          </span>
        </li>
        <li class="nav-link">
          <span class="nav-item dropdown-item color-orange"><span>Height</span><span class="float-right">{{numericFormat('# ##0.', blockchainStatus.height)}}</span></span>
        </li>
        <li class="nav-link">
          <span class="nav-item dropdown-item color-orange">Delay <span class="float-right">{{seed.delay}}ms</span></span>
        </li>
      </base-dropdown>

      <base-dropdown
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        class="nav-item"
        title-classes="nav-link"
        menu-classes="dropdown-navbar"
      >
        <template
          slot="title"
        >
          <div class="photo">
            <i class="tim-icons icon-molecule-40"></i>
          </div>
          <b class="caret d-none d-lg-block d-xl-block"></b>
          <p class="d-lg-none">APP</p>
        </template>
        <li class="nav-link">
          <span class="nav-item dropdown-item color-orange"><i class="tim-icons icon-settings-gear-63"></i> Settings</span>
        </li>
        <div class="dropdown-divider"></div>
        <li class="nav-link ">
          <router-link to="/welcome" class="nav-item dropdown-item color-orange"><i class="tim-icons icon-lock-circle"></i> Lock
          </router-link>
        </li>
        <li class="nav-link" @click="showReset = true">
          <span class="nav-item dropdown-item color-orange"><i class="tim-icons icon-simple-remove"></i> {{$t('APP.RESET')}}</span>
        </li>
      </base-dropdown>
    </ul>
    <ResetAll :modalReset="showReset" @onResetCancel="showReset = false"/>
  </base-nav>
</template>
<script>
import {CollapseTransition} from 'vue2-transitions';
import {BaseNav, Modal} from '@/components';
import SidebarToggleButton from './SidebarToggleButton';
import ResetAll from '@/components/Wallet/ResetAll'
import Avatar from '@/components/Avatar'
import NumberFormat from 'number-format.js'
export default {
  components: {
    SidebarToggleButton,
    CollapseTransition,
    BaseNav,
    Modal,
    ResetAll,
    Avatar,
  },
  data() {
    return {
      darkMode: false,
      showReset: false,
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: '',
    };
  },
  computed: {
    seed() {
      return this.$store.getters['network/seed']
    },
    wallets() {
      let balances = (this.$store.getters['wallet/balances'])
      let keys = Object.keys(balances.accounts)
      return JSON.stringify(keys)
    },
    routeName() {
      const {name} = this.$route;
      return this.capitalizeFirstLetter(name);
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
    accountBalanceSTH() {
      let balances = this.$store.getters['wallet/balances']
      return (balances.totalBalance).toFixed(2)
    },
    currencies() {
      return this.$store.getters['wallet/currencies']
    },
    defaultCurrency() {
      return this.$store.getters['wallet/defaultCurrency']
    },
    prices() {
      return this.$store.getters['wallet/marketPrice']
    },
    accountBalance() {
      return (this.accountBalanceSTH * this.prices[this.defaultCurrency.ticker]).toFixed(this.defaultCurrency.precision)
    },
    blockchainStatus() {
      return this.$store.getters['blockchain/status']
    },
  },
  methods: {
    toggleMode() {
      let docClasses = document.body.classList;
      this.darkMode = !this.darkMode
      if (this.darkMode) {
        docClasses.remove('white-content');
      } else {
        docClasses.add('white-content');
      }
    },
    numericFormat(format, amount) {
      return NumberFormat(format, amount)
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    clipboardSuccessHandler({value, event}) {
      this.toolTipsContent.copy = 'Copied to clipboard';
      setTimeout(() => (this.toolTipsContent.copy = 'Copy My Address'), 1500);
    },
    async setDefaultCurrency(ticker, symbol, precision) {
      await this.$store.dispatch('wallet/setDefaultCurrency', {
        ticker: ticker,
        symbol: symbol,
        precision: precision
      })
    },
  }
};
</script>
<style scoped>
  .top-navbar {
    top: 0px;
    position: fixed;
    /*background: #f5f6fa !important;*/
  }

  .currency-balance .dropdown-menu {
    max-height: 91vh !important;
    overflow-y: auto;
  }

  .dropdown-menu span:hover {
    /*color: #000 !important;*/
  }

  .dropdown-menu .dropdown-item, .bootstrap-select .dropdown-menu.inner li a {
    margin: 0 !important;
  }

  .currency-balance .nav-link {
    display: block;
  }

  .currency-balance {
    padding-top: 8px !important;
  }

  .notification-green {
    background: #78f902;
    color: #ffffff;
    border-radius: 0.875rem;
    height: 6px;
    width: 6px;
    position: absolute;
    text-align: center;
    font-size: 12px;
    font-weight: 800;
    top: 10px;
    right: 10px;
    border: 1px solid #04960f;
  }

</style>
