import React, { Component } from 'react';

class LocationItem extends Component {
  render(){
    return (
      <li
        role="button"
        onClick={this.props.openInfoWindow.bind(this, this.props.list.marker, this.props.list)}
      >
        {this.props.list.title}
      </li>
    )
  }
}

export default LocationItem;
