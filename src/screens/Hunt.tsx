import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useGeolocation } from "../hooks/useGeolocation";
import { getRandomEncounter } from "../utils/randomEncounter";
import { notifyNearbyPokemon } from "../services/notifications";

export default function HuntScreen() {
  const location = useGeolocation();

  useEffect(() => {
    if (!location) return;

    const pokemon = getRandomEncounter(location.lat, location.lon);

    notifyNearbyPokemon(pokemon);

  }, [location]);

  return (
    <View>
      <Text>Hunt Mode Active</Text>
      {location && (
        <Text>
          Your Location: {location.lat}, {location.lon}
        </Text>
      )}
    </View>
  );
}
