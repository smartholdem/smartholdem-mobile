<template>
  <div>
<!--
    <base-nav
      v-model="showMenu"
      type="white"
      :transparent="false"
      menu-classes="justify-content-end"
      class="auth-navbar fixed-top navbar-gold"
    >
      <ul class="navbar-nav">
        <router-link class="nav-item" tag="li" to="/coin">
          <a class="nav-link">
            <i class="tim-icons icon-world"></i> STH Coin
          </a>
        </router-link>
      </ul>
    </base-nav>
-->

    <div class="wrapper wrapper-full-page">
      <div class="full-page" :class="pageClass">
        <div class="content">
          <zoom-center-transition
            :duration="pageTransitionDuration"
            mode="out-in"
          >
            <router-view></router-view>
          </zoom-center-transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { BaseNav } from 'src/components';
import { ZoomCenterTransition } from 'vue2-transitions';

export default {
  components: {
    BaseNav,
    ZoomCenterTransition
  },
  props: {
    backgroundColor: {
      type: String,
      default: 'black'
    }
  },
  data() {
    return {
      showMenu: false,
      menuTransitionDuration: 250,
      pageTransitionDuration: 200,
      year: new Date().getFullYear(),
      pageClass: 'login-page',
      showFooter: false,
    };
  },
  computed: {
    isElectron() {
      return process.env.IS_ELECTRON
    },
    title() {
      return `${this.$route.name}`;
    },
  },
  methods: {
    toggleNavbar() {
      document.body.classList.toggle('nav-open');
      this.showMenu = !this.showMenu;
    },
    closeMenu() {
      document.body.classList.remove('nav-open');
      this.showMenu = false;
    },
    setPageClass() {
      this.pageClass = `${this.$route.name}-page`.toLowerCase();
    },
    async setDefaultCurrency(ticker, symbol, precision) {
      await this.$store.dispatch('wallet/setDefaultCurrency', {
        ticker: ticker,
        symbol: symbol,
        precision: precision
      })
    },
  },
  beforeDestroy() {
    this.closeMenu();
  },
  beforeRouteUpdate(to, from, next) {
    // Close the mobile menu first then transition to next page
    if (this.showMenu) {
      this.closeMenu();
      setTimeout(() => {
        next();
      }, this.menuTransitionDuration);
    } else {
      next();
    }
  },
  mounted() {
    this.setPageClass();
  },
  watch: {
    $route() {
      this.setPageClass();
    }
  }
};
</script>
<style lang="scss">
  .currency-balance .dropdown-menu {
    max-height: 91vh !important;
    overflow-y: auto;
  }

  .dropdown-menu span:hover {
    color: #000 !important;
  }

  .currency-balance .nav-link {
    display: block;
    padding: 0;
  }

  #front-footer {
    background: #ccc;
    padding: 10px;
    float:left;
    clear:both;
    position: relative;
    width: 100%;
  }

.navbar.auth-navbar {
  top: 0;
}

$scaleSize: 0.8;
@keyframes zoomIn8 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  100% {
    opacity: 1;
  }
}

.wrapper-full-page .zoomIn {
  animation-name: zoomIn8;
}

@keyframes zoomOut8 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}

.wrapper-full-page .zoomOut {
  animation-name: zoomOut8;
}

.navbar-gold {
  background: #fefdf9eb !important;
}

  .full-page > .content {
    padding-bottom: 5px !important;
  }

  body {
    background: #fefdf9;
  }


html {
  overflow-x: hidden;
}

</style>
