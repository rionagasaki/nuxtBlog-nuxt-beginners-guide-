import Cookies from 'universal-cookie'

export default({req, res})=>{
    if(process.browser){
        return
    }
    const cookies = new Cookies(req.headers.cookies)
    const user = cookies.get('user')
    if(user && user.id){
        const {id, likes} = user
        store.commit('setUser', { user: {id: likes}})
    }
}