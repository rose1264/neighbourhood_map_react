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
    let searchValue = e.target.value
    let searchedLocations = this.state.locations.filter(location => {
      return location.title.toLowerCase().includes(searchValue)
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
