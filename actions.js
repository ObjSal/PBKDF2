// Author: Salvador Guerrero

'use strict'

let inputTextArea = document.getElementById('inputTextArea')
let resultTextArea = document.getElementById('resultTextArea')
let saltInput = document.getElementById('saltInput')
let iterationsInput = document.getElementById('iterationsInput')
let hashSelect = document.getElementById('hashSelect')
let lengthInput = document.getElementById('lengthInput')

document.getElementById('hashButton').onclick = function() {
  (async() => {
    let text = inputTextArea.value
    let salt = saltInput.value
    let hash = hashSelect.value
    let iterations = parseInt(iterationsInput.value)
    if (isNaN(iterations)) {
      iterations = 5000
      iterationsInput.value = iterations.toString()
    }
    let length = lengthInput.value
    if (isNaN(length)) {
      length = 256
      lengthInput.value = length.toString()
    }
    resultTextArea.value = await hashText(text, salt, iterations, hash, length)
  })()
}

// document.getElementById('decodeButton').onclick = function() {
//   // try {
//   //   let text = inputTextArea.value
//   //   resultTextArea.value = atob(text)
//   // } catch (e) {
//   //   alert(e.message)
//   // }
// }

async function hashText(text, salt, iterations, hash, length) {
  if (!text) return null
  // (generates a random salt) let saltBuffer = window.crypto.getRandomValues(new Uint8Array(32))
  let textEncoder = new TextEncoder()
  // Use the reversed password and use it as the salt
  let saltBuffer = textEncoder.encode(salt)
  let encodedPassword = textEncoder.encode(text)
  let baseKey = await window.crypto.subtle.importKey(
      "raw",
      encodedPassword,
      "PBKDF2",
      false,
      ["deriveBits"]
  )
  // LastPass in 2011 used 5000 iterations for JavaScript clients and 100000 iterations for
  // server-side hashing.
  // Ref: https://en.wikipedia.org/wiki/PBKDF2
  let keyBuffer = await window.crypto.subtle.deriveBits(
      {
        "name": "PBKDF2",
        "hash": hash,
        salt: saltBuffer,
        "iterations": iterations
      },
      baseKey,
      length
  )
  return arrayBufferToBase64(keyBuffer)
}

function arrayBufferToBase64(buffer) {
  return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))
}

function assignRandomSalt() {
  const weakSalts = ['abc123', '123abc', 'salt', 'tlas', 'unique', 'foo', 'bar']
  saltInput.value = weakSalts[Math.round(Math.random() * (weakSalts.length - 1))]
}

assignRandomSalt()