import Mark from 'mark.js'

(function () {
  let urls, markingTimer, marker
  chrome.storage.sync.get(
    [
      'selectedWebsites', 'autoHighlight', 'selectAllWebsites',
      'markingFgColor', 'markingBgColor'
    ],
    options => {
      console.log(options)
      urls = options.selectedWebsites.map(obj => obj.url)
      if (options.autoHighlight &&
        (options.selectAllWebsites ||
          urls.some(x => document.location.href.includes(x)))) requestDict(mark)
    })

  // Popup requires `foundTerms` object to display the list.
  let foundTerms = {}

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.name === 'requestStartMarking') {
      if (!markingTimer) requestDict(mark)
      sendResponse(true)
    }
    if (message.name === 'requestStopMarking') {
      clearInterval(markingTimer)
      markingTimer = undefined
      if (marker) marker.unmark({ done () { sendResponse(markingTimer) } })
      else sendResponse(markingTimer)
    }
    if (message.name === 'requestFoundTerms') sendResponse(foundTerms)
  })

  function requestDict (callback) {
    chrome.runtime.sendMessage(
      { name: 'requestDict' },
      response => {
        if (response.length === 0) setTimeout(requestDict, 500)
        else callback(response)
      }
    )
  }

  function mark (dict) {
    marker = new Mark(findTextNodes())
    let hasMutated = true // at least mark once (first time)
    let observeOptions = { childList: true, characterData: true, subtree: true }
    let observer = new MutationObserver((_mut, _obs) => { hasMutated = true })
    function updateMarker () {
      if (hasMutated) {
        console.log('update marking')
        observer.disconnect()
        marker.unmark({
          done () {
            marker = new Mark(findTextNodes())
            marker.mark(Object.keys(dict), {
              className: 'ext-highlight',
              accuracy: 'exactly',
              filter (_textNode, foundTerm, _totalCounter, _counter) {
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

  function findTextNodes () {
    return Array.from(document.querySelectorAll('body *')).filter(node => {
      if (['SCRIPT', 'STYLE'].includes(node.tagName)) return false
      let style = getComputedStyle(node)
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === 0) return false
      if (!node.innerText) return false
      return true
    })
  }
})()
