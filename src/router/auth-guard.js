import store from '../components/store/index'

export default function (to,from,next){
  if(store.getters.user){
    next()
  } else {
    next('/login?loginError=true')
  }

}
