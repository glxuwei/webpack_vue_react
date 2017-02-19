

  import React, {Component} from 'react'
  import {render} from 'react-dom'

  class One extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return <div>hello One</div>
    }

  }


  render(<One/>, document.getElementById('js_container'));

