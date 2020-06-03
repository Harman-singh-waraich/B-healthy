import React from 'react';
import { Document ,pdfjs ,Page } from 'react-pdf'
import "./App.css"
import Web3 from 'web3'
import Authereum from 'authereum'
import Home from './components/home.js'
import FileView from "./components/viewFile.js"
import Reports from './components/reports.js'
import Search from './components/search.js'
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
    alert("metamask not found!   -------- Using Authereum for login plz wait!")
    const authereum = new Authereum('rinkeby')
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
        if(file.type==="application/pdf"){

                  const reader = new  window.FileReader()
                  reader.readAsArrayBuffer(file)
                  reader.onloadend =()=>{
                    var encrypted = this.encrypt(reader.result)
                    this.setState({encryptData: encrypted})
                 }
        }else{
          alert("file format should be .pdf")
          window.location.reload()
        }
    }

    onSubmit = async (name)=>{
      console.log("uploading...");
      this.setState({loading:true})
      try{
        for await (const result of ipfs.add(this.state.encryptData)) {
          this.setState({fileHash:result.path})
          await this.SaveReport(name)
    }
  }catch(err){
    this.setState({loading:false})
    alert(err.message)
  }

 }

 encrypt = (data)=>{
          var encrypted = CryptoJS.AES.encrypt(JSON.stringify(Buffer(data)),"harman" ).toString();
          return encrypted
 }


//decrypt the file ,using key on server-side !!Right now key is given directly!!
 decrypt = async (data,fileHash)=>{
   var file = await this.state.Health.methods.GetDetailedReport(fileHash).call()
   var authorisedUsers = await this.state.Health.methods.getAuthorisedUsers().call()

   var user = file.User
   if(this.state.account == user||authorisedUsers.includes(this.state.account)){
     var decryptedtext = CryptoJS.AES.decrypt(data,"harman" )
     var decrypted = JSON.parse(decryptedtext.toString(CryptoJS.enc.Utf8))
     return decrypted
   }else{
     this.setState({loading:false})
     alert("not authorised!");
     throw("not authorised")

   }
 }


 getFile = async (fileHash)=>{
  this.setState({loading:true})
  for await (const file of ipfs.get(fileHash)) {

  if (!file.content) continue;

  var content = new BufferList()
  for await (const chunk of file.content) {
    content.append(chunk)
  }
  this.decrypt(content.toString(),fileHash).then((buf,err)=>{
    if(err){
      console.log(err.message);
      this.setState({loading:false})
    }else{

      this.setState({content:buf.data})
      var pdf = {
       data: buf.data
     }
      this.setState({loading:false})
      this.setState({content:<FileView file={pdf}/>})
    }
  }).catch((err)=>{});
  }
}


  SaveReport = async (name) =>{
    this.setState({loading:true})
    this.state.Health.methods.SaveReport(this.state.fileHash,name).send({from:this.state.account}).then((result)=>{
      alert("File uploaded!")
      this.setState({loading:false})
    }).catch((err)=>{
      console.log(err.message);
    })
  }

  getReports = async ()=>{
    var reports = await this.state.Health.methods.getUserReports(this.state.account).call()
    return reports;
  }

  getUserNames = async () =>{
    var userNames = await this.state.Health.methods.getUserNames().call()
    return userNames
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

  getUserReportsWithUserName = async (username) =>{
    var reports =[]
    var reportHashes = await this.state.Health.methods.getUserReportsWithUserName(username).call()
    reportHashes.forEach(async (reportHash ) => {
      var report = await this.state.Health.methods.GetDetailedReport(reportHash).call()
      reports.push(report)
    });
    return reports
  }

  render(){
    var content
    if(this.state.loading){
      content = <h1 style={{color:"#fff"}}>Loading...</h1>
    }else{
      content =<div className="App">
      <section className="menu cid-s0z9wIHAuk"  id="menu1-0">



        <nav className="navbar navbar-expand beta-menu navbar-dropdown align-items-center navbar-toggleable-sm bg-color transparent">
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        </button>
        <div className="menu-logo">
        <div className="navbar-brand">
          <span className="navbar-caption-wrap"><a className="navbar-caption text-white display-4" href="index.html">B-Healthy<br/></a></span>
        </div>
      </div>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav nav-dropdown" data-app-modern-menu="true"><li className="nav-item">
            <a className="nav-link link text-white display-4" onClick={()=>{this.setState({content:<Home handleFile={this.handleFile}
                                                                                                     onSubmit = {this.onSubmit}/>})}}>
                <span className="mbri-home mbr-iconfont mbr-iconfont-btn"></span>Home</a>
              </li><li className="nav-item"><a className="nav-link link text-white display-4" onClick={()=>{this.setState({content:<Reports getUserReports={this.getUserReports}
                                                                                                                                    viewFile={this.getFile}/>})}}><span className="mbri-file mbr-iconfont mbr-iconfont-btn"></span>
              My Reports</a></li>
            <li className="nav-item">
              <a className="nav-link link text-white display-4" onClick={()=>{this.setState({content:<Search getUserNames={this.getUserNames}
                                                                                                         getUserReportsWithUserName={this.getUserReportsWithUserName}
                                                                                                         viewFile={this.getFile}/>})}}>
                <span className="mbri-search mbr-iconfont mbr-iconfont-btn"></span>Search</a>
            </li></ul>
      </div>
      </nav>
  </section>
  {this.state.content}
  <section  className="cid-s0zjQiOn5R mbr-reveal" id="footer7-8">

    <div className="container">
    <div className="media-container-row align-center mbr-white">
    <div className="row row-links">
        <ul className="foot-menu">
         <li className="foot-menu-item mbr-fonts-style display-7">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</li><li className="foot-menu-item mbr-fonts-style display-7">
              <a className="text-white mbr-bold" href="https://www.linkedin.com/in/harmeet-singh-b45b11190" target="_blank">Get In Touch</a>
          </li><li className="foot-menu-item mbr-fonts-style display-7">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</li><li className="foot-menu-item mbr-fonts-style display-7">
              <a className="text-white mbr-bold" href="https://github.com/Harman-singh-waraich" target="_blank">Work</a>
          </li></ul>
      </div>
      <div className="row social-row">
        <div className="social-list align-right pb-2">

        </div>
      </div>
      <div className="row row-copirayt">
        <p className="mbr-text mb-0 mbr-fonts-style mbr-white align-center display-7">
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
