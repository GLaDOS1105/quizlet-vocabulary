import '@babel/polyfill'
import Vue from 'vue'
import '../plugins/vuetify'
import App from './App.vue'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
