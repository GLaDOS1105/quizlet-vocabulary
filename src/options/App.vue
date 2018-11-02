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
                  <v-tooltip bottom>
                    <v-btn icon color="grey darken-2" flat @click.native="saveColor" class="mx-2" slot="activator">
                      <v-icon>save</v-icon>
                    </v-btn>
                    <span>Save Color Setting</span>
                  </v-tooltip>
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
                  <v-tooltip bottom>
                    <v-btn icon color="grey darken-2" flat @click.native="saveColor" class="mx-2" slot="activator">
                      <v-icon>save</v-icon>
                    </v-btn>
                    <span>Save Color Setting</span>
                  </v-tooltip>
                </v-layout>
              </v-list-tile-action>
            </v-list-tile>

            <v-subheader>Highlight</v-subheader>

            <v-list-tile @click=";">
              <v-list-tile-content @click="autoHighlight = !autoHighlight">
                <v-list-tile-title>Automatically Highlight</v-list-tile-title>
                <v-list-tile-sub-title>Automatically highlight the user-defined terms on page loading.</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-switch v-model="autoHighlight"></v-switch>
              </v-list-tile-action>
            </v-list-tile>

            <v-list-tile @click=";">
              <v-list-tile-content @click="selectAllWebsites = !selectAllWebsites">
                <v-list-tile-title>Highlight All Website</v-list-tile-title>
                <v-list-tile-sub-title>Highlight on all websites automatically.</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-switch v-model="selectAllWebsites" :disabled="!autoHighlight"></v-switch>
              </v-list-tile-action>
            </v-list-tile>

          </v-list>

          <v-flex xs12>
            <v-layout row wrap>
                <v-subheader>Target Websites</v-subheader>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog">
                  <v-btn depressed color="secondary" slot="activator"
                    :disabled="!autoHighlight || selectAllWebsites"
                  >Add Website</v-btn>
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
                      <v-btn flat color="primary" @click.native="saveDialog"
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
                <v-tooltip top>
                  <v-checkbox
                    slot="activator"
                    v-model="props.selected"
                    hide-details
                    :disabled="!autoHighlight || selectAllWebsites"></v-checkbox>
                  <span>Enable</span>
                </v-tooltip>
              </td>
              <td>
                {{ props.item.url }}
              </td>
              <td class="text-xs-right">
                <v-tooltip top>
                  <v-btn icon color="grey darken-2" flat slot="activator"
                    @click.native="editWebsite(props.item)"
                    :disabled="!autoHighlight || selectAllWebsites"
                  ><v-icon>edit</v-icon>
                  </v-btn>
                  <span>Edit</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn icon color="grey darken-2" flat slot="activator"
                    @click.native="deleteWebsite(props.item)"
                    :disabled="!autoHighlight || selectAllWebsites"
                  ><v-icon>delete</v-icon>
                  </v-btn>
                  <span>Delete</span>
                </v-tooltip>
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
      selectAllWebsites: undefined,
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
      this.saveOption({ autoHighlight: val })
    },
    selectAllWebsites (val) {
      this.saveOption({ selectAllWebsites: val })
    },
    urls (val) {
      this.saveOption({ urls: val })
    },
    selectedWebsites (val) {
      this.saveOption({ selectedWebsites: val })
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
    saveColor () {
      this.saveOption({
        markingFgColor: this.markingFgColor,
        markingBgColor: this.markingBgColor
      })
    },
    saveOption (option) {
      chrome.storage.sync.set(option, () => { console.log('save', option) })
    }
  },
  created () {
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
