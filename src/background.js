const defaultOptions = {
  autoHighlight: false,
  urls: [{ url: 'www.google.com' }, { url: 'www.facebook.com' }, { url: 'www.nytimes.com' }],
  selectedWebsites: [],
  markingFgColor: '#ffffff',
  markingBgColor: '#4257b2'
}

// Set default settings.
chrome.runtime.onInstalled.addListener(_details => {
  chrome.storage.sync.get(null, results => {
    for (let [key, value] of Object.entries(defaultOptions)) {
      if (results[key] === undefined) chrome.storage.sync.set({ [key]: value })
    }
  })
})

let dict = {
  'a': '不定冠詞',
  'like': '喜歡；相似',
  'the': '定冠詞',
  'Inside': '裡面'
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.name === 'requestDict') sendResponse(dict)
})
