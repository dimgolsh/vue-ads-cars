import * as fb from 'firebase';

class User{
  constructor(id){
    this.id = id
  }
}

export default {
  state: {
    user: null
  },
  mutations:{
    setUser(state,payload){
      state.user =payload
    }
  },
  actions: {
   async registerUser ({commit},{email,password}){
      commit('clearError')
      commit('setLoading', true)
   const user = await   fb.auth().createUserWithEmailAndPassword(email,password)
      .then(user=>{
        commit('setUser',new User(user.uid))
        commit('setLoading', false)
      })
      .catch(e=> {
        commit('setLoading', false)
        commit('setError', e.message)
      })
    }
  },
  getters: {
    user (state){
      return state.user
    }
  }
}
