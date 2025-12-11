import PushNotification from "react-native-push-notification";

// Optional: create notification channel (Android)
PushNotification.createChannel(
  {
    channelId: "pokemon-alerts", // must match channelId in localNotification
    channelName: "Pokemon Alerts",
    channelDescription: "Notifications for nearby Pokémon",
    importance: 4,
    vibrate: true,
  },
  (created: boolean) => console.log(`Channel created: ${created}`) // typed as boolean
);

export function notifyNearbyPokemon(name: string) {
  PushNotification.localNotification({
    channelId: "pokemon-alerts",
    title: "A wild Pokémon is nearby!",
    message: `${name} appeared near your location!`,
  });
}
