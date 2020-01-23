import React, {useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {
  ViroARScene,
  ViroAmbientLight,
  ViroBox,
  ViroMaterials,
  ViroARTrackingTargets,
  ViroARImageMarker,
  ViroImage,
  Viro3DObject,
} from 'react-viro';

// Geolocation.requestAuthorization();

const API_KEY = 'AIzaSyAioo1Sp4hpFQo8hJlFAthXgN1NIdG6NmE';

const Game: React.FC = () => {
  const [rating, setRating] = useState(0.0);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      ({coords}) => {
        const {latitude, longitude} = coords;

        axios
          .get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&keyword=stach&key=${API_KEY}`,
          )
          .then(({data}) => {
            const place_id =
              data.results && data.results[0] && data.results[0].place_id;
            if (place_id) {
              axios
                .get(
                  'https://maps.googleapis.com/maps/api/place/details/json?fields=rating&place_id=' +
                    place_id +
                    '&key=' +
                    API_KEY,
                )
                .then(({data}) => {
                  setRating(data.result && data.result.rating);
                });
            }
          });
      },
      console.error,
      {enableHighAccuracy: true},
    );
  });
  console.log({rating});

  return (
    <ViroARScene>
      <ViroAmbientLight color="#aaaaaa" />
      <ViroARImageMarker target={'logo'}>
        {rating
          ? Array(Math.round(rating)).map((item, i) => (
              <Viro3DObject
                source={require('./res/star.obj')}
                position={[0.0 + i * 0.5, 1, -10]}
                rotation={[90, 0, 0]}
                scale={[0.1, 0.1, 0.1]}
                materials={['yellow']}
                type="OBJ"
              />
            ))
          : null}
      </ViroARImageMarker>
    </ViroARScene>
  );
};

ViroMaterials.createMaterials({
  yellow: {
    diffuseTexture: require('./res/grid_bg.jpg'),
    diffuseColor: 'yellow',
  },
});

ViroARTrackingTargets.createTargets({
  logo: {
    source: require('./res/stach.png'),
    orientation: 'Up',
    physicalWidth: 0.165, // real world width in meters
  },
});

export default Game;
