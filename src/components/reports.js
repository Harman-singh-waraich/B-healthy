import React from "react";
import { Card ,Button} from 'react-bootstrap';
import { Row, Col, Divider } from 'antd';


class Time extends React.Component{
    constructor(props){
      super(props)
    }
    render(){
      var utcSeconds = this.props._time;
      var d = new Date(0);
      d.setUTCSeconds(utcSeconds);
      return <p style={{color:"#fff"}}>{`${d}`}</p>
    }
  }

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


class Reports extends React.Component{
  constructor(props){
    super(props)
    this.state ={
      loading:true,
      content:<p>loading...</p>
    }
  }
  async componentDidMount(){
    this.loadReports().then(()=>{
      this.setContent()
    })

  }

  loadReports = async ()=>{
    this.setState({loading:true})
      var reports = await this.props.getUserReports()

          this.setState({reports:reports})
    this.setState({loading:false})
  }

    setContent =()=>{
      this.setState({content:<List reports={this.state.reports} fileView={this.viewFile}/>})
      this.setState({loading:false})
    }

  viewFile = (fileHash) =>{
    this.props.viewFile(fileHash)
  }


  render(){
    var content
    if(this.state.loading){
      content = <div>loading reports</div>
    }else{
      content=<div>

                  <section class="engine"></section><section class="services5 cid-s0zampLCEb mbr-parallax-background" id="services5-4">

                    <div class="mbr-overlay" style={{opacity: 0.5, backgroundColor: "rgb(206, 191, 175)"}}>
                    </div>

                    <div class="container">
                      <div class="row">
                        <div class="title pb-5 col-12">
                          <h2 class="align-left mbr-fonts-style m-0 display-2">REPORTS</h2>
                        </div>

                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        {this.state.content}
                      </Row>

                    </div>
                      <Button onClick={this.loadReports}>view files</Button>
                    </div>
                  </section>
                {this.state.viewFile}
      </div>
    }
    return <div>{content}</div>
  }
}
export default Reports;
