import React, {Component} from 'react'
import {createStore} from 'redux'
import {render} from 'react-dom'
import list from 'data/list'

console.log(Component, render, 'ddd')
class Items extends Component {

  render() {
    return (
      <div>
        <ul>
          {this.props.list.map(item => <li key={item.id}>{item.name}</li>)}
        </ul>
      </div>
    )
  }

}

render(<Items list={list}/>, document.getElementById('js_container'))






