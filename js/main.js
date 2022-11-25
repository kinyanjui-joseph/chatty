const URL = 'https://pristine-chatty.herokuapp.com/messages/'
var socket = io('https://pristine-chatty.herokuapp.com/');

socket.on('message', function(json){
  store.commit('updateThread',json)
})

const store = Vuex.createStore({
  state () {
    return {
      name: "",
      message: "",
      user_name:"",
      password:"",
      reg_user_name: "",
      reg_password: "",
      to_login: true,
      thread:[],
      online: true,
      loading: true,
    }
  },
  mutations: {
    nameUpdator(state, name){
    	state.name = name
    },
    messageUpdator(state, message){
    	state.message = message
    },
    user_name_updator(state, user_name){
    	state.user_name = user_name
    },
    password_updator(state, password){
    	state.password = password
    },
    reg_user_name_updator(state, reg_user_name){
      state.reg_user_name = reg_user_name
    },
    reg_password_updator(state, reg_password){
      state.reg_password = reg_password
    },
    update_to_login(state){
      state.to_login = !state.to_login
    },
    addMessage(state, data){
      for(i=0;i<data.length;i++){
      state.thread.push(data[i])
      }
    },
    updateThread(state,json){
      state.thread.push(json)
   //   console.log(JSON.parse(json))
    },
    changeLoadingState(state, loading) {
      state.loading = loading
    },
    clearForm(state){
      state.name = "",
      state.message = ""
    },
    clear_login_form(state){
      state.user_name = "",
      state.password = ""
    },
  },
  getters: {},
  actions: {
  async loadData({commit}) {
  axios.get(URL).then((response) => {
    let data = response.data
  commit('addMessage', data)
  commit('changeLoadingState', false)
  })
  },
  sendMsg(){
  	const json = JSON.stringify({ 
      name: this.state.name,
      message: this.state.message,
      id: Math.random().toString(16).slice(2),
      time: Math.floor(Date.now() / 1000)
    });

    const res = axios.post(URL, json, {
      headers: {
      'Content-Type': 'application/json'
      }
      });

    store.commit('clearForm')
    alert('sent')
  },
  auth_user(){
  	const json = JSON.stringify({ 
      name: this.state.user_name,
      message: this.state.password,
      id: Math.random().toString(16).slice(2),
      time: Math.floor(Date.now() / 1000)
    });

    console.log(json)
/*
    const res = axios.post(URL, json, {
      headers: {
      'Content-Type': 'application/json'
      }
      });
*/
    store.commit('clear_login_form')
    alert('sent')
  },
  reg_user(){
  	const json = JSON.stringify({ 
      reg_user_name: this.state.reg_user_name,
      reg_password: this.state.reg_password,
      id: Math.random().toString(16).slice(2),
      time: Math.floor(Date.now() / 1000)
    });

    console.log(json)
/*
    const res = axios.post(URL, json, {
      headers: {
      'Content-Type': 'application/json'
      }
      });
*/
    store.commit('clear_login_form')
    alert('sent')
  }
  }
})

const navigation = {
  computed: {
  	...Vuex.mapState([
  		'online','users_online', 'thread'
    ]),
    ...Vuex.mapGetters([
    ])
  },
  methods: {
  	...Vuex.mapMutations([
  	]),
  },
  template: `
    <div class="header">
      <div class="logo-wrap" id="logo">
        <h2 class="logo">Chatty</h2>
        <h5 class="tag-line">Lets Chat, its secure</h5>
      </div>

      <div class="nav-bar">
        <div class="nav-section">
          <router-link class="nav-item" to="/">login</router-link>
        </div>
        <div class="nav-section">
          <router-link class="nav-item" to="/chats">chats</router-link>
        </div>
      </div>

    </div>  
  `
}

