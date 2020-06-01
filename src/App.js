import React from 'react';
import { Document ,pdfjs ,Page } from 'react-pdf'
import "./App.css"
import Web3 from 'web3'
import Authereum from 'authereum'
import Home from './components/home.js'
import FileView from "./components/viewFile.js"
import Reports from './components/reports.js'
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
        loading : true,
        content: <Home handleFile={this.handleFile}
                       onSubmit = {this.onSubmit}
                       />
      }
    }

  async componentWillMount(){
    await this.LoadWeb3()
    await this.loadBlockchainData()
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
    onSubmit = async (name)=>{
      console.log("ran");
      console.log("uploading...");
      for await (const result of ipfs.add(this.state.encryptData)) {
        this.setState({fileHash:result.path})
        console.log(result)
        await this.SaveReport(name)
  }
 }

 encrypt = (data)=>{
          var encrypted = CryptoJS.AES.encrypt(JSON.stringify(Buffer(data)),"harman" ).toString();
          return encrypted
 }

 decrypt = async (data,fileHash)=>{
   var file = await this.state.Health.methods.GetDetailedReport(fileHash).call()
   var authorisedUsers = await this.state.Health.methods.getAuthorisedUsers().call()
   console.log(authorisedUsers,file.User);
   var user = file.User
   if(this.state.account == user||authorisedUsers.includes(this.state.account)){
     var decryptedtext = CryptoJS.AES.decrypt(data,"harman" )
     var decrypted = JSON.parse(decryptedtext.toString(CryptoJS.enc.Utf8))
     return decrypted
   }else{
     alert("not authorised!");
     this.setState({loading:false})
   }
 }


 getFile = async (fileHash)=>{
  for await (const file of ipfs.get(fileHash)) {
  console.log(file)
  if (!file.content) continue;

  var content = new BufferList()
  for await (const chunk of file.content) {
    content.append(chunk)
  }
  this.decrypt(content.toString(),fileHash).then((buf)=>{
    console.log(buf);
    this.setState({content:buf.data})
    var pdf = {
     data: buf.data
   }
    this.setState({content:<FileView file={pdf}/>})
  });
  }
}


  SaveReport = async (name) =>{
    this.setState({loading:true})
    this.state.Health.methods.SaveReport(this.state.fileHash,name).send({from:this.state.account}).then((result)=>{
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

  getUserReports = async () =>{
    var reports =[]
    var reportHashes = await this.state.Health.methods.getUserReports(this.state.account).call()
    reportHashes.forEach(async (reportHash ) => {
      var report = await this.state.Health.methods.GetDetailedReport(reportHash).call()
      reports.push(report)
    });
    return reports
  }

  render(){
    var content
    if(this.state.loading){
      content = <h1>Loading...</h1>
    }else{
      content =<div className="App">
      <section class="menu cid-s0z9wIHAuk" once="menu" id="menu1-0">



        <nav class="navbar navbar-expand beta-menu navbar-dropdown align-items-center navbar-toggleable-sm bg-color transparent">
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <div class="hamburger">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        </button>
        <div class="menu-logo">
        <div class="navbar-brand">
          <span class="navbar-logo">
            <a href="https://mobirise.co">
               <img src="assets/images/logo2.png"  style={{height: 3.8}}/>
            </a>
          </span>
          <span class="navbar-caption-wrap"><a class="navbar-caption text-white display-4" href="index.html">B-Healthy<br/></a></span>
        </div>
      </div>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav nav-dropdown" data-app-modern-menu="true"><li class="nav-item">
            <a class="nav-link link text-white display-4" onClick={()=>{this.setState({content:<Home handleFile={this.handleFile}
                                                                                                     onSubmit = {this.onSubmit}/>})}}>
                <span class="mbri-home mbr-iconfont mbr-iconfont-btn"></span>Home</a>
              </li><li class="nav-item"><a class="nav-link link text-white display-4" onClick={()=>{this.setState({content:<Reports getUserReports={this.getUserReports}
                                                                                                                                    viewFile={this.getFile}/>})}}><span class="mbri-file mbr-iconfont mbr-iconfont-btn"></span>
              My Reports</a></li>
            <li class="nav-item">
              <a class="nav-link link text-white display-4" href="https://mobirise.co">
                <span class="mbri-search mbr-iconfont mbr-iconfont-btn"></span>Search</a>
            </li></ul>
      </div>
      </nav>
  </section>
  {this.state.content}
  <section once="footers" class="cid-s0zjQiOn5R mbr-reveal" id="footer7-8">

    <div class="container">
    <div class="media-container-row align-center mbr-white">
    <div class="row row-links">
        <ul class="foot-menu">
          <li class="foot-menu-item mbr-fonts-style display-7">
              <a class="text-white mbr-bold" href="#" target="_blank">About us</a>
          </li><li class="foot-menu-item mbr-fonts-style display-7">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</li><li class="foot-menu-item mbr-fonts-style display-7">
              <a class="text-white mbr-bold" href="#" target="_blank">Get In Touch</a>
          </li><li class="foot-menu-item mbr-fonts-style display-7">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</li><li class="foot-menu-item mbr-fonts-style display-7">
              <a class="text-white mbr-bold" href="#" target="_blank">Work</a>
          </li></ul>
      </div>
      <div class="row social-row">
        <div class="social-list align-right pb-2">

        </div>
      </div>
      <div class="row row-copirayt">
        <p class="mbr-text mb-0 mbr-fonts-style mbr-white align-center display-7">
            © Copyright -Harmeet Singh</p>
      </div>
      </div>
      </div>
  </section>
</div>
    }
    return (
        <div>{content}</div>
  );
}
}

export default App;


              // <button onClick={this.getFile}>getFile</button>
              // <button onClick={this.viewFile}>viewFile</button>
              // {this.state.fileView}
