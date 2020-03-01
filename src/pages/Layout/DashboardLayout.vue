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
            name: 'Wallets',
            icon: 'tim-icons icon-wallet-43',
            path: '/wallet'
          }"
          >
          </sidebar-item>

          <span v-if="!$root.isMobile">
          <sidebar-item
            :link="{
            name: 'Contacts',
            icon: 'tim-icons icon-book-bookmark',
            path: '/contacts'
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
            name: 'Vote listing XBTS',
            icon: 'tim-icons icon-trophy',
            path: '/xbts-listing'
          }"
          >
          </sidebar-item>
</span>

          <!--
          <sidebar-item
            :link="{
            name: $t('sidebar.components'),
            icon: 'tim-icons icon-molecule-40'
          }"
          >
            <sidebar-item :link="{ name: $t('sidebar.multiLevelCollapse') }">
              <sidebar-item
                :link="{
                name: $t('sidebar.example'),
                isRoute: false,
                path: 'https://google.com',
                target: '_blank'
              }"
              ></sidebar-item>
            </sidebar-item>

            <sidebar-item
              :link="{ name: $t('sidebar.buttons'), path: '/components/buttons' }"
            ></sidebar-item>
            <sidebar-item
              :link="{
              name: $t('sidebar.gridSystem'),
              path: '/components/grid-system'
            }"
            ></sidebar-item>
            <sidebar-item
              :link="{ name: $t('sidebar.panels'), path: '/components/panels' }"
            ></sidebar-item>
            <sidebar-item
              :link="{
              name: $t('sidebar.sweetAlert'),
              path: '/components/sweet-alert'
            }"
            ></sidebar-item>
            <sidebar-item
              :link="{
              name: $t('sidebar.notifications'),
              path: '/components/notifications'
            }"
            ></sidebar-item>
            <sidebar-item
              :link="{ name: $t('sidebar.icons'), path: '/components/icons' }"
            ></sidebar-item>
            <sidebar-item
              :link="{
              name: $t('sidebar.typography'),
              path: '/components/typography'
            }"
            ></sidebar-item>
          </sidebar-item>
          -->
          <!--
          <sidebar-item
            :link="{ name: $t('sidebar.forms'), icon: 'tim-icons icon-notes' }"
          >
            <sidebar-item
              :link="{ name: $t('sidebar.regularForms'), path: '/forms/regular' }"
            ></sidebar-item>
            <sidebar-item
              :link="{
              name: $t('sidebar.extendedForms'),
              path: '/forms/extended'
            }"
            ></sidebar-item>
            <sidebar-item
              :link="{
              name: $t('sidebar.validationForms'),
              path: '/forms/validation'
            }"
            ></sidebar-item>
            <sidebar-item
              :link="{ name: $t('sidebar.wizard'), path: '/forms/wizard' }"
            ></sidebar-item>
          </sidebar-item>
          <sidebar-item
            :link="{
            name: $t('sidebar.tables'),
            icon: 'tim-icons icon-puzzle-10'
          }"
          >
            <sidebar-item
              :link="{
              name: $t('sidebar.regularTables'),
              path: '/table-list/regular'
            }"
            ></sidebar-item>
            <sidebar-item
              :link="{
              name: $t('sidebar.extendedTables'),
              path: '/table-list/extended'
            }"
            ></sidebar-item>
            <sidebar-item
              :link="{
              name: $t('sidebar.paginatedTables'),
              path: '/table-list/paginated'
            }"
            ></sidebar-item>
          </sidebar-item>
          <sidebar-item
            :link="{
            name: $t('sidebar.charts'),
            icon: 'tim-icons icon-chart-bar-32',
            path: '/charts'
          }"
          ></sidebar-item>
          -->
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
        <!--<span class="pin-btn"><i class="tim-icons icon-check-2 pt-3"></i></span>-->

      </div>
    </div>

    <!-- global modals -->
    <div v-if="modal.label.show">
      <ModalSetLabel :showModal="modal.label.show" :address="modal.label.address"
                     @onModalClose="modal.label.show = false"/>
    </div>

    <ModalUnlock :modalPin="modal.unlock.show" @onUnlockClose="modal.unlock.show = false"/>

    <div v-if="modal.contacts.show">
      <ModalAddContact :showModal="modal.contacts.show" @onModalClose="modal.contacts.show = false"/>
    </div>

    <div v-if="modal.vote.show">
      <ModalTxVote :showModalVote="modal.vote.show" :voteData="modal.vote.data"
                   @onModalClose="modal.vote.show = false"/>
    </div>

    <div v-if="modal.send.show">
      <ModalTxSend :showModal="modal.send.show" :address="modal.send.address" @onModalClose="modal.send.show = false"/>
    </div>

  </div>

</template>
<script>
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
import ModalUnlock from '@/components/Wallet/Unlock'
import ModalAddContact from '@/components/Wallet/ModalAddContact'
import ModalTxSend from '@/components/Wallet/ModalTxSend'
import ModalTxVote from '@/components/Wallet/ModalTxVote'

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
    ModalUnlock,
    ModalAddContact,
    ModalTxSend,
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
        contacts: {
          show: false,
        },
        send: {
          show: false,
          address: ''
        },
      },
      sidebarBackground: 'red' //vue|blue|orange|green|red|primary
    };
  },

  async created() {
    if (!this.$store.getters['app/pinEncrypted']) {
      this.$router.push({path: '/register'})
    } else if (!this.$root.pin) {
      //this.$router.push({path: '/lock'})
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
        contacts: {
          show: false,
        },
        send: {
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

    this.$eventBus.on('modal:contacts', async () => {
      this.modal.contacts.show = false
      this.modal.contacts.show = true
    })

    this.$eventBus.on('modal:send', async (address) => {
      this.modal.send.show = false
      this.modal.send.address = address
      this.modal.send.show = true
    })


    await this.$store.dispatch('network/getSeed')

  },
  methods: {
    async validatePin() {
      if (this.pin.length > 3 && this.$store.getters['app/pinEncrypted']) {
        let decryptPin = await this.$store.dispatch('app/validatePinCode', this.pin)
        if (decryptPin) {
          this.$root.pin = decryptPin
          this.modal.unlock.show = false
          this.pin = ''
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
      } else {
        this.pin = this.pin + num
        await this.validatePin()
      }
      console.log('this.pin', this.pin)
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
    background: #fff;
    height: 100vh;
    width: 100%;
  }

  .fill-pin {
    text-align: center;
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
    margin: 10px;
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
</style>
