import { getFirestore, collection, addDoc } from 'firebase/firestore'
import moment from '~/plugins/moment'


export const state = () => ({
  isLoggedIn: false,
  user: null
})

export const getters = {
  isLoggedIn: state => state.isLoggedIn,
  user: state => (state.user ? Object.assign({ likes: [] }, state.user) : null)
}

export const mutations = {
  setUser(state, { user }) {
    
    state.user = user
    state.isLoggedIn = true
  },
  updateUser(state, { user }) {
    state.user = user
  }
}

export const actions = {

  async login(){

  },
 
  async register({commit}, { id }) {
      console.log(id);
    const db = getFirestore()
    try {
        
        const docRef = await addDoc(collection(db, "users"), {
          user: id
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    // commit('setUser', { user })
  },
  async addLikeLogToUser({ commit }, { user, post }) {
    user.likes.push({
      createdat: moment().format(),
      userid: user.id,
      postid: post.id
    })
    const newUser = await this.$axios.$put(`/users/${user.id}.json`, user)
    commit('updateUser', { user: newUser })
  },
  async removeLikeLogToUser({ commit }, { user, post }) {
    user.likes = post.likes.filter(like => like.userid !== user.id) || []
    const newUser = await this.$axios.$put(`/users/${user.id}.json`, user)
    commit('updateUser', { user: newUser })
  }
}