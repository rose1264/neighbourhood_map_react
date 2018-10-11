import React, {Component} from 'react';
import LocationItem from './LocationItem';

class LocationList extends Component {
  state={
    locations:'',
    searchedLocations:'',
    query:'',
  }

  componentWillMount() {
    this.setState({
      searchedLocations: [...this.props.coffeelocations, ...this.props.barlocations],
      locations: [...this.props.coffeelocations, ...this.props.barlocations]
    });

  }


//******************start of callback *******************//
  handleChange = e => {
    this.props.closeInfoWindow();
    var locations = [];
    this.state.searchedLocations.forEach(function (location) {
      if (location.title.toLowerCase().includes(e.target.value.toLowerCase())) {
          location.marker.setVisible(true);
          locations.push(location);
      } else {
          location.marker.setVisible(false);
      }
    });

    this.setState({
      'locations': locations,
      'query': e.target.value
    });
  }
//*************************end of callback *****************//
  render() {
    let viewIndex =0
    if(this.props.menuHidden) {
      viewIndex = -1
    }
    let locationlist = this.state.locations.map((location, idx) => {
      return (
        <LocationItem
          menuHidden = {this.state.menuHidden}
					viewIndex={viewIndex}
          key={idx}
          location={location}
          openInfoWindow={this.props.openInfoWindow}
        />
      )
    })
    return (
      <div>
        <input
          role="search"
          aria-labelledby="filter"
          placeholder="Filter"
          value={this.state.query}
          aria-hidden = {this.props.menuHidden}
          tabIndex={viewIndex}
          onChange={this.handleChange}
          style={{width: '90%'}}
        />
        <ul>{locationlist}</ul>
      </div>
    );
  }
}

export default LocationList;
