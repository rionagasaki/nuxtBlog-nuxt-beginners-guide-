import moment from '~/plugins/moment'
import { getFirestore, addDoc } from 'firebase/firestore'

export const state = () => ({
  posts: []
})

export const getters = {
  posts: state => state.posts.map(post => Object.assign({ likes: [] }, post))
}

export const mutations = {
  addPost(state, { post }) {
    state.posts.push(post)
  },
  updatePost(state, { post }) {
    state.posts = state.posts.map(p => (p.id === post.id ? post : p))
  },
  clearPosts(state) {
    state.posts = []
  }
}

export const actions = {
  async fetchPost({ commit }, { id }) {
    const post = await this.$axios.$get(`/posts/${id}.json`)
    commit('addPost', { post: { ...post, id } })
  },
  
  async fetchPosts({ commit }) {
    const posts = await this.$axios.$get(`/posts.json`)
    commit('clearPosts')
    Object.entries(posts || [])
      .reverse()
      .forEach(([id, content]) =>
        commit('addPost', {
          post: {
            id,
            ...content
          }
        })
      )
  },
  async publishPost({ commit }, { payload }) {
    const user = await this.$axios.$get(`/users/${payload.user.id}.json`)
    const createdat = moment().format()
    payload = {
      createdat,
      ...payload
    }
    const postid = (await this.$axios.$post('/posts.json', payload)).name
    const post = { id: postid, ...payload, createdat }
    const putData = { id: postid, ...payload, createdat }
    delete putData.user
    await this.$axios.$put(`/users/${user.id}/posts.json`, [
      ...(user.posts || []),
      putData
    ])
    commit('addPost', { post })
  },
  async addLikeToPost({ commit }, { user, post }) {
    post.likes.push({
      createdat: moment().format(),
      userid: user.id,
      postid: post.id
    })
    const newPost = await this.$axios.$put(`/posts/${post.id}.json`, post)
    commit('updatePost', { post: newPost })
  },
  async removeLikeToPost({ commit }, { user, post }) {
    post.likes = post.likes.filter(like => like.userid !== user.id) || []
    const newPost = await this.$axios.$put(`/posts/${post.id}.json`, post)
    commit('updatePost', { post: newPost })
  }
}