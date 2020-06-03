import React from 'react'
import ReactSearchBox from 'react-search-box'
import { Card ,Button} from 'react-bootstrap';
import  Time from './time.js'
import { FiSearch } from "react-icons/fi";

function List(props){
  const reports = props.reports

  var items =[]
  const listItems = reports.map((report)=>{
                   items.push(<div>
                                <Card
                                  bg={'secondary'}
                                  key={1}
                                  text={'light'}
                                  style={{ width: '80vw',height:"121px" }}>
                                    <Card.Body>
                                      <Card.Title>{report.UserName}</Card.Title>
                                        <Card.Text style={{color:"#fff"}}>
                                          <Time _time={report.dated}/>
                                        </Card.Text>
                                        <Button variant="primary" onClick={()=>{props.fileView(report.fileHash)}} style={{float:"right",height:"50px"}}>View</Button>
                                      </Card.Body>
                                  </Card>
                                  <div style={{height:"30px"}}><p></p></div>
                                  </div>

                    )
  })
  return(
     <ul>{items}</ul>
  )
}

export default class Search extends React.Component{
  constructor(props){
    super(props)
    this.state={
        content:<div></div>
    }
  }
  async componentDidMount(){
    await this.loadUserNames()
  }
  loadUserNames = async()=>{
    var userNames = await this.props.getUserNames()
    var data =[]
    userNames.forEach((name) => {
      data.push({key:name,value:name})
    });
    this.setState({data:data})
  }

  viewFile = (fileHash) =>{
    this.props.viewFile(fileHash)
  }
  loadReports = async (username)=>{
    var reports = await this.props.getUserReportsWithUserName(username)
    this.setState({reports:reports})
  }
  setContent = ()=>{
      this.setState({content:<List reports={this.state.reports} fileView={this.viewFile}/>})
  }

  showReports =  ()=>{
      this.setContent()
  }
  render(){
    return(
    <section className="services5 cid-s0zampLCEb mbr-parallax-background" id="services5-4" style={{height:"80vh"}}>
    <div className="mbr-overlay" style={{opacity: 0.5, backgroundColor: "rgb(206, 191, 175)"}}>
    </div>

    <div className="container">
    <div style={{width:"55vw",float:"left",paddingTop:"10px"}}><ReactSearchBox
      placeholder="Search with User name"
      data={this.state.data}
      onSelect={ (record) => {this.setState({record:record});this.loadReports(record.key);console.log("updated")}}
      onFocus={() => {
        console.log('This function is called when is focussed')
      }}
      // onChange={(record) => console.log(record)}
      fuseConfigs={{
        threshold: 0.05,
      }}
      /></div>
      <div style={{float:"left"}}><Button onClick={this.showReports} style={{height:"45px"}}>Search</Button></div>

      {this.state.content}
    </div>

</section>

    )
  }
}
