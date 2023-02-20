import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import * as parkDate from "./data/skateboard-parks.json";

export default function App() {
  let dist;

  const [viewport, setViewport] = useState({
    latitude: 13.0213,
    longitude: 80.2231,
    width: "100vw",
    height: "100vh",
    zoom: 10
  });
  const [selectedPark, setSelectedPark] = useState(null);
  const [distance, setDistance] = useState(0);
  const [toLat, setToLat] = useState(0);
  const [toLong, setToLong] = useState(0);

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

  const handleChange1 = (event) => {
    setViewport(event.target.value);
  };

  const handleChange2 = (event) => {
    setViewport(event.target.value);
  };

  function display(item, dista) {
    if (dista < 50) {
      console.log(item.properties.NAME);
      console.log(dista);
      // mark = mapboxgl.marker([13.54, 80.25]);
      // mapboxgl.marker;
    }

    else {
      return;
    }
  }

  function calculate() {
    parkDate.features.map((item) => (
      dist = getDistanceFromLatLonInKm(viewport.latitude, viewport.longitude, item.geometry.coordinates[1], item.geometry.coordinates[0]),
      setDistance(dist * 1.6),
      display(item, dist * 1.6)
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

      <input
        type="text"
        id="message"
        name="message"
        onChange={handleChange1}
      />

      <input
        type="text"
        id="message"
        name="message"
        placeholder='Hi'
        onChange={handleChange2}
      />

      <button className="button" onClick={calculate}>
        Generate Countdown
      </button>

      <br /><br /><br /><br />
      <div className="sidebar">
        Distance: {distance} | From Latitude: {viewport.latitude} | From Longitude: {viewport.longitude} | To Latitude: {1} | To Longitude: {2} |
      </div>
      {/* <div ref={mapContainer} className="map-container" /> */}

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
      </ReactMapGL>
    </div>
  );
}
