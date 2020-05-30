import React from 'react';
import { Document ,pdfjs ,Page } from 'react-pdf'
import "./App.css"
var CryptoJS = require("crypto-js");

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })



class App extends React.Component {
    constructor(){
      super()
      var encrypted = CryptoJS.AES.encrypt("harman","harman" );
      var decrypted = CryptoJS.AES.decrypt(encrypted,"harman" )
      console.log(encrypted.toString());
      console.log(decrypted.toString(CryptoJS.enc.Utf8));
      this.state ={
        buffer : null,
        content : null
      }
    }

    handleFile = (event) =>{
        event.preventDefault()
        const file = event.target.files[0]
        console.log(file);
        const reader = new  window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend =()=>{
          this.setState({buffer : Buffer(reader.result)});
        }
    }

  //  ex hash:  "QmcMtiXRqkSB9XU9sK418Bp9igfSDKajqLCwXnfx5SXVsP"
  // ex hash 2 :"QmNnR4ox1UQAdC5Mzo1E8T5XRmxUp6mDxjR3rLoe3AssvV"
  //ex 3 : "QmPnTzoqGFN5Pv7NGQJgDJVetRYUfc3md3f1EF8GjbNCvj"
  // url : https://ipfs.infura.io/ipfs/QmcMtiXRqkSB9XU9sK418Bp9igfSDKajqLCwXnfx5SXVsP
    onSubmit = async (event)=>{
      event.preventDefault()
      console.log("uploading...");
      for await (const result of ipfs.add(this.state.buffer)) {
        console.log(result)
  }
 }

 getFile = async (event)=>{
  event.preventDefault()
  for await (const file of ipfs.get("QmPnTzoqGFN5Pv7NGQJgDJVetRYUfc3md3f1EF8GjbNCvj")) {
  console.log(file)
  if (!file.content) continue;

  var arr = []
  for await (const chunk of file.content) {
    arr.push(chunk._bufs[0])
  }
  var buf = Buffer.concat(arr)
  console.log(buf);
  this.setState({content:buf})

  }
}
 viewFile = ()=>{

   var pdf = {
     data: this.state.content
   }
   console.log(pdf.data);
   this.setState({fileView : <Document file ={pdf}>
                                <Page pageNumber={1} />
                              </Document>
         })


 }

  render(){
    return (
    <div className="App">
        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.handleFile}/>
          <input type="submit" />
        </form>
        <button onClick={this.getFile}>getFile</button>
        <button onClick={this.viewFile}>viewFile</button>
        {this.state.fileView}
    </div>
  );
}
}

export default App;
