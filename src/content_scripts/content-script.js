import Mark from 'mark.js'

// TODO: settings - load url list from chrome.storage.sync.get()
let matchesUrls = []
let matchAllUrl = false

// TODO: settings - auto inject?
// if auto injected -> re-find terms should be fired every time the url changes and content of page changes
let autoMark = false

// Popup will require this set to display.
let foundTerms = {}
let markingTimer

if (autoMark && (matchAllUrl || isMatchedUrl())) requestDict(mark)

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.name === 'requestMarking') {
    if (!markingTimer) requestDict(mark)
    sendResponse(true)
  }
  if (message.name === 'requestStopMarking') clearInterval(markingTimer)
  if (message.name === 'requestFoundTerms') sendResponse(foundTerms)
})

function requestDict (callback) {
  chrome.runtime.sendMessage(
    { name: 'requestDict' },
    (response) => {
      if (response.length === 0) setTimeout(requestDict, 500)
      else callback(response)
    }
  )
}

function mark (dict) {
  let marker = new Mark(findTextNodes())
  let hasMutated = true
  let observeOptions = { childList: true, characterData: true, subtree: true }
  let observer = new MutationObserver((_mut, _obs) => { hasMutated = true })
  function updateMarker () {
    if (hasMutated) {
      observer.disconnect()
      marker.unmark({
        done: () => {
          marker = new Mark(findTextNodes())
          marker.mark(Object.keys(dict), {
            accuracy: 'exactly',
            filter: (_textNode, foundTerm, _totalCounter, _counter) => {
              foundTerms[foundTerm] = dict[foundTerm]
              return true
            }
          })
        }
      })
      hasMutated = false
      observer.observe(document, observeOptions)
    }
  }

  observer.observe(document, observeOptions)
  if (!markingTimer) { // make sure there is only one marking timer for each page
    updateMarker()
    markingTimer = setInterval(updateMarker, 3000)
  }
}

function isMatchedUrl () {
  for (let url of matchesUrls) {
    if (document.location.href.includes(url)) return true
  }
  return false
}

function findTextNodes () {
  return Array.from(document.querySelectorAll('body *')).filter(node => {
    if (['SCRIPT', 'STYLE'].includes(node.tagName)) return false
    let style = getComputedStyle(node)
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === 0) return false
    if (!node.innerText) return false
    return true
  })
}
