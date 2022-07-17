const URL = 'http://localhost:3000/messages'

const store = Vuex.createStore({
  state () {
    return {
      name: "joe",
      message: "test 5",
      thread:[],
      online: true,
      users_online: 52,
      loading: true,
    //  clearNewMsg: tur
      handle: "",
      newMsg:[],
      isConnected: false,
      sockeMessage: ''
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
    addNewMsg(state, payload) { 
      state.newMsg.push(payload)
      console.log(`The NEW MSG we get: ${payload}`)
    },
    clearNewMsg(state) {
      state.newMsg = []
    },
    changeLoadingState(state, loading) {
      state.loading = loading
    },
    clearForm(state){
      state.name = "",
      state.message = ""
     // alert('cleared')
    },

    SOCKET_CONNECT(state) {
      state.isConnected = true;
    },

    SOCKET_DISCONNECT(state) {
      state.isConnected = false;
    },

    SOCKET_MESSAGECHANNEL(state, message) {
      state.socketMessage = message
    }

  },
  getters: {
  	results (){
  		return state.result
  	},
    MESSAGE(){
      return state.message
    },
    NEWMSG(state){
      return state.newMsg
    }
  },
  actions: {
  loadData({commit}) {
  axios.get(URL).then((response) => {
  commit('addMessage', response.data)
  commit('changeLoadingState', false)
  commit('clearNewMsg')
  })
  },
  async sendTxt(){
  	const json = JSON.stringify({ 
      name: this.state.name,
      message: this.state.message,
      id: Math.random().toString(16).slice(2),
      time: Math.floor(Date.now() / 1000)
    });
    const res = await axios.post(URL, json, {
  	headers: {
  	'Content-Type': 'application/json'
  	}
  	});

    socket.emit('message', json);
    store.commit('clearForm')
    alert('sent')

    /*socket.on('message',async function(msg) {
     // console.log(msg) 
      store.commit('addNewMsg', msg)
      console.log(`The MESSAGE we get: ${msg}`)

    });*/

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
      this.$store.dispatch('sendTxt')
	},
  },
  template: `
  	<form class="container" id="form" v-on:submit.prevent="sendMessage">
  		<div class="form-header-wrp">
  		  <h3 class="form-header">Send Message</h3>
      </div>
  		<div class="name-wrp">  
        <label for="fname">User:</label>                                      
        <input name="fname" id="name" maxlength="10" class="form-control" autocomplete="off" v-model="namer" placeholder="Username">                                     
  		</div>  
      <div class="message-wrp">
        <label for="message">message</label>                       			     
        <textarea id="message" maxlength="150" name="message" class="form-control" v-model="messanger" placeholder="Type your message here"> 
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
  		'name', 'message', 'thread', 'loading', 'newMsg', 'isConnected', 'socketMessage'
    ]),
    ...Vuex.mapGetters([
    //  'NEWMSG'
    ]),
    /*NEWMSG(){
      return this.newMsg
    }*/
  },
  watch:{
    NEWMSG(newNEWMSG, oldNEWMSG){
       /*/ console.log(newNEWMSG)
       if(newNEWMSG){
       // store.commit('addNewMsg', this.NEWMSG)
       }
    /*/ 
    }
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
    },

    disconnect() {
      this.isConnected = false;
    },

    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      this.socketMessage = data
      console.log(data)
    }
  },
  methods: {
  	...Vuex.mapMutations([
  	]),
    pingServer() {
      const json = JSON.stringify({ 
        name: this.name,
        message: this.message,
        id: Math.random().toString(16).slice(2),
        time: Math.floor(Date.now() / 1000)
      });
      // Send the "pingServer" event to the server.
    //  socket.emit('message', json)
      store.commit('addNewMsg', json)
    }
  },
  beforeUpdate() {
  //  this.$store.dispatch('loadData')
    //console.log(this.newMsg[0])
  },
  template: `
  <div class="messages">
    <div>
      <p v-if="isConnected">We're connected</p>    
      <p>message from server: "{{socketMessage}}"</p>
      <button @click="pingServer()">Ping Server</button>
    </div>
    <div class="messages-header">
      <h3> Messages</h3>
    </div>
    <div v-if="loading">
      <p>Loading...</p>
    </div>
    <div v-else>
    <div id="thread-item"
    v-for="(msg, index) in newMsg"
    :msg="msg"
    :index="index"
    :key="msg.id"
    >
      <h4 class="name-field"><span style="font-weight: bold">Name:</span> {{msg.id}}</h4>
      <p class="message-field"><span style="font-weight: bold">Message:</span> {{msg.name}}</p>
    </div>

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