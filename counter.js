// Author: Salvador Guerrero

'use strict'

let footerDiv = document.getElementById('footer')

function getCount() {
  // const urlParams = new URLSearchParams(window.location.search)
  // if (!urlParams) return
  // const counterParam = urlParams.get('counter')
  // if (!counterParam) return
  fetch('https://byteapps.sytes.net/analytics/counter?k=pbkdf2').then(response => {
    if (response.status !== 200) return
    (async() => {
      try {
        const text = await response.text()
        footerDiv.textContent = `${footerDiv.textContent} | Visits: ${text}`
      } catch (error) {
        console.error(error)
      }
    })()
  }).catch(reason => {
    console.error(reason)
  })
}

getCount()