import React, { Component } from 'react';

class LocationItem extends Component {
  render(){
    return (
      <li
        role="button"
        onClick={this.props.openInfoWindow.bind(this, this.props.location.marker, this.props.location)}
      >
        {this.props.location.title}
      </li>
    )
  }
}

export default LocationItem;
