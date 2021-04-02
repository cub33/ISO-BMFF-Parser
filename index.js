const logBoardDom = document.querySelector("#logBoard")
const log = content => { logBoardDom.innerHTML += content }

const printBoxes = boxes => {
  boxes.forEach(box => {
    log(`<br>Found box of type <b>${box.type}</b> with size of <b>${box.size}</b> bytes`)
    if (box.type === 'mdat') {
      log('<br><br>mdat content:')
      const mdatContent = bufToStr(box.content)
      const xmlParser = new DOMParser()
      const xmlContent = xmlParser.parseFromString(mdatContent, "text/xml")
      const smpteImages = xmlContent.getElementsByTagName("smpte:image")
      for (const img of smpteImages) {
        const base64Img = img.childNodes[0].nodeValue
        const imgDom = document.createElement("img")
        imgDom.src = 'data:image/png;base64, ' + base64Img
        document.querySelector("#mdat-content-div").appendChild(imgDom) 
      }
    }
  })
}

const bufToStr = buffer => 
  String.fromCharCode.apply(null, new Uint8Array(buffer))

const bufToInt = buffer => new DataView(buffer).getUint32()

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
 const remoteFileDom = document.querySelector("#remoteFileInput")
 const url = remoteFileDom.value
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(extractBoxes)
    .then(printBoxes)
    .catch(e => console.log('error while loading remote file =>', e))
}

let boxes = []
const extractBoxes = (arraybuffer) => {
  let i = 0
  const uint8array = new Uint8Array(arraybuffer)

  while (i < uint8array.length) {
    const box = extractBoxFrom(arraybuffer)
    boxes.push(box)
    
    i += box.size
    arraybuffer = arraybuffer.slice(i)

    if (box.type === 'moof' || box.type === 'traf') {
      i += 4 + 4
      extractBoxes(box.content)
    }

  }
  return boxes
}

const extractBoxFrom = arraybuffer => {
  const uint8array = new Uint8Array(arraybuffer)
  const size = bufToInt(arraybuffer.slice(0, 4))
  const type = bufToStr(uint8array.slice(4, 4+4))
  const content = arraybuffer.slice(4+4, size)
  return { size, type, content }
}

document.querySelector("#localFile").onchange = readFile
document.querySelector("#loadRemoteFileBtn").onclick = readFileRemote