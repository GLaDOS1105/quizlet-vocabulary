<template>
  <v-app dark>
    <v-toolbar app dense>
      <img src="@/assets/logo.png" alt="Vuetify.js" class="logo ma-1">
      <v-toolbar-title>In-Page Vocabulary</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-menu bottom left>
        <v-btn slot="activator" icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
          v-for="(item, index) in menuItems"
          :key="index"
          @click="item.action"
          target="_blank"
          >
          <v-list-tile-title>{{item.title}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <v-container grid-list-md fluid>
        <v-layout row wrap>
          <term-card
          v-for="(value, key) in termItems"
          :key="key"
          :term="key"
          :definition="value"
          ></term-card>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import TermCard from '../components/TermCard'

export default {
  components: {
    TermCard
  },
  data () {
    return {
      menuItems: [
        { title: 'Settings', action: () => chrome.runtime.openOptionsPage() },
        { title: 'Rate Extension', action: () => {} },
        { title: 'Bugs Report', action: () => open('https://github.com/GLaDOS1105/quizlet-vocabulary/issues') }
      ],
      termItems: {},
      timer: undefined
    }
  },
  created () {
    this.requestMarking()
    this.updateFoundTerms()
    this.timer = setInterval(this.updateFoundTerms, 500)
  },
  methods: {
    sendMessage2CurrentTab (message, responseCallback) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs) => chrome.tabs.sendMessage(tabs[0].id, message, responseCallback)
      )
    },
    requestMarking () {
      this.sendMessage2CurrentTab(
        { name: 'requestMarking' },
        (response) => { if (!response) this.requestMarking() }
      )
    },
    updateFoundTerms () {
      this.sendMessage2CurrentTab(
        { name: 'requestFoundTerms' },
        (response) => { console.log(response); this.termItems = response }
      )
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style>
html {
  width: 400px;
  min-height: 200px;
}
.logo {
  max-width: 70%;
  max-height: 70%;
}
</style>