const login = {
  computed: {
  	...Vuex.mapState([
  		'user_name','password', 'to_login'
    ]),
    ...Vuex.mapGetters([
    ]),
    password: {
    	get () {
    		return this.$store.state.password
    	},
    	set (password) {
    		this.$store.commit('password_updator', password)
    	}
    },
    user_name: {
    	get () {
    		return this.$store.state.user_name
    	},
    	set (user_name) {
    		this.$store.commit('user_name_updator',user_name)
    	}
    },
    reg_password: {
    	get () {
    		return this.$store.state.reg_password
    	},
    	set (reg_password) {
    		this.$store.commit('reg_password_updator', reg_password)
    	}
    },
    reg_user_name: {
    	get () {
    		return this.$store.state.reg_user_name
    	},
    	set (reg_user_name) {
    		this.$store.commit('reg_user_name_updator',reg_user_name)
    	}
    }
  },
  methods: {
	...Vuex.mapMutations([
		'password_updator','user_name_updator', 'update_to_login', 'reg_password_updator', 'reg_user_name_updator'
	]),
	async authenticate(){
    let x = document.forms["login_form"]["user_name"].value;
    let y = document.forms["login_form"]["password"].value;
    if (x == "") {
      alert("Please provide user_name!");
      return false;
    }
    if (y == "") {
      alert("Please provide your password!");
      return false;
    }
      this.$store.dispatch('auth_user')
	},
  async register(){
    let x = document.forms["register_form"]["reg_user_name"].value;
    let y = document.forms["register_form"]["reg_password"].value;
    if (x == "") {
      alert("Please provide user_name!");
      return false;
    }
    if (y == "") {
      alert("Please provide your password!");
      return false;
    }
      this.$store.dispatch('reg_user')
	},
  to_reg(){
    this.$store.commit('update_to_login')
  }
  },
  /*html*/
  template: `
  <!--Login Up Form -->

  	<form class="container" id="login_form" v-on:submit.prevent="authenticate" v-show="to_login">
  		<div class="login_form_header_wrp">
  		  <h3 class="form-header">Login</h3>
      </div>
  		<div class="user_name_wrp">  
        <label for="user_name">User:</label>                                      
        <input name="user_name" id="user_name" maxlength="10" class="form-control" autocomplete="off" v-model="user_name" placeholder="Username"/>                                     
  		</div>  
      <div class="password_wrp">
        <label for="password">Password:</label>                       			     
        <input id="password" maxlength="150" name="password" class="form-control" v-model="password" placeholder="Input Password"/> 
      </div>                                      
  	  <div class="btn-wrp">                                            
  	    <button id="login" type="submit" class="btn" >Login</button>
        <button id="to_login" type="button" class="btn btn2" @click="to_reg">Sign Up</button>
      </div>
  	</form>

    <!-- Sign Up Form -->

    <form class="container" id="register_form" v-on:submit.prevent="register" v-show="!to_login">
  		<div class="register_form_header_wrp">
  		  <h3 class="form-header">Sign Up</h3>
      </div>
  		<div class="user_name_wrp">  
        <label for="reg_user_name">User:</label>                                      
        <input name="reg_user_name" id="reg_user_name" maxlength="10" class="form-control" autocomplete="off" v-model="reg_user_name" placeholder="Username"/>                                     
  		</div>  
      <div class="password_wrp">
        <label for="reg_password">Password:</label>                       			     
        <input id="reg_password" maxlength="150" name="reg_password" class="form-control" v-model="reg_password" placeholder="Input Password"/> 
      </div>                                     
  	  <div class="btn-wrp">                                            
  	    <button id="" type="submit" class="btn" >Sign Up</button>
        <button id="reg_to_login" type="button" class="btn btn2" @click="to_reg">Login</button>
      </div>
  	</form>
  `,
}

const msgForm = {
  computed: {
  	...Vuex.mapState([
  		'name','message'
    ]),
    ...Vuex.mapGetters([
    ]),
    message: {
    	get () {
    		return this.$store.state.message
    	},
    	set (message) {
    		this.$store.commit('messageUpdator', message)
    	}
    },
    name: {
    	get () {
    		return this.$store.state.name
    	},
    	set (name) {
    		this.$store.commit('nameUpdator',name)
    	}
    }
  },
  methods: {
	...Vuex.mapMutations([
		'messageUpdator','addMessage'
	]),
	async sendMessage(){
    let x = document.forms["form"]["fname"].value;
    let y = document.forms["form"]["message"].value;
    if (x == "") {
      alert("Please provide your name!");
      return false;
    }
    if (y == "") {
      alert("Please provide your message!");
      return false;
    }
      this.$store.dispatch('sendMsg')
	},
  },
  /*html*/
  template: `
  	<form class="container" id="form" v-on:submit.prevent="sendMessage">
  		<div class="form-header-wrp">
  		  <h3 class="form-header">Send Message</h3>
      </div>
  		<div class="name-wrp">  
        <label for="fname">User:</label>                                      
        <input name="fname" id="name" maxlength="10" class="form-control" autocomplete="off" v-model="name" placeholder="Username">                                     
  		</div>  
      <div class="message-wrp">
        <label for="message">message</label>                       			     
        <textarea id="message" maxlength="150" name="message" class="form-control" v-model="message" placeholder="Type your message here"> 
        </textarea> 
      </div>                                      
  	  <div class="btn-wrp">                                            
  	    <button id="send" class="btn" >Send</button>
      </div>
  	</form>
  `,
}

const chats = {
  computed: {
  	...Vuex.mapState([
  		'name', 'message', 'thread', 'loading', 'newMsg', 'isConnected', 'socketMessage'
    ]),
    ...Vuex.mapGetters([]),
  },
  methods: {
  	...Vuex.mapMutations([
  	]),
  },
  template: `
  <div class="messages">
    <div class="messages-header">
      <h3> Messages</h3>
    </div>
    <div v-if="loading">
      <p>Loading...</p>
    </div>
    <div v-else>
    <div id="thread-item"
    v-for="(msg, index) in thread"
    :key="msg.id"
    > 
        <h4 class="name-field"><span style="font-weight: bold">Name:</span> {{msg.name}}</h4>
        <p class="message-field"><span style="font-weight: bold">Message:</span> {{msg.message}}</p>
      </div>
    </div>
</div>
  `,
}

const chatty = {
  components:{
  	navigation,msgForm,chats
  },
  computed: {
  	...Vuex.mapState([
    ]),
    ...Vuex.mapGetters([
    ]),
  },
  methods: {
  },
  template: `
  	<div class="chatty"> 
  		<div class="headerForm">
  			<navigation></navigation>
  		</div>
      <div>
        <router-view></router-view>
      </div>
  	</div>
  `,
}

const routes = [
  { path: '/', component: login },
  { path: '/chats', component: chats },
]


const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes, 
})


const app = Vue.createApp({
  components:{
  	chatty
  },
  created() {
  this.$store.dispatch('loadData')
  },
  template:`
  	<chatty></chatty>
  `
})

app.use(router)
app.use(store)
app.mount('#app')
