'use strict'
// TODO: settings - load url list from chrome.storage.sync.get()
let matchesUrls = [
  'developer.mozilla.org'
]
let matchAllUrl = true

// TODO: settings - auto inject?
// if auto injected -> re-find terms should be fired every time the url changes and content of page changes
let autoInject = true

if (matchAllUrl || isMatchedUrl()) {
  if (autoInject) {
    let observer = new MutationObserver((records, observer) => {
      console.log(findTerms())
    })
    observer.observe(document, {
      childList: true,
      characterData: true,
      subtree: true
    })
  }
}

function isMatchedUrl () {
  for (let url of matchesUrls) {
    if (document.location.href.includes(url)) return true
  }
  return false
}

function findTerms () {
  return Array.from(document.querySelectorAll('body *')).filter(node => {
    if (['SCRIPT', 'STYLE'].includes(node.tagName)) return false
    let style = getComputedStyle(node)
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === 0) return false
    if (!node.innerText) return false
    return true
  })
}
