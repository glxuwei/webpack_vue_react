module.exports = `

  import React, {Component} from 'react'
  import {render} from 'react-dom'

  class {name} extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return <div>hello {name}</div>
    }

  }


  render(<{name}/>, document.getElementById('js_container'));

`
