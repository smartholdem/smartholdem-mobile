import DashboardLayout from 'src/pages/Layout/DashboardLayout.vue';
import AuthLayout from 'src/pages/Pages/AuthLayout.vue';
// GeneralViews
import NotFound from 'src/pages/GeneralViews/NotFoundPage.vue';
//import AuthRequired from '@/util/AuthRequired'

// Dashboard pages
const Dashboard = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Dashboard/Dashboard.vue');

// board pages
const Board = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Dashboard/Board.vue');

// wallet
const Wallet = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Dashboard/Wallet.vue');

const WalletImport = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Dashboard/WalletImport.vue');
const WalletCreate = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Dashboard/WalletCreate.vue');

const Address = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Dashboard/Address.vue');

const AddressView = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Dashboard/AddressReadOnly.vue');

const SmartHolder = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Dashboard/SmartHolder.vue');

const Contacts = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Dashboard/Contacts.vue');

const Delegates = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Dashboard/Delegates.vue');

// Pages
const Welcome = () =>
  import(/* webpackChunkName: "pages" */ 'src/pages/Pages/Welcome.vue');
const LegalLimitations = () =>
  import(/* webpackChunkName: "pages" */ 'src/pages/Pages/LegalLimitations.vue');
const LegalTerms = () =>
  import(/* webpackChunkName: "pages" */ 'src/pages/Pages/LegalTerms.vue');
const LegalWarranties = () =>
  import(/* webpackChunkName: "pages" */ 'src/pages/Pages/LegalWarranties.vue');

let authPages = {
  path: '/',
  component: AuthLayout,
  name: 'Authentication',
  children: [
    {
      path: '/welcome',
      name: 'SmartHoldem',
      component: Welcome
    },
    {
      path: '/legal-limitations',
      name: 'Disclaimers and Limitation of Liability ',
      component: LegalLimitations
    },
    {
      path: '/legal-terms',
      name: 'Terms and Conditions',
      component: LegalTerms
    },
    {
      path: '/legal-warranties',
      name: 'Disclaimer of Warranties',
      component: LegalWarranties
    },
  ]
};

const routes = [
  {
    path: '/',
    redirect: '/welcome',
    name: 'welcome'
  },
  authPages,
  {
    path: '/',
    //beforeEnter: AuthRequired,
    component: DashboardLayout,
    redirect: '/dashboard',
    name: 'Dashboard layout',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        components: { default: Board }
      },
      {
        path: 'wallet',
        name: 'Wallet',
        components: { default: Wallet }
      },
      {
        path: 'wallet-import',
        name: 'Import Wallet',
        components: { default: WalletImport }
      },
      {
        path: 'wallet-create',
        name: 'Create Wallet',
        components: { default: WalletCreate }
      },
      {
        path: 'address/:address',
        name: 'Address',
        components: { default: Address }
      },
      {
        path: 'address-view/:address',
        name: 'Address View',
        components: { default: AddressView }
      },
      {
        path: 'smartholder',
        name: 'SmartHolder',
        components: { default: SmartHolder }
      },
      {
        path: 'contacts',
        name: 'Contacts',
        components: { default: Contacts }
      },
      {
        path: 'delegates',
        name: 'Delegates',
        components: { default: Delegates }
      },
    ]
  },
  { path: '*', component: NotFound }
];

export default routes;
