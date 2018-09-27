'use strict'
// TODO: load url list from chrome.storage.sync.get()
let matchesUrls = [
  'www.google.com'
]
let matchAllUrl = true

// TODO: settings - auto inject?
let autoInject = true

if (matchAllUrl || isMatchedUrl()) {
  if (autoInject) findTerms()
}

function isMatchedUrl () {
  for (let url of matchesUrls) {
    if (document.location.href.includes(url)) return true
  }
  return false
}

function findTerms () {
  console.log('injected!')
  let textNodeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  )
  let textNodeList = []
  while (textNodeWalker.nextNode()) textNodeList.push(textNodeWalker.currentNode)
  console.log(textNodeList)
  console.log(document.body.innerText)
}
