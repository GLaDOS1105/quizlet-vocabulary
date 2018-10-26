<template>
  <v-app style="background: initial">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <v-list subheader two-line>
            <v-subheader>Mark Style</v-subheader>

            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Marking Text Color</v-list-tile-title>
                <v-list-tile-sub-title>Set the marking text color.</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-layout row wrap>
                  <input type="color" v-model="markingFgColor" class="mx-2 elevation-1">
                  <code>{{ markingFgColor }}</code>
                </v-layout>
              </v-list-tile-action>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Marking Background Color</v-list-tile-title>
                <v-list-tile-sub-title>Set the marking background color.</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-layout row wrap>
                  <input type="color" v-model="markingBgColor" class="mx-2 elevation-1">
                  <code>{{ markingBgColor }}</code>
                </v-layout>
              </v-list-tile-action>
            </v-list-tile>

            <v-subheader>Highlight</v-subheader>

            <v-list-tile @click=";">
              <v-list-tile-content @click="autoHighlight = !autoHighlight">
                <v-list-tile-title>Automatically Highlight</v-list-tile-title>
                <v-list-tile-sub-title>Automatically highlight the words in user-defined term sets.</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-switch v-model="autoHighlight"></v-switch>
              </v-list-tile-action>
            </v-list-tile>

          </v-list>

          <v-flex xs12>
            <v-layout row wrap>
                <v-subheader>Target Websites</v-subheader>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog">
                  <v-btn depressed color="primary" slot="activator">Add Website</v-btn>
                  <v-card>
                    <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
                    <v-card-text>
                      <p>If the URL of a website includes one of the following string, this extension would automatically highlight the user-defined terms within the page. (Only in automatically highlighting mode)</p>
                      <v-text-field
                        v-model="editedWebsite.url"
                        :rules="[() => !!editedWebsite.url || 'This field is required.']"
                        label="Website URL"
                        hint="For example: www.nytimes.com"
                        autofocus
                      ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click.native="closeDialog">Cancel</v-btn>
                      <v-btn
                        flat
                        color="primary"
                        @click.native="saveDialog"
                        :disabled="!editedWebsite.url"
                      >Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
            </v-layout>
          </v-flex>

          <v-data-table
            :headers="[
              { text: 'URL', value: 'url' },
              {
                text: 'Actions', value: 'action', align: 'center',
                width: '160px', sortable: false
              }
            ]"
            :items="urls"
            item-key="url"
            v-model="selectedWebsites"
            hide-actions
            select-all
            class="elevation-1 mb-1"
          >
            <template slot="items" slot-scope="props">
              <td>
                <v-checkbox
                  v-model="props.selected"
                  hide-details
                  :disabled="!autoHighlight"></v-checkbox>
              </td>
              <td>
                {{ props.item.url }}
              </td>
              <td class="text-xs-right">
                <v-btn
                  icon
                  color="primary"
                  flat
                  @click.native="editWebsite(props.item)"
                ><v-icon>edit</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="primary"
                  flat
                  @click.native="deleteWebsite(props.item)"
                ><v-icon>delete</v-icon>
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      autoHighlight: undefined,
      dialog: false,
      selectedWebsites: [],
      urls: [],
      editedWebsitesIndex: -1,
      editedWebsite: { url: '' },
      defaultWebsite: { url: '' },
      markingBgColor: '',
      markingFgColor: ''
    }
  },
  computed: {
    dialogTitle () {
      return this.editedWebsitesIndex === -1 ? 'Add Website' : 'Edit Website'
    }
  },
  watch: {
    dialog (val) {
      val || this.closeDialog()
    },
    autoHighlight (val) {
      const autoHighlight = val
      this.saveOption({ autoHighlight })
    },
    urls (val) {
      const urls = val
      this.saveOption({ urls })
    },
    selectedWebsites (val) {
      const selectedWebsites = val
      this.saveOption({ selectedWebsites })
    }
  },
  methods: {
    editWebsite (item) {
      this.editedWebsitesIndex = this.urls.indexOf(item)
      this.editedWebsite = Object.assign({}, item)
      this.dialog = true
    },
    deleteWebsite (item) {
      this.urls.splice(this.urls.indexOf(item), 1)
    },
    closeDialog () {
      this.dialog = false
      setTimeout(() => {
        this.editedWebsite = Object.assign({}, this.defaultWebsite)
        this.editedWebsitesIndex = -1
      }, 300)
    },
    saveDialog () {
      if (this.editedWebsitesIndex > -1) {
        Object.assign(this.urls[this.editedWebsitesIndex], this.editedWebsite)
      } else {
        this.urls.push(this.editedWebsite)
      }
      this.closeDialog()
    },
    saveOption (option) {
      chrome.storage.sync.set(option, () => { console.log('save', option) })
    }
  },
  created () {
    // TODO: after replace the color picker, we could move this to `watch`
    addEventListener('beforeunload', () => {
      const markingFgColor = this.markingFgColor
      const markingBgColor = this.markingBgColor
      this.saveOption({ markingFgColor, markingBgColor })
    })
    chrome.storage.sync.get(options => {
      for (let [key, value] of Object.entries(options)) {
        this[key] = value
      }
    })
  }
}
</script>

<style>
html {
  min-width: 600px;
  overflow: auto;
}
body {
  font-size: initial;
}
input[type="color"] {
  cursor: pointer;
}
</style>
