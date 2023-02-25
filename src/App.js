import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { GoogleComponent } from 'react-google-location'
import * as parkDate from "./data/skateboard-parks.json";

const API_KEY = AIzaSyDqfJ_zdvn2YbMEhhiIYN__D74FAIJB_Fs;

export default function App() {
  let dist;
  // let places=[];
  let [places, setPlaces] = useState([]);
  const temp = {
    latitude: 13.0213,
    longitude: 80.2231,
    width: "100vw",
    height: "100vh",
    zoom: 10
  };

  const [viewport, setViewport] = useState({
    latitude: 13.0213,
    longitude: 80.2231,
    width: "50vw",
    height: "50vh",
    zoom: 10
  });
  const [selectedPark, setSelectedPark] = useState(null);
  const [distance, setDistance] = useState(0);
  const [fromLat, setFromLat] = useState(0);
  const [fromLong, setFromLong] = useState(0);
  const [toLat, setToLat] = useState(0);
  const [toLong, setToLong] = useState(0);
  const [radius, setRadius] = useState(0);
  const [currentLocation, setCurrentLocation] = useState({});
  const [place, setPlace] = useState("");

  useEffect(() => {
    getLocation();
  }, []);

  function changeCoord(lat, lon) {
    setCurrentLocation({ lat, lon });
  }

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ latitude, longitude });
    })
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function display(item, dista, radi) {
    console.log("Radius: " + radi);
    if (dista < radi) {
      console.log(item.properties.NAME);
      console.log(dista);
      let temp = places;
      temp.push(item.properties.NAME);
      setPlaces(temp);
      // places.push(item.properties.NAME);
      // mark = mapboxgl.marker([13.54, 80.25]);
      // mapboxgl.marker;
    }

    else {
      return;
    }
  }

  function calculate(radius) {
    parkDate.features.map((item) => (
      console.log("To Lat: " + item.geometry.coordinates[1]),
      console.log("To Long: " + item.geometry.coordinates[0]),
      setToLat(item.geometry.coordinates[1]),
      setToLong(item.geometry.coordinates[0]),
      dist = getDistanceFromLatLonInKm(currentLocation.latitude, currentLocation.longitude, item.geometry.coordinates[1], item.geometry.coordinates[0]),
      setDistance(dist * 1.6),
      display(item, dist * 1.6, radius)
    ))
  }

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedPark(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div>

      {/* <input
        type="number"
        id="message"
        name="message"
        placeholder='Latitude'
        onChange={(e) => { setFromLat(e.target.value) }}
      />

      <input
        type="number"
        id="message"
        name="message"
        placeholder='Longitude'
        onChange={(e) => { setFromLong(e.target.value) }}
      /> */}

      <input
        type="number"
        id="message"
        name="message"
        placeholder='Radius'
        onChange={(e) => { setRadius(e.target.value) }}
      />
      
      {console.log("Rad: " + radius)};
      <button className="button" onClick={() => calculate(radius)}>
        Calculate Distance
      </button>

      <h1>Current Location</h1>
      <p>Latitude: {currentLocation.latitude}</p>
      <p>Longitude: {currentLocation.longitude}</p>

      <br /><br /><br /><br />
      <div className="sidebar">
        Distance: {distance} | From Latitude: {currentLocation.latitude} | From Longitude: {currentLocation.longitude} | To Latitude: {toLat} | To Longitude: {toLong} | Radius: {radius} |
      </div>
      {/* <div ref={mapContainer} className="map-container" /> */}

      <GoogleComponent
         
          apiKey={API_KEY}
          language={'en'}
          country={'country:in|country:us'}
          coordinates={true}
          currentCoordinates={{
            "lat": currentLocation.latitude,
            "lng": currentLocation.longitude
          }}
          placeholder={'Start typing location'}
          locationBoxStyle={'custom-style'}
          locationListStyle={'custom-style-list'}
          onChange={(e) => { setPlace(e.target.value) }} />

      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={"pk.eyJ1IjoiaGFyc2hpdDMiLCJhIjoiY2xkdnhuY2x1MDIxejNvcHJrYzNpeWpieSJ9.Jqz7FESCBh3aDdZh18m35A"}
        mapStyle="mapbox://styles/mapbox/navigation-day-v1"
        onViewportChange={viewport => {
          setViewport(viewport);
        }}
      >

        {parkDate.features.map(park => (
          <Marker
            key={park.properties.PARK_ID}
            latitude={park.geometry.coordinates[1]}
            longitude={park.geometry.coordinates[0]}
          >
            <button
              className="marker-btn"
              onClick={e => {
                e.preventDefault();
                setSelectedPark(park);
              }}
            >
              <img src="https://png.pngtree.com/png-clipart/20210311/original/pngtree-location-marker-png-image_5990782.jpg" alt="Skate Park Icon" width="1000px" height="1000px" />
            </button>
          </Marker>
        ))}

        {selectedPark ? (
          () => changeCoord(selectedPark.geometry.coordinates[1], selectedPark.geometry.coordinates[0]),
          <Popup
            latitude={selectedPark.geometry.coordinates[1]}
            longitude={selectedPark.geometry.coordinates[0]}
            onClose={() => {
              setSelectedPark(null);
            }}
          >
            <div>
              <h2>{selectedPark.properties.NAME}</h2>
              <p>{selectedPark.properties.DESCRIPTIO}</p>
            </div>
          </Popup>
        ) : null}

        {places.map((a) => {
          return (
            <>
              Place is:{a}
              <br></br>
            </>
          )
        })}
      </ReactMapGL>
    </div>
  );
}
