<template>
  <section class="container">
    <el-card style="flex: 1">
      <div slot="header" class="clearfix">
        <span>ログイン</span>
      </div>
      <form>
        <div class="form-content">
          <span>ユーザー ID</span>
          <el-input placeholder="" v-model="formData.id"></el-input>
         
        </div>
        <div class="form-content">
          <el-checkbox v-model="isCreateMode">アカウントを作成する</el-checkbox>
        </div>
        <div class="text-right">
          <el-button type="primary" @click="handleClickSubmit">{{ buttonText }}</el-button>
        </div>
      </form>
    </el-card>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Cookies from 'universal-cookie'
import { getFirestore, getDocs, collection, where, query} from 'firebase/firestore'

export default {
  asyncData({ redirect, store}){
    if (store.getters.user){ redirect('/posts/') }
    return{
      isCreateMode: true,
      formData: {
        id: ''
      }
    }
  },
  computed:{
       buttonText(){
         return this.isCreateMode ? '新規登録' : 'ログイン'
       },
    ...mapGetters(['user'])
  },
  methods:{
    async handleClickSubmit(){
      const cookies = new Cookies()

      if(this.isCreateMode){
        try {
          await this.register({...this.formData})
          this.$notify({
             type: 'success',
             title: 'アカウント作成完了',
             massage: `${this.formData.id}として登録しました。`,
             position: 'bottom-right',
             duration: 1000
          })
          cookies.set('user', JSON.stringify(this.user))
          this.$router.push('/posts/')
        } 
        catch(e){
          console.log(e)
           this.$notify.error({
            title: 'アカウント作成失敗',
            message: 'すでに投稿されているか、不正なユーザーIDです。',
            position: 'bottom-right',
            duration: 1000
           })
        }
      } else{
        try{
          const db = getFirestore()
          const q = query(collection(db, "users"), where("user", "==", this.formData.id));
          const querySnapshot = await getDocs(q);
          console.log(querySnapshot.docs);
          if (querySnapshot.docs.length === 0){
            this.$notify.error({
            title: 'ログイン失敗',
            message: 'すでに投稿されているか、不正なユーザーIDです。',
            position: 'bottom-right',
            duration: 1000
           })
            return
          }
           querySnapshot.forEach((doc) => {
            console.log("aaa");
            if (doc.data().user === this.formData.id){
               this.$notify({
                type:'success',
                title:'ログイン成功',
                message: `${this.formData.id}としてログインしました。`,
                position: 'bottom-right',
                duration: 1000
              }) 
               this.$router.push('/posts/')
               
            }
          })
        }
          
catch(e){
          console.error(e)
             
        }
      }
    },
    ...mapActions(['register','login'])
  }
  
}
</script>
<style scoped>
.form-content{
  margin: 16px 0;
}
</style>
