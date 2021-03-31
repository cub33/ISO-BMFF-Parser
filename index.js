const readFile = e => {
  const file = e.target.files[0]
  let reader = new FileReader()

  reader.onload = function(e) {
      let arrayBuffer = new Uint8Array(reader.result)
      console.log(arrayBuffer)
  }

  reader.readAsArrayBuffer(file)
}

const readFileRemote = () => {
 const dom = document.querySelector("#remoteFile")
 const url = dom.value
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(buffer => {
      const content = new Uint8Array(buffer)
      document.querySelector("#logBoard").innerHTML = content
    })
    .catch(e => console.log('error while loading remote file =>', e))
}

document.querySelector("#localFile").onchange = readFile

document.querySelector("#loadRemoteFileBtn").onclick = readFileRemote