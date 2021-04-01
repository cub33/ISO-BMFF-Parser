const logBoardDom = document.querySelector("#logBoard")
const log = content => { logBoardDom.innerHTML += content+',' }

const bufToStr = buffer => 
  String.fromCharCode.apply(null, new Uint32Array(buffer))

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
    .catch(e => console.log('error while loading remote file =>', e))
}

let boxes = []
const extractBoxes = (arraybuffer) => {
  let i = 0
  const uint8array = new Uint8Array(arraybuffer)
  console.log("extractBoxes -> uint8array", uint8array)
  while (i < uint8array.length) {
    console.log('i =>', i)
    const box = extractBoxFrom(arraybuffer)
    console.log("extractBoxes -> box", box)
    boxes.push(box)
    console.log("extractBoxes -> boxes", boxes)
    
    i += box.size
    console.log('i after adding box.size =>', i)
    
    console.log("arraybuffer before slicing", arraybuffer)
    arraybuffer = arraybuffer.slice(i)
    console.log("arraybuffer after slicing", arraybuffer)

    if (box.type === 'moof' || box.type === 'traf') {
      i += 4 + 4
      extractBoxes(box.content)
    }

  }
}

const extractBoxFrom = arraybuffer => {
  const uint8array = new Uint8Array(arraybuffer)
  const size = bufToInt(arraybuffer.slice(0, 4))
  const type = bufToStr(uint8array.slice(4, 4+4))
  log(type)
  log(size)
  const content = arraybuffer.slice(4+4, size)
  log(content)
  return { size, type, content }
}

document.querySelector("#localFile").onchange = readFile
document.querySelector("#loadRemoteFileBtn").onclick = readFileRemote