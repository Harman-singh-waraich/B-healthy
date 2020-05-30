import React from 'react';
import { Document ,pdfjs ,Page } from 'react-pdf'
import "./App.css"
import Web3 from 'web3'
import Authereum from 'authereum'
const { BufferList } = require('bl')
var CryptoJS = require("crypto-js");

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })



class App extends React.Component {
    constructor(){
      super()
      this.state ={
        buffer : null,
        content : null,
        loading : true
      }
    }

  async componentWillMount(){
    await this.LoadWeb3()
    await this.loadBlockchainData()
    console.log(window.web3);
    this.setState({loading:false})
}
LoadWeb3 =async ()=>{
  if(window.ethereum){
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
}
else if(window.web3){
  window.web3 = new Web3(window.web3.currentProvider)
}
else {
  const authereum = new Authereum('mainnet')
  const provider = authereum.getProvider()
  window.web3 = new Web3(provider)
  await provider.enable()
  const accounts = await window.web3.eth.getAccounts()
  console.log(accounts[0])
}

}
  loadBlockchainData = async ()=>{
 }


//load file and get the buffer ready
    handleFile = (event) =>{
        event.preventDefault()
        const file = event.target.files[0]
        console.log(file);

        const reader = new  window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend =()=>{

          var encrypted = this.encrypt(reader.result)
          this.setState({encryptData: encrypted})
        }
    }

  //  ex hash:  "QmcMtiXRqkSB9XU9sK418Bp9igfSDKajqLCwXnfx5SXVsP"
  // ex hash 2 :"QmNnR4ox1UQAdC5Mzo1E8T5XRmxUp6mDxjR3rLoe3AssvV"
  //ex 3 : "QmPnTzoqGFN5Pv7NGQJgDJVetRYUfc3md3f1EF8GjbNCvj"
  //ex 4 :"QmcxMpZEX84H9JYgLByQtVHUs8H6vcVQw3ng5rYjfTTGxu" encrypted
  // url : https://ipfs.infura.io/ipfs/QmcMtiXRqkSB9XU9sK418Bp9igfSDKajqLCwXnfx5SXVsP
    onSubmit = async (event)=>{
      event.preventDefault()
      console.log("uploading...");
      for await (const result of ipfs.add(this.state.encryptData)) {
        console.log(result)
  }
 }

 encrypt = (data)=>{
          var encrypted = CryptoJS.AES.encrypt(JSON.stringify(Buffer(data)),"harman" ).toString();
          return encrypted
 }

 decrypt = (data)=>{
      var decryptedtext = CryptoJS.AES.decrypt(data,"harman" )
      var decrypted = JSON.parse(decryptedtext.toString(CryptoJS.enc.Utf8))
      return decrypted
 }

 getFile = async (event)=>{
  event.preventDefault()
  for await (const file of ipfs.get("QmcxMpZEX84H9JYgLByQtVHUs8H6vcVQw3ng5rYjfTTGxu")) {
  console.log(file)
  if (!file.content) continue;

  var content = new BufferList()
  for await (const chunk of file.content) {
    content.append(chunk)
  }
  var buf = this.decrypt(content.toString()).data;
  this.setState({content:buf})

  }
}
 viewFile = ()=>{

   var pdf = {
     data: this.state.content
   }
   this.setState({fileView : <Document file ={pdf}>
                                <Page pageNumber={1} />
                              </Document>
         })
 }

  render(){
    var content
    if(this.state.loading){
      content = <h1>Loading...</h1>
    }else{
      content =<div className="App">
                <form onSubmit={this.onSubmit}>
                  <input type="file" onChange={this.handleFile}/>
                  <input type="submit" />
                </form>
                <button onClick={this.getFile}>getFile</button>
                <button onClick={this.viewFile}>viewFile</button>
                {this.state.fileView}
          </div>
    }
    return (
        <div>{content}</div>
  );
}
}

export default App;
