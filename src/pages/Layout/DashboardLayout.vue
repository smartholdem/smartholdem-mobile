<template>
  <div>
    <!--<system-menu/>-->
    <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
      <notifications></notifications>
      <sidebar-fixed-toggle-button/>
      <side-bar
        :background-color="sidebarBackground"
        :short-title="$t('sidebar.shortTitle')"
        :title="$t('sidebar.title')"
      >
        <template slot-scope="props" slot="links">
          <sidebar-item
            v-if="!$root.isMobile"
            :link="{
            name: $t('sidebar.dashboard'),
            icon: 'tim-icons icon-chart-bar-32',
            path: '/dashboard'
          }"
          >
          </sidebar-item>

          <sidebar-item
            :link="{
            name: $t('PG.WALLETS'),
            icon: 'tim-icons icon-wallet-43',
            path: '/wallet'
          }"
          >
          </sidebar-item>

          <sidebar-item
            :link="{
            name: $t('PG.CONTACTS'),
            icon: 'tim-icons icon-book-bookmark',
            path: '/contacts'
          }"
          >
          </sidebar-item>

          <sidebar-item
            :link="{
            name: $t('PG.DELEGATES'),
            icon: 'tim-icons icon-bank',
            path: '/delegates'
          }"
          >
          </sidebar-item>

          <sidebar-item
            :link="{
            name: 'SmartHolder',
            icon: 'tim-icons icon-money-coins',
            path: '/smartholder'
          }"
          >
          </sidebar-item>

          <sidebar-item
            :link="{
            name: $t('PG.SET'),
            icon: 'tim-icons icon-settings-gear-63',
            path: '/settings'
          }"
          >
          </sidebar-item>

          <sidebar-item
            :link="{
            name: $t('PG.QUIT'),
            icon: 'tim-icons icon-button-power',
            path: '/welcome'
          }"
          >
          </sidebar-item>


        </template>
      </side-bar>

      <div class="main-panel" :data="sidebarBackground">
        <dashboard-navbar></dashboard-navbar>
        <router-view name="header"></router-view>

        <div
          :class="{ content: !$route.meta.hideContent }"
          @click="toggleSidebar"
        >
          <zoom-center-transition :duration="200" mode="out-in">
            <!-- sth content here -->
            <router-view></router-view>
          </zoom-center-transition>
        </div>
        <!--<content-footer v-if="!$route.meta.hideFooter"></content-footer>-->
      </div>
    </div>


    <div v-if="modal.unlock.show" class="pin-layer p-2">
      <span @click="closePinLayer" class="float-right"><i class="tim-icons icon-simple-remove"
                                                          style="font-size: 1.2em;"></i></span>
      <h4 class="text-center">Enter PIN-Code</h4>
      <div class="p-4 pl-5 mt-3">
        <div class="fill-pin w-100 p-2 ml-4 float-left mb-4">
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 0 ? 'pin-filled' : '')"></span>
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 1 ? 'pin-filled' : '')"></span>
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 2 ? 'pin-filled' : '')"></span>
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 3 ? 'pin-filled' : '')"></span>
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 4 ? 'pin-filled' : '')"></span>
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 5 ? 'pin-filled' : '')"></span>
        </div>

        <base-button @click="pinPress('1')" type="default" round simple class="pin-btn font-weight-light">1
        </base-button>
        <base-button @click="pinPress('2')" type="default" round simple class="pin-btn font-weight-light">2
        </base-button>
        <base-button @click="pinPress('3')" type="default" round simple class="pin-btn font-weight-light">3
        </base-button>
        <base-button @click="pinPress('4')" type="default" round simple class="pin-btn font-weight-light">4
        </base-button>
        <base-button @click="pinPress('5')" type="default" round simple class="pin-btn font-weight-light">5
        </base-button>
        <base-button @click="pinPress('6')" type="default" round simple class="pin-btn font-weight-light">6
        </base-button>
        <base-button @click="pinPress('7')" type="default" round simple class="pin-btn font-weight-light">7
        </base-button>
        <base-button @click="pinPress('8')" type="default" round simple class="pin-btn font-weight-light">8
        </base-button>
        <base-button @click="pinPress('9')" type="default" round simple class="pin-btn font-weight-light">9
        </base-button>
        <base-button @click="pinPress('0')" type="default" round simple class="pin-btn font-weight-light">0
        </base-button>
        <span @click="pinPress('del')" class="pin-btn"><i class="fas fa-backspace pt-3"></i></span>
      </div>
    </div>

    <!-- global modals -->
    <div v-if="modal.label.show">
      <ModalSetLabel :showModal="modal.label.show" :address="modal.label.address"
                     @onModalClose="modal.label.show = false"/>
    </div>

    <div v-if="modal.vote.show">
      <ModalTxVote :showModalVote="modal.vote.show" :voteData="modal.vote.data"
                   @onModalClose="modal.vote.show = false"/>
    </div>

    <div v-if="modal.send.show">
      <ModalTxSend :showModal="modal.send.show" :address="modal.send.address" @onModalClose="modal.send.show = false"/>
    </div>

    <div v-if="modal.private.show">
      <ModalPrivate :showModal="modal.private.show" :address="modal.private.address"
                    @onModalClose="modal.private.show = false"/>
    </div>

    <div v-if="modal.qr.show">
      <ReceiveSth :show="modal.qr.show" :address="modal.qr.address" :label="modal.qr.label"
                  :isContact="modal.qr.isContact" @onQrClose="modal.qr.show = false"/>
    </div>

  </div>

