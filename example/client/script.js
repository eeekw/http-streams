import { readJsonStream } from '/dist/index.js'

async function send() {
  const response = await fetch('http://127.0.0.1:3000/stream')
  const json = readJsonStream(response.body)
  const list = document.getElementById('list')
  for await (const data of json) {
    const listItem = document.createElement('li')
    listItem.textContent = `${data.id}: ${data.message}`
    list.appendChild(listItem)
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('send')
  button.addEventListener('click', send)
})
