import React, { Component } from 'react';
import '../assets/css/App.css';
import LocationList from './LocationList'
import Header from './Header'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      locations:[
        {
          coffee:
          [
            {title: 'Gregory Coffee', location: {lat: 40.7060026, lng: -74.0126318}},
            {title: 'Bluestone Lane', location: {lat: 40.7063355, lng: -74.0118349}},
            {title: 'La Colombe Coffee Roasters', location: {lat: 40.7056386, lng: -74.0083564}},
            {title: 'Financier Patisserie', location: {lat: 40.7044933, lng: -74.0098768}},
            {title: 'Filicori Zecchini Coffee', location: {lat: 40.7049773, lng: -74.014442}},
            {title: 'Bean & Bean', location: {lat: 40.7073381, lng: -74.012508}},
          ]
        },{
          bar:
          [
            {title: 'Clinton Hall', location: {lat: 40.7080302, lng: -74.0148691}},
            {title: 'Broadstone Bar & Kitchen', location: {lat: 40.7041988, lng: -74.0118432}},
            {title: 'Pier A Harbor House', location: {lat: 40.7044181, lng: -74.017902}},
          ]
        }
      ],
      markerOpenedByList:'',
      map: '',
      infowindow: '',
    }

    this.initMap = this.initMap.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
  }

  componentDidMount() {
    window.initMap = this.initMap;
    loadMapJS(`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&callback=initMap`)
  }

  // **************  start of initMap function  **********************//

  initMap() {
    //variables
    let self = this
    let map
    let markers = []
    let styles = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e9e9e9"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    }
]
    //new google map
    const mapview = document.getElementById('map');
    mapview.style.height = window.innerHeight + "px";
    const largeInfowindow = new window.google.maps.InfoWindow();
    map = new window.google.maps.Map(mapview, {
        center: {lat: 40.7118, lng: -74.0131},
        zoom: 16,
        styles,
        mapTypeId: 'roadmap',
        mapTypeControl: false,
    });
    this.setState({
      ...this.state,
      map,
      infowindow: largeInfowindow,
    })

    window.google.maps.event.addListener(largeInfowindow, 'closeclick', function () {
      self.closeInfoWindow();
    });

    window.google.maps.event.addListener(map, 'click', function () {
      self.closeInfoWindow();
    });

    //create customized markers, push to the markers array

    function makeCoffeeIcon(color) {
      return  `https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow-1-small.png,assets/icons/poi/tactile/pinlet_outline_v2-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/cafe_pinlet-1-small.png&highlight=ff000000,ffffff,${color},ffffff&color=ff000000?scale=2`
    }

    function makeBarIcon(color) {
      return  `https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow-1-small.png,assets/icons/poi/tactile/pinlet_outline_v2-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/bar_pinlet-1-small.png&highlight=ff000000,ffffff,${color},ffffff&color=ff000000?scale=2`
    }

    const coffeeDefaultIcon = makeCoffeeIcon('5b4922')
    const coffeeHighlightIcon = makeCoffeeIcon('ff9e67')
    const barDefaultIcon = makeBarIcon('ff9e67')
    const barHighlightIcon = makeBarIcon('5b4922')

    this.state.locations[0].coffee.forEach((location, idx) => {
      const position = location.location
      const title = location.title
      const marker = new window.google.maps.Marker({
        position,
        title,
        id: idx,
        animation: window.google.maps.Animation.DROP,
        icon: coffeeDefaultIcon,
      })
      markers.push(marker)
      marker.addListener('click', function () {
        self.openInfoWindow(marker);
      });
      marker.addListener('mouseover', function(){
        this.setIcon(coffeeHighlightIcon)
      })
      marker.addListener('mouseout', function(){
        this.setIcon(coffeeDefaultIcon)
      })
      location.marker = marker;
    })

    this.state.locations[1].bar.forEach((location, idx) => {
      const position = location.location
      const title = location.title
      const marker = new window.google.maps.Marker({
        position,
        title,
        id: idx,
        animation: window.google.maps.Animation.DROP,
        icon: barDefaultIcon,
      })
      markers.push(marker)
      marker.addListener('click', function () {
        self.openInfoWindow(marker);
      });
      marker.addListener('mouseover', function(){
        this.setIcon(barHighlightIcon)
      })
      marker.addListener('mouseout', function(){
        this.setIcon(barDefaultIcon)
      })
      location.marker = marker;
    })

    //combine markers with the map, show on the screen
    function showMarkers() {
      let bounds = new window.google.maps.LatLngBounds();
      markers.forEach(marker => {
        marker.setMap(map)
        bounds.extend(marker.position)
      })
      map.fitBounds(bounds)
    }

    showMarkers()
  }
  // **************  end of initMap function  **********************//

  // **************  start of callback functions to pass down as props  **********************//

  closeInfoWindow() {
    if (this.state.markerOpenedByList) {
        this.state.markerOpenedByList.setAnimation(null);
    }
    this.setState({
      ...this.state,
      markerOpenedByList: ''
    });
    this.state.infowindow.close();
  }

  openInfoWindow(marker) {
    this.closeInfoWindow();
    this.state.map.setCenter(marker.getPosition());
    this.state.infowindow.open(this.state.map, marker);
    this.setState({
      ...this.state,
      markerOpenedByList: marker
    });
    this.getMarkerInfo(marker)
  }


  handleSideBarToggle = e => {
    e.stopPropagation();
    let sidebar = document.querySelector(".options-box")
    sidebar.classList.toggle('open')
  }
  // **************  end of callback functions to pass down as props  **********************//

  // API call to FOURSQUARE
  getMarkerInfo = marker => {
    let self = this;
    const url = `https://api.foursquare.com/v2/venues/search?client_id=${process.env.REACT_APP_FOURSQUARE_CLIENT_ID}&client_secret=${process.env.REACT_APP_FOURSQUARE_CLIENT_SECRET}&v=20180323&ll=${marker.getPosition().lat()},${marker.getPosition().lng()}&limit=1`;
    fetch(url)
      .then(
        function (response) {
          if (response.status !== 200) {
            self.state.infowindow.setContent("Sorry data can't be loaded");
            return;
          }
          response.json()
            .then(function (data) {
              var location_data = data.response.venues[0];
              var verified = '<b>Verified Location: </b>' + (location_data.verified ? 'Yes' : 'No') + '<br>';
              var checkinsCount = '<b>Number of CheckIn: </b>' + location_data.stats.checkinsCount + '<br>';
              var usersCount = '<b>Number of Users: </b>' + location_data.stats.usersCount + '<br>';
              var tipCount = '<b>Number of Tips: </b>' + location_data.stats.tipCount + '<br>';
              var readMore = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More on Foursquare Website for a place around</a>'
              self.state.infowindow.setContent(checkinsCount + usersCount + tipCount + verified + readMore);
            });
        }
      )
      .catch(function (err) {
          self.state.infowindow.setContent("Sorry data can't be loaded");
      });
  }


  render() {

    return (
      <div className="container">
        <div className="options-box">
          <Header handleSideBarToggle={this.handleSideBarToggle}/>
          <LocationList
            coffeelocations={this.state.locations[0].coffee}
            barlocations={this.state.locations[1].bar}
            openInfoWindow={this.openInfoWindow}
            closeInfoWindow={this.closeInfoWindow}
            getMarkerInfo={this.getMarkerInfo}
            map={this.state.map}
          />
        </div>
        <div id="map"></div>
      </div>
    );
  }
}

export default App;

  // add script onto the html
function loadMapJS(src){
    let ref = document.getElementsByTagName("script")[0];
    let script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    ref.parentNode.insertBefore(script, ref);
}
