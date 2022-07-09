const URL = 'http://localhost:3000/messages'

const store = Vuex.createStore({
  state () {
    return {
      name: "",
      message: "",
      thread:[],
      online: true,
      users_online: 52,
      loading: true,
      handle: ""
    }
  },
  mutations: {
    nameUpdator(state, value){
    	state.name = value
    },
    messageUpdator(state, value){
    	state.message = value
    },
    addMessage(state, data){
    	state.thread.push(data)
    },
    changeLoadingState(state, loading) {
    state.loading = loading
    },
    clearForm(state){
      state.name = "",
      state.message = ""
     // alert('cleared')
    }
  },
  getters: {
  	results (){
  		return state.result
  	},
    MESSAGE(){
      return state.message
    }
  },
  actions: {
  loadData({commit}) {
  axios.get(URL).then((response) => {
  commit('addMessage', response.data)
  commit('clearForm')
  commit('changeLoadingState', false)

  })
  },
  async sendTxt(){
  	const json = JSON.stringify({ name: this.state.name, message: this.state.message });
    const res = await axios.post(URL, json, {
  	headers: {
  	'Content-Type': 'application/json'
  	}
  	});

    socket.emit('message', json);

    socket.on('message',async function(msg) {
      alert('sent')
      console.log(msg) 
     /* let messages = document.getElementById('thread-item');
      let item = document.createElement('li');
      item.textContent = msg;
      messages.appendChild(item);
      //store.dispatch('loadData') /////COMMENT/*/
    });

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
   				<h1 class="logo">Chatty <i class="fa-solid fa-screen-users"></i></h1>
   				<span class="tag-line">Secure group chat you can trust</span>
   			</div>
   			<div class="status">
   				<h4 class="online" v-show="online">Users online:{{thread.length}}</h4>
   				<h4 class="offline" v-show="!online">OFFLINE</h4>
   			</div>
   		</div>  
  `
}

const msgForm = {
  computed: {
  	...Vuex.mapState([
  		'name','message'
    ]),
    ...Vuex.mapGetters([
    ]),
    messanger: {
    	get () {
    		return this.$store.state.message
    	},
    	set (value) {
    		this.$store.commit('messageUpdator', value)
    	}
    },
    namer: {
    	get () {
    		return this.$store.state.name
    	},
    	set (value) {
    		this.$store.commit('nameUpdator', value)
    	}
    }
  },
  methods: {
	...Vuex.mapMutations([
		'messageUpdator','addMessage'
	]),
	async sendMessage(){
		this.$store.dispatch('sendTxt')
	},
  },
  template: `
  	<form class="container" id="form" v-on:submit.prevent="sendMessage">
  		<div class="form-header-wrp">
  		  <h3 class="form-header">Send Message</h3>
      </div>
  		<div class="name-wrp">  
        <label for="name">User:</label>                                      
        <input id="name" class="form-control" autocomplete="off" v-model="namer" placeholder="Username">                                     
  		</div>  
      <div class="message-wrp">
        <label for="message">message</label>                       			     
        <textarea id="message" class="form-control" v-model="messanger" placeholder="Type your message here"> 
        </textarea> 
      </div>                                      
  	  <div class="btn-wrp">                                            
  	    <button id="send" class="btn" >Send</button>
      </div>
  	</form>
  `,
}

const messages = {
  computed: {
  	...Vuex.mapState([
  		'message', 'thread', 'loading'
    ]),
    ...Vuex.mapGetters([
    ])
  },
  methods: {
  	...Vuex.mapMutations([
  	]),
  },
  beforeUpdate() {
   // this.$store.dispatch('loadData')
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
      v-for="txt in thread[0]"
      :key="txt._id"
      >
        <h4 class="name-field"><span style="font-weight: bold">Name:</span> {{txt.name}}</h4>
        <p class="message-field"><span style="font-weight: bold">Message:</span> {{txt.message}}</p>
      </div>
    </div>
</div>
  `,
}


const chat = {
  components:{
  	navigation,msgForm,messages
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
  			<msgForm></msgForm>
  		</div>
      <div>
        <messages></messages>
      </div>
  	</div>
  `,
}


const app = Vue.createApp({
  components:{
  	chat
  },
  created() {
  this.$store.dispatch('loadData')
  },
  template:`
  	<chat></chat>
  `
})

app.use(store)
app.mount('#app')