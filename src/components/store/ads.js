/* eslint-disable */
import * as fb from 'firebase'

class Ad {
  constructor(
    title,
    description,
    ownerId,
    promo=false,
    id=null,
    imageSrc=''){
    this.title = title;
    this.description = description;
    this.ownerId = ownerId;
    this.promo = promo;
    this.id = id;
    this.imageSrc = imageSrc;

  }
}
export default {
  state: {

    ads: [
      {
        title: 'First ad',
        description: 'Hello i am description',
        promo: false,
        imageSrc: 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
        id: '123'
      },
      {
        title: 'Second ad',
        description: 'Hello i am description',
        promo: true,
        imageSrc: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
        id: '1234'
      },
      {
        title: 'Third ad',
        description: 'Hello i am description',
        promo: true,
        imageSrc: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
        id: '12345'
      }
    ]

  },
  mutations: {
    createAd (state,payload){
      state.ads.push(payload)
    }
  },
  actions: {
    async createAd({commit,getters},payload){
     // payload.id = Math.random()
      commit('clearError')
      commit('setLoading',true)
    //  commit('createAd', payload)
      try {
        const newAd = new Ad(
          payload.title,
          payload.description,
          getters.user.id,
          null,
          null,
          payload.imageSrc)

         const fbValue = await fb.database().ref('ads').push(newAd)
         commit('createAd',{
           ...newAd,
           id: fbValue.key
         })
      } catch (error) {
        commit('setLoading',false)
      }
    }
  },
  getters: {
     ads(state) {
      return state.ads
    },
    promoAds (state) {
      return state.ads.filter( ad => {
        return ad.promo
      })
    },
    myAds(state) {
      return state.ads
    },
    addById(state){
      return adId => state.ads.find(ad=> ad.id === adId)
    }
  }
}
