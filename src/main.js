import Vue from "vue";
import App from "./App";
import router from "./router";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import store from "./components/store";
import * as fb from "firebase";
import BuyModalComponent from '@/components/Shared/BuyModal'
// import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  // theme: {
  //   primary: "#f44336",
  //   secondary: "#9575CD",
  //   accent: "#9c27b0",
  //   error: "#f44336",
  //   warning: "#3949AB",
  //   info: "#2196f3",
  //   success: "#4caf50"
  // }
})


Vue.component('app-buy-modal', BuyModalComponent)
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>",
  created() {
    fb.initializeApp({
      apiKey: "AIzaSyApAiKOYZIx5W3T2sBtGCapm-5z0hV4bB8",
      authDomain: "itc-ads-p-5641e.firebaseapp.com",
      databaseURL: "https://itc-ads-p-5641e.firebaseio.com",
      projectId: "itc-ads-p-5641e",
      storageBucket: "itc-ads-p-5641e.appspot.com",
      messagingSenderId: "117934775998",
      appId: "1:117934775998:web:851909d4b1646128a7c8ef",
      measurementId: "G-9TTE7HEDJ1",
    });

    fb.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch("autoLoginUser", user);
      }
    });
    this.$store.dispatch('fetchAds')

  },
});
