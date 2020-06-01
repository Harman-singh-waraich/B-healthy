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


<section class="engine"><a href="https://mobirise.info/z">best free website templates</a></section><section class="header15 cid-s0z9FUwkhE mbr-fullscreen mbr-parallax-background" id="header15-1">



<div class="mbr-overlay" style={{opacity: 0.5, backgroundColor: "rgb(7, 59, 76)"}}></div>

<div class="container align-right">
<div class="row">
<div class="mbr-white col-lg-8 col-md-7 content-container">
    <h1 class="mbr-section-title mbr-bold pb-3 mbr-fonts-style display-1">B-Healthy</h1>
    <p class="mbr-text pb-3 mbr-fonts-style display-5">As panic ensues due to the uprising of the novel coronavirus,Digital health records are relied upon to ensure authorised medical personnel can provide an optimum level of healthcare.<br/>On B-Healthy ,users can publish their health records safely on the blockchain and ensure that only authorised personnel can access them anywhere in the world.</p>
</div>
<div class="col-lg-4 col-md-5">
    <div class="form-container">
        <div class="media-container-column" data-form-type="formoid">

            <form  class="mbr-form form-with-styler" data-form-title="Mobirise Form">
                <div class="row">
                    <div hidden="hidden" data-form-alert="" class="alert alert-success col-12">Thanks for filling out the form!</div>
                    <div hidden="hidden" data-form-alert-danger="" class="alert alert-danger col-12">
                    </div>
                </div>
                <div class="dragArea row">
                    <div class="col-md-12 form-group " data-for="name">
                        <input type="text" name="name"  placeholder="Name" onChange={(e)=>{
                          this.setState({name:e.target.value})
                        }} data-form-field="Name" required="required" class="form-control px-3 display-7" id="name-header15-1" />
                    </div>


                    <div data-for="message" class="col-md-12 form-group ">
                      <input type="file" id="file" onChange={this.props.handleFile} style={{align:"center"}} />
                    </div>

                    <div class="col-md-12 input-group-btn">
                        <button type="submit" onClick={this.submit} class="btn btn-secondary btn-form display-4">SEND REPORT</button>
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
// <form onSubmit={this.onSubmit}>
//   <input type="file" onChange={this.handleFile}/>
//   <input type="submit" />
// </form>