</template>
<script>
// const soundTxIn = new Audio('sounds/txin.mp3')

/* eslint-disable no-new */
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}


import DashboardNavbar from './DashboardNavbar.vue';
import ContentFooter from './ContentFooter.vue';
import DashboardContent from './Content.vue';
import SidebarFixedToggleButton from './SidebarFixedToggleButton.vue';
import {SlideYDownTransition, ZoomCenterTransition} from 'vue2-transitions';
//import SystemMenu from 'src/components/SystemMenu.vue'
import ModalSetLabel from '@/components/Wallet/ModalSetLabel'
import ModalAddContact from '@/components/Wallet/ModalAddContact'
import ModalTxSend from '@/components/Wallet/ModalTxSend'
import ModalTxVote from '@/components/Wallet/ModalTxVote'
import ModalPrivate from '@/components/Wallet/ModalPrivate'
import ReceiveSth from '@/components/Mobile/ReceiveSth'

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
    SidebarFixedToggleButton,
    DashboardContent,
    SlideYDownTransition,
    ZoomCenterTransition,
//    SystemMenu,
    ModalSetLabel,
    ModalTxVote,
    ModalAddContact,
    ModalTxSend,
    ModalPrivate,
    ReceiveSth,
  },
  data() {
    return {
      pin: '',
      modal: {
        label: {
          show: false,
          address: ''
        },
        vote: {
          show: false,
          data: {
            username: '',
          }
        },
        unlock: {
          show: false,
        },
        send: {
          show: false,
          address: ''
        },
        qr: {
          show: false,
          address: '',
          label: '',
          isContact: false,
        },
        private: {
          show: false,
          address: ''
        },
      },
      sidebarBackground: 'red' //vue|blue|orange|green|red|primary
    };
  },
  async created() {
    if (!this.$store.getters['app/pinEncrypted'] || !this.$root.pin) {
      this.$router.push({path: '/welcome'})
    }
    await this.getFees()

    this.$eventBus.on('close:modal', async () => {
      this.modal = {
        label: {
          show: false,
          address: ''
        },
        vote: {
          show: false,
          data: {}
        },
        unlock: {
          show: false,
        },
        send: {
          show: false,
          address: ''
        },
        qr: {
          show: false,
          address: '',
          label: '',
          isContact: false,
        },
        private: {
          show: false,
          address: ''
        },
      }
    })

    this.$eventBus.on('modal:label', async (address) => {
      this.modal.label.show = false
      this.modal.label.address = address
      this.modal.label.show = true
      await this.$store.dispatch('wallet/getBalances')
    })

    this.$eventBus.on('modal:unlock', async () => {
      this.modal.unlock.show = false
      this.modal.unlock.show = true
    })

    this.$eventBus.on('modal:vote', async (data) => {
      this.modal.vote.show = false
      this.modal.vote.data = data
      this.modal.vote.show = true
    })

    this.$eventBus.on('modal:send', async (address) => {
      this.modal.send.show = false
      this.modal.send.address = address
      this.modal.send.show = true
    })

    this.$eventBus.on('modal:qr', async (options) => {
      this.modal.qr.show = false
      this.modal.qr.address = options.address
      this.modal.qr.label = options.label || null
      this.modal.qr.isContact = options.isContact || false
      this.modal.qr.show = true
    })

    this.$eventBus.on('modal:private', async (options) => {
      this.modal.private.show = false
      this.modal.private.address = options.address
      this.modal.private.show = true
    })

    this.$eventBus.on('notify:txin', async (options) => {
      // soundTxIn.play()
    })

    await this.$store.dispatch('network/getSeed')

  },
  methods: {
    async validatePin() {
      if (this.pin.length === 6 && this.$store.getters['app/pinEncrypted']) {
        let decryptPin = await this.$store.dispatch('app/validatePinCode', this.pin)
        if (decryptPin) {
          this.$root.pin = decryptPin
          this.modal.unlock.show = false
          this.pin = ''
        } else {

        }
      }
    },
    async closePinLayer() {
      this.modal.unlock.show = false
      this.pin = ''
    },
    async pinPress(num) {
      if (num === 'del') {
        this.pin = this.pin.substr(0, this.pin.length - 1)
      } else if (this.pin.length < 6) {
        this.pin = this.pin + num
        await this.validatePin()
      }
    },
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    initScrollbar() {
      let docClasses = document.body.classList;
      let isWindows = navigator.platform.startsWith('Win');
      if (isWindows) {
        // if we are on windows OS we activate the perfectScrollbar function
        initScrollbar('sidebar');
        initScrollbar('main-panel');
        initScrollbar('sidebar-wrapper');

        docClasses.add('perfect-scrollbar-on');
      } else {
        docClasses.add('perfect-scrollbar-off');
      }
    },
    async getFees() {
      await this.$store.dispatch('blockchain/getFees')
    }
  },
  mounted() {
    // this.initScrollbar();
  }
};
</script>
<style lang="scss">
  .pin-layer {
    position: fixed;
    z-index: 10000;
    top: 0;
    left: 0;
    /*background: #fff;*/
    height: 100vh;
    width: 100%;
  }

  .fill-pin {
    text-align: center;
    max-width: 202px;
  }

  .fill-pin-item {
    width: 15px;
    height: 15px;
    float: left;
    margin: 6px;
    border: solid 1px #ccc;
    border-radius: 50%;
  }

  .pin-filled {
    background: red;
    border: solid 1px red;
  }

  .pin-btn {
    width: 60px;
    height: 60px;
    float: left;
    text-align: center;
    margin: 3%;
    font-size: 2.3em;
    padding: 0px !important;
  }

  $scaleSize: 0.95;
  @keyframes zoomIn95 {
    from {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
    to {
      opacity: 1;
    }
  }

  .main-panel .zoomIn {
    animation-name: zoomIn95;
  }

  @keyframes zoomOut95 {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
  }

  .main-panel .zoomOut {
    animation-name: zoomOut95;
  }

  .modal.show .modal-dialog {
    -webkit-transform: translate(0, 0%);
    transform: translate(0, 0%);
  }
</style>
