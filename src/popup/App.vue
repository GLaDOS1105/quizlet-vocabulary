<template>
  <v-app dark>
    <v-toolbar app dense>
      <img src="@/assets/logo.png" alt="Vuetify.js" class="logo ma-1">
      <v-toolbar-title>In-Page Terms</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn @click="switchMarkingRequest" icon>
        <v-icon>{{markingVisibilityIconName}}</v-icon>
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
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
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

function sendMessage2CurrentTab (message, responseCallback) {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    (tabs) => chrome.tabs.sendMessage(tabs[0].id, message, responseCallback)
  )
}

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
      markingVisibility: true,
      timer: undefined
    }
  },
  computed: {
    markingVisibilityIconName () {
      if (this.markingVisibility) return 'visibility_off'
      return 'visibility'
    }
  },
  created () {
    this.requestMarking()
    this.updateFoundTerms()
    this.timer = setInterval(this.updateFoundTerms, 500)
  },
  methods: {
    requestMarking () {
      sendMessage2CurrentTab(
        { name: 'requestStartMarking' },
        (response) => {
          if (!response) this.requestMarking()
          else this.markingVisibility = true
        }
      )
    },
    requestStopMarking () {
      sendMessage2CurrentTab(
        { name: 'requestStopMarking' },
        (response) => {
          if (response) this.requestStopMarking()
          else this.markingVisibility = false
        }
      )
    },
    updateFoundTerms () {
      sendMessage2CurrentTab(
        { name: 'requestFoundTerms' },
        (response) => { this.termItems = response }
      )
    },
    switchMarkingRequest () {
      if (this.markingVisibility) this.requestStopMarking()
      else this.requestMarking()
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
/* To fix unknown wierd injected stylesheet... */
body {
  font-size: initial;
}
.logo {
  max-width: 70%;
  max-height: 70%;
}
</style>
