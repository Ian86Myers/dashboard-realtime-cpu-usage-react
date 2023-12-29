import React, { useEffect, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
// import { Icon, Style } from "ol/style";
import { Box } from "@mui/material";

const UserLocationMap = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(location);
      },
      (error) => {
        console.error("Error getting geolocation:", error.message);
        // Handle error
      }
    );
  }, []);

  useEffect(() => {
    if (userLocation) {
      const userLocationPoint = new Point(
        fromLonLat([userLocation.longitude, userLocation.latitude])
      );

      const userLocationFeature = new Feature(userLocationPoint);

      const vectorSource = new VectorSource({
        features: [userLocationFeature],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      const map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([userLocation.longitude, userLocation.latitude]),
          zoom: 10,
        }),
        target: "map",
      });

      return () => {
        map.dispose();
      };
    }
  }, [userLocation]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
     
    </Box>
  );
};

export default UserLocationMap;
