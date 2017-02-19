

  import React, {Component} from 'react'
  import {render} from 'react-dom'

  class ReactOne extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return <div>hello ReactOne</div>
    }

  }


  render(<ReactOne/>, document.getElementById('js_container'));

