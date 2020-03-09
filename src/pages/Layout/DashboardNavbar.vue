<template>
  <base-nav
    v-model="showMenu"
    class="navbar-absolute top-navbar"
    :type="!settings.darkMode ? 'white' : 'dark'"
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

    </div>

    <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">


      <!--
      <base-dropdown
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        title-classes="nav-link"
        class="nav-item text-uppercase"
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
      -->

      <base-dropdown
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        title-classes="nav-link"
        class="nav-item text-uppercase"
      >
        <template
          slot="title"
        >
          <div class="d-none d-lg-block d-xl-block"></div>
          <i class="tim-icons icon-wifi"></i>
          <p class="d-lg-none">{{$t('APP.CONNECTION')}}</p>
        </template>

        <li class="nav-link">
          <span class="nav-item dropdown-item color-orange"
             style="min-width:220px;float:left;clear:both;"
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

      <!--
      <li class="nav-item mt-3 mb-2">
        <span @click="navRoute('/settings')" class="ml-1 text-uppercase">
          <i class="mr-2 tim-icons icon-settings-gear-63"></i> {{$t('APP.SETTINGS')}}
        </span>
      </li>
      -->
      <li class="nav-item mt-3 mb-2">
        <span @click="toggleMode" class="ml-1 text-uppercase"><i class="tim-icons icon-bulb-63 pb-1 mr-2"></i> {{$t('SET.MODE')}}</span>
      </li>

    </ul>
  </base-nav>
</template>
<script>

import {CollapseTransition} from 'vue2-transitions';
import {BaseNav, Modal} from '@/components';
import SidebarToggleButton from './SidebarToggleButton';
import Avatar from '@/components/Avatar'
import NumberFormat from 'number-format.js'

export default {
  components: {
    SidebarToggleButton,
    CollapseTransition,
    BaseNav,
    Modal,
    Avatar,
  },
  data() {
    return {
      darkMode: false,
      showMenu: false,
    };
  },
  computed: {
    settings() {
      let result = this.$store.getters['app/settings']
      return result
    },
    seed() {
      return this.$store.getters['network/seed']
    },
    routeName() {
      const {name} = this.$route;
      return this.capitalizeFirstLetter(name);
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
    blockchainStatus() {
      return this.$store.getters['blockchain/status']
    },
  },
  methods: {
    navRoute(path) {
      this.toggleMenu()
      this.$router.push({path: path})
    },
    async toggleMode() {
      this.toggleMenu()
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
    },
    numericFormat(format, amount) {
      return NumberFormat(format, amount)
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
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
