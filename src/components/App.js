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
      prevMarker:'',
      map: '',
      infowindow: '',
    }
  }

  componentDidMount() {
    window.initMap = this.initMap;
    loadMapJS(`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&callback=initMap`)
  }

  initMap = () => {
    //variables
    let map
    let markers = []
    let largeInfowindow = new window.google.maps.InfoWindow();
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
    //render google map
    const mapview = document.getElementById('map');
    mapview.style.height = window.innerHeight + "px";
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
      // infowindow: largeInfowindow,
    })

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
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
      })
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
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
      })
      marker.addListener('mouseover', function(){
        this.setIcon(barHighlightIcon)
      })
      marker.addListener('mouseout', function(){
        this.setIcon(barDefaultIcon)
      })
      location.marker = marker;
    })

    //callback in marker creator
    function populateInfoWindow(marker, infowindow) {
      if (infowindow.marker !== marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        infowindow.addListener('closeclick',function(){
          infowindow.setMarker = null;
        });
      }
    }

    //markers setMap
    function showListings() {
      let bounds = new window.google.maps.LatLngBounds();
      markers.forEach(marker => {
        marker.setMap(map)
        bounds.extend(marker.position)
      })
      map.fitBounds(bounds)
    }

    showListings()

    function makeCoffeeIcon(color) {
      return  `https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow-1-small.png,assets/icons/poi/tactile/pinlet_outline_v2-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/cafe_pinlet-1-small.png&highlight=ff000000,ffffff,${color},ffffff&color=ff000000?scale=2`
    }

    function makeBarIcon(color) {
      return  `https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow-1-small.png,assets/icons/poi/tactile/pinlet_outline_v2-1-small.png,assets/icons/poi/tactile/pinlet-1-small.png,assets/icons/poi/quantum/pinlet/bar_pinlet-1-small.png&highlight=ff000000,ffffff,${color},ffffff&color=ff000000?scale=2`
    }
  }

  openInfoWindow = (marker,list) => {
    this.closeInfoWindow();
    this.state.infowindow.open(this.state.map, marker);
    this.setState({
        'prevmarker': marker
    });
    this.state.infowindow.setContent(list.title);
  }

  closeInfoWindow = () => {
    if (this.state.prevmarker) {
        this.state.prevmarker.setAnimation(null);
    }
    this.setState({
        'prevmarker': ''
    });
    this.state.infowindow.close();
  }

  handleSideBarToggle = e => {
    e.stopPropagation();
    let sidebar = document.querySelector(".options-box")
    sidebar.classList.toggle('open')
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
            map={this.state.map}
          />
        </div>
        <div id="map"></div>
      </div>
    );
  }
}

export default App;

function loadMapJS(src){
    let ref = document.getElementsByTagName("script")[0];
    let script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    ref.parentNode.insertBefore(script, ref);
}
