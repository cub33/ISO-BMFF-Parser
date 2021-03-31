const readFile = e => {
  const file = e.target.files[0]
  let reader = new FileReader()

  reader.onload = function(e) {
      let arrayBuffer = new Uint8Array(reader.result)
      console.log(arrayBuffer)
  }

  reader.readAsArrayBuffer(file)
}

document.querySelector("#fileInput").onchange = readFile