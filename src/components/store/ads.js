/* eslint-disable */
import * as fb from "firebase";

class Ad {
  constructor (title, description, ownerId, imageSrc = '', promo = false, id = null) {
    this.title = title
    this.description = description
    this.ownerId = ownerId
    this.imageSrc = imageSrc
    this.promo = promo
    this.id = id
  }
}
export default {
  state: {
    ads: [
      {
        title: "First ad",
        description: "Hello i am description",
        promo: false,
        imageSrc:
          "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        id: "123",
      },
      {
        title: "Second ad",
        description: "Hello i am description",
        promo: true,
        imageSrc:
          "https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        id: "1234",
      },
      {
        title: "Third ad",
        description: "Hello i am description",
        promo: true,
        imageSrc:
          "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        id: "12345",
      },
    ],
  },
  mutations: {
    createAd(state, payload) {
      state.ads.push(payload);
    },
    loadAds(state, payload) {
      state.ads = payload;
    },
  },
  actions: {
    async createAd({ commit, getters }, payload) {
      // payload.id = Math.random()
      commit("clearError");
      commit("setLoading", true);
      //  commit('createAd', payload)
      try {
        const newAd = new Ad(
          payload.title,
          payload.description,
          getters.user.id,
          payload.imageSrc,
          payload.promo
        );

        const fbValue = await fb.database().ref("ads").push(newAd);
        commit("createAd", {
          ...newAd,
          id: fbValue.key,
        });
      } catch (error) {
        commit("setLoading", false);
      }
    },
    async fetchAds({ commit }) {
      commit("clearError");
      commit("setLoading", true);
      const resultsAds = [];
      try {
        const fbVal = await fb.database().ref("ads").once("value");
        const ads = fbVal.val();
        Object.keys(ads).forEach((k) => {
          const ad = ads[k];
          resultsAds.push(
            new Ad(
              ad.title, ad.description, ad.ownerId, ad.imageSrc, ad.promo, k
            )
          );
        });

        commit("loadAds", resultsAds);

        commit("setLoading", false);
      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
      }
    },
  },
  getters: {
    ads(state) {
      return state.ads;
    },
    promoAds(state) {
      return state.ads.filter((ad) => {
        return ad.promo;
      });
    },
    myAds(state) {
      return state.ads;
    },
    addById(state) {
      return (adId) => state.ads.find((ad) => ad.id === adId);
    },
  },
};
