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
    updatedAd(state, {title,description,id}){
      const ad = state.ads.find(a=>{
        return a.id ===id
      })
      ad.title = title
      ad.description = description
    }
  },
  actions: {
    async createAd({ commit, getters }, payload) {
      // payload.id = Math.random()
      commit("clearError");
      commit("setLoading", true);
      //  commit('createAd', payload)
      const image = payload.image
      try {
        const newAd = new Ad(
          payload.title,
          payload.description,
          getters.user.id,
          '',
          payload.promo
        );

        const ad = await fb.database().ref("ads").push(newAd);
        const imageExt = image.name.slice(image.name.lastIndexOf('.'))

        const fileData = await fb.storage().ref(`ads/${ad.key}.${imageExt}`).put(image)
        console.log(fileData);

        const imageSrc = 'https://firebasestorage.googleapis.com/v0/b/itc-ads-p-5641e.appspot.com/o/' + fileData.metadata.fullPath;



        await fb.database().ref('ads').child(ad.key).update({
          imageSrc
        })

        commit('setLoading', false)
        commit('createAd', {
          ...newAd,
          id: ad.key,
          imageSrc
        })
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
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
    async updateAd({ commit, getters }, {title,description,id}){
      commit("setLoading", true);
      try {
        await fb.database().ref('ads').child(id).update({
          title,description
        })
        commit('updatedAd',{
          title,description,id
        })
        commit("setLoading", false);

      } catch (error) {
        commit("setError", error.message);
        commit("setLoading", false);
      }
    }
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
    myAds(state,getters) {
      return state.ads.filter(ad=>{
        return ad.ownerId === getters.user.id
      })
    },
    addById(state) {
      return (adId) => state.ads.find((ad) => ad.id === adId);
    },
  },
};
