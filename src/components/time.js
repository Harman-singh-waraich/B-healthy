import React from 'react';

export default class Time extends React.Component{
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
