import Mark from 'mark.js'

// TODO: settings - load url list from chrome.storage.sync.get()
let matchesUrls = [
  'www.google.com'
]
let matchAllUrl = false

// TODO: settings - auto inject?
// if auto injected -> re-find terms should be fired every time the url changes and content of page changes
let autoInject = true

// TODO: load dictionary from Quizlet
let dict = ['the', 'like', 'a']

// Popup will require this set to display.
let foundTerms = new Set()

if (matchAllUrl || isMatchedUrl()) {
  if (autoInject) {
    let marker = new Mark(findTextNodes())
    let hasMutated = false
    let observeOptions = { childList: true, characterData: true, subtree: true }
    let observer = new MutationObserver((_mutations, _observer) => {
      hasMutated = true
    })
    setInterval(() => {
      if (hasMutated) {
        observer.disconnect()
        console.log('mark')
        marker.unmark({
          done: () => {
            marker = new Mark(findTextNodes())
            marker.mark(dict, {
              accuracy: 'exactly',
              filter: (_textNode, foundTerm, _totalCounter, _counter) => {
                foundTerms.add(foundTerm)
                return true
              }
            })
          }
        })
        hasMutated = false
        observer.observe(document, observeOptions)
      }
    }, 3000)
    observer.observe(document, observeOptions)
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
