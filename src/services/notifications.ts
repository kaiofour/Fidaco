import PushNotification from "react-native-push-notification";

export function notifyNearbyPokemon(name: string) {
  PushNotification.localNotification({
    channelId: "pokemon-alerts",
    title: "A wild Pokémon is nearby!",
    message: `${name} appeared near your location!`,
  });
}
