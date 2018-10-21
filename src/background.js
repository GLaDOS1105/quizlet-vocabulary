let dict = {
  'a': '不定冠詞',
  'like': '喜歡；相似',
  'the': '定冠詞',
  'Inside': '裡面'
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.name === 'requestDict') sendResponse(dict)
})
