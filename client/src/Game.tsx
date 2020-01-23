import React, { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import axios from "axios"
import {
  ViroARScene,
  ViroAmbientLight,
  ViroBox,
  ViroMaterials,
  ViroARTrackingTargets,
  ViroARImageMarker,
  ViroImage,
} from 'react-viro';

Geolocation.requestAuthorization();

const API_KEY = "AIzaSyAioo1Sp4hpFQo8hJlFAthXgN1NIdG6NmE"

const Game: React.FC = () => {

  const [rating, setRating] = useState(0.0)
  
  useEffect(() => {

    Geolocation.getCurrentPosition(({ coords }) => {
      const {latitude, longitude} = coords

      axios
      .get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=50&keyword=stach&key=${API_KEY}`)
      .then(({ data }) => {
        const place_id = data.results && data.results[0] && data.results[0].place_id
        if (place_id) {
          axios.get("https://maps.googleapis.com/maps/api/place/details/json?fields=rating&place_id="+ place_id +"&key="+ API_KEY)
          .then(({ data }) => {
            setRating(data.results && data.result && data.result.rating)

          })
        }
      })

    }, console.error, { enableHighAccuracy: true })
  })

  return (
    <ViroARScene>
      <ViroAmbientLight color="#aaaaaa" />
      <ViroBox
        // dragType="FixedToWorld"
        // onDrag={() => {}}
        height={1}
        length={1}
        width={1}
        position={[0, 0, -1]}
        scale={[0.1, 0.1, 0.1]}
        materials={['green']}
        // physicsBody={{
        //   type: 'Dynamic',
        //   mass: 0.0001,
        // }}
      />

<ViroARImageMarker target={"targetOne"} >
<ViroImage
    height={1}
    width={1}
    position={[0, .25, 0]} scale={[.5, .5, .5]}
    placeholderSource={require("./res/intracto.png")}
    source={require("./res/intracto.png")}
 />
  </ViroARImageMarker>


    </ViroARScene>
  );
};

ViroMaterials.createMaterials({
  green: {
    diffuseTexture: require('./res/grid_bg.jpg'),
    diffuseColor: 'green',
  },
});

ViroARTrackingTargets.createTargets({
  "targetOne" : {
    source : require('./res/favicon.png'),
    orientation : "Up",
    physicalWidth : 0.1 // real world width in meters
  },
});

export default Game;
