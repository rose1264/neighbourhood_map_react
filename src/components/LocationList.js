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
      locations: [...this.props.coffeelocations, ...this.props.barlocations],
      searchedLocations: [...this.props.coffeelocations, ...this.props.barlocations]
    });
  }

  handleChange = e => {
    this.state.locations.forEach(location => {
      location.marker.setMap(null)
    })
    let map = this.props.map
    let markers=[]
    let largeInfowindow = new window.google.maps.InfoWindow();
    let searchValue = e.target.value

    let searchedLocations = this.state.locations.filter(location => {
      return location.title.toLowerCase().includes(searchValue)
    })

    searchedLocations.forEach((location, idx)=>{
      const position = location.location
      const title = location.title
      const marker = new window.google.maps.Marker({
        position,
        title,
        id: idx,
      })
      markers.push(marker)

      marker.addListener('click', function() {
        this.props.populateInfoWindow(this, largeInfowindow);
      })
      location.marker = marker;
    })
    markers.forEach(marker=> {
      marker.setMap(map)
    })

    this.setState({
      ...this.state,
      searchedLocations,
      query: searchValue,
    })
  }

  render() {
    let locationlist = this.state.searchedLocations.map((list, idx) => {
      return (
        <LocationItem
          key={idx}
          list={list}
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
          onChange={this.handleChange}
          style={{width: '90%'}}
        />
        <ul>{locationlist}</ul>
      </div>
    );
  }
}

export default LocationList;
