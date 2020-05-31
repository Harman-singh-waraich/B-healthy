import React from 'react';
import { Document ,pdfjs ,Page } from 'react-pdf'
import "./App.css"
import Web3 from 'web3'
import Authereum from 'authereum'
import health from "./abis/Health.json"
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
        loading : true
      }
    }

  async componentWillMount(){
    await this.LoadWeb3()
    await this.loadBlockchainData()
    await this.AddAuth()
    this.setState({loading:false})
}
LoadWeb3 =async ()=>{ //check for metamask else use Authereum
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
    //"0x4890FAE834401502cC9d84dbB22383351f488844"
    window.accounts = await window.web3.eth.getAccounts();
    console.log(window.accounts);
    this.setState({account:window.accounts[0]})

    const networkId = await window.web3.eth.net.getId()
    const health_address = health.networks[networkId].address;
    const Health = await new window.web3.eth.Contract(health.abi,health.networks[networkId].address);
    this.setState({Health})
 }

 //check for account change
  updater = setInterval(async ()=>{
   let self = this;
   window.ethereum.on('accountsChanged', function (accounts) {
      window.location.reload();
      self.setState({account:accounts[0]})
    })
  },1000)

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

  //ex 3 : "QmPnTzoqGFN5Pv7NGQJgDJVetRYUfc3md3f1EF8GjbNCvj"
  //ex 4 :"QmcxMpZEX84H9JYgLByQtVHUs8H6vcVQw3ng5rYjfTTGxu" encrypted
    onSubmit = async (event)=>{
      event.preventDefault()
      console.log("uploading...");
      for await (const result of ipfs.add(this.state.encryptData)) {
        this.setState({fileHash:result.path})
        console.log(result)
        await this.SaveReport()
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
     data: this.state.buffer
   }
   this.setState({fileView : <Document file ={pdf}>
                                <Page pageNumber={1} />
                              </Document>
         })
 }

  SaveReport = async () =>{
    this.setState({loading:true})
    this.state.Health.methods.SaveReport(this.state.fileHash).send({from:this.state.account}).then((result)=>{
      console.log(result);
      this.setState({loading:false})
    }).catch((err)=>{
      console.log(err.message);
    })
  }
  getReports = async ()=>{
    var reports = await this.state.Health.methods.getUserReports(this.state.account).call()
    return reports;
  }
  AddAuth = async () =>{
    this.setState({loading:true})
    this.getReports().then((files)=>{
      this.state.Health.methods.addAuth(files[0],"0x11161cdda89164e4d130D6134f2D1d1AB7D8eF1E").send({from:this.state.account}).then((result)=>{
        console.log(result);
        this.setState({loading:false})
      }).catch((err)=>{
        console.log(err.message);
        this.setState({loading:false})
      })
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
