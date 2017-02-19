

  import React, {Component} from 'react'
  import {render} from 'react-dom'

  class OnePro extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return <div>hello OnePro</div>
    }

  }


  render(<OnePro/>, document.getElementById('js_container'));

