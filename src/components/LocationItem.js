import React, { Component } from 'react';

class LocationItem extends Component {
  render(){
    return (
      <li
        role="button"
        aria-hidden = {this.props.menuHidden}
        tabIndex={this.props.viewIndex}
        onClick={this.props.openInfoWindow.bind(this, this.props.location.marker)}
      >
        {this.props.location.title}
      </li>
    )
  }
}

export default LocationItem;
