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

    //recreate new markers when filter happens on the same map

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
        populateInfoWindow(this, largeInfowindow);
      })
      location.marker = marker;
    })

    const populateInfoWindow = (marker, infowindow) => {
      const url = `https://api.foursquare.com/v2/venues/search?client_id=${process.env.REACT_APP_FOURSQUARE_CLIENT_ID}&client_secret=${process.env.REACT_APP_FOURSQUARE_CLIENT_SECRET}&v=20180323&ll=${marker.getPosition().lat()},${marker.getPosition().lng()}&limit=1`;
      if (infowindow.marker !== marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        infowindow.addListener('closeclick',function(){
          infowindow.setMarker = null;
        });
        let self = this;
        fetch(url)
          .then(
            function (response) {
              if (response.status !== 200) {
                infowindow.setContent("Sorry data can't be loaded");
                return;
              }
              response.json()
                .then(function (data) {
                  var location_data = data.response.venues[0];
                  var verified = '<b>Verified Location: </b>' + (location_data.verified ? 'Yes' : 'No') + '<br>';
                  var checkinsCount = '<b>Number of CheckIn: </b>' + location_data.stats.checkinsCount + '<br>';
                  var usersCount = '<b>Number of Users: </b>' + location_data.stats.usersCount + '<br>';
                  var tipCount = '<b>Number of Tips: </b>' + location_data.stats.tipCount + '<br>';
                  var readMore = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More on Foursquare Website</a>'
                  infowindow.setContent(checkinsCount + usersCount + tipCount + verified + readMore);
                });
            }
          )
          .catch(function (err) {
              infowindow.setContent("Sorry data can't be loaded");
          });
      }
    }

    //combine markers with map

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
