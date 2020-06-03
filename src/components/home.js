import React from 'react'

class Home extends React.Component{
  constructor(props){
    super(props)
  }
  submit = async (e)=>{
    e.preventDefault()
    await this.props.onSubmit(this.state.name)
  }
  render(){
    return <div>


            <section className="header15 cid-s0z9FUwkhE mbr-fullscreen mbr-parallax-background" id="header15-1">
                <div className="mbr-overlay" style={{opacity: 0.5, backgroundColor: "rgb(7, 59, 76)"}}></div>

                  <div className="container align-right">
                  <div className="row">
                  <div className="mbr-white col-lg-8 col-md-7 content-container">
                    <h1 className="mbr-section-title mbr-bold pb-3 mbr-fonts-style display-1">B-Healthy</h1>
                    <p className="mbr-text pb-3 mbr-fonts-style display-5">As panic ensues due to the uprising of the novel coronavirus,Digital health records are relied upon to ensure authorised medical personnel can provide an optimum level of healthcare.<br/>On B-Healthy ,users can publish their health records safely on the blockchain and ensure that only authorised personnel can access them anywhere in the world.</p>
                  </div>
                  <div className="col-lg-4 col-md-5">
                    <div className="form-container">
                      <div className="media-container-column" data-form-type="formoid">

                      <form  className="mbr-form form-with-styler" data-form-title="Mobirise Form">
                        <div className="row">
                          <div hidden="hidden" data-form-alert="" className="alert alert-success col-12">Thanks for filling out the form!</div>
                          <div hidden="hidden" data-form-alert-danger="" className="alert alert-danger col-12">
                        </div>
                        </div>
                      <div className="dragArea row">
                      <div className="col-md-12 form-group " data-for="name">
                        <input type="text" name="name"  placeholder="Name" onChange={(e)=>{
                          this.setState({name:e.target.value})
                        }} data-form-field="Name" required="required" className="form-control px-3 display-7" id="name-header15-1" />
                    </div>


                    <div data-for="message" className="col-md-12 form-group ">
                      <input type="file" id="file" onChange={this.props.handleFile} style={{align:"center"}} />
                    </div>

                    <div className="col-md-12 input-group-btn">
                        <button type="submit" onClick={this.submit} className="btn btn-secondary btn-form display-4">SEND REPORT</button>
                    </div>
                </div>
            </form>

        </div>
    </div>
</div>
</div>
</div>
</section>


            </div>
  }
}
export default Home;
