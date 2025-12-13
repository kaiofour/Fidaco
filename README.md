# Fidaco

Fidaco is a React Native mobile application designed to provide a Pokémon-themed experience, incorporating features like a Pokedex, augmented reality (AR) for "hunting" Pokémon, user authentication, and profile management.

## Features

*   **User Authentication:** Secure sign-up and sign-in functionality powered by Firebase.
*   **Pokedex:** Browse a comprehensive list of Pokémon and view detailed information for each.
*   **Augmented Reality (AR):** Engage in an immersive AR experience to discover and interact with Pokémon in the real world.
*   **Pokémon Hunt:** A dedicated screen for "hunting" Pokémon, potentially utilizing location-based services.
*   **Home/Feed Screen:** A central hub for updates and interactions within the application.
*   **User Profile:** Manage your personal profile and track your Pokémon journey.
*   **Location-Based Services:** Integrated mapping capabilities for enhanced gameplay.

## Technologies Used

*   **Framework:** React Native
*   **Language:** TypeScript
*   **Navigation:** React Navigation (Stack and Bottom Tabs)
*   **Backend:** Firebase (Authentication, Firestore Database)
*   **API Client:** Axios
*   **Mapping:** React Native Maps
*   **Camera:** React Native Vision Camera
*   **Local Storage:** Async Storage
*   **Styling:** React Native Vector Icons
*   **Linting & Formatting:** ESLint, Prettier
*   **Testing:** Jest

## Installation

To get a local copy up and running, follow these steps.

### Prerequisites

*   Node.js (>= 20)
*   npm or Yarn
*   React Native development environment set up (see [React Native Environment Setup](https://reactnative.dev/docs/environment-setup))
*   Android Studio or Xcode for running on emulators/simulators or physical devices.
*   Firebase project configured with Authentication and Firestore, and `google-services.json` (for Android) and `GoogleService-Info.plist` (for iOS) placed in the respective `android/app` and `ios/Fidaco` directories.

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/Fidaco.git
    cd Fidaco
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Install CocoaPods (iOS only):**
    ```bash
    cd ios && pod install && cd ..
    ```
4.  **Link assets (if any custom fonts or assets are used):**
    ```bash
    npx react-native link
    ```

## Running the Application

### Android

```bash
npm run android
# or yarn android
```

### iOS

```bash
npm run ios
# or yarn ios
```

## Scripts

*   `npm run android`: Runs the app on a connected Android device or emulator.
*   `npm run ios`: Runs the app on a connected iOS device or simulator.
*   `npm start`: Starts the Metro bundler.
*   `npm run lint`: Lints the codebase using ESLint.
*   `npm run test`: Runs tests using Jest.

## Project Structure

```
.
├── android/            # Android specific project files
├── ios/                # iOS specific project files
├── src/
│   ├── api/            # API service integrations (e.g., pokeApi.ts)
│   ├── components/     # Reusable UI components (e.g., BottomNavbar.tsx)
│   ├── context/        # React Context for global state management (e.g., PokemonContext.tsx)
│   ├── screens/        # Individual application screens (e.g., PokedexScreen.tsx, AugmentedReality.tsx)
│   └── types/          # TypeScript type definitions
├── assets/             # Static assets like images and icons
├── App.tsx             # Main application component
├── index.js            # Entry point for React Native
├── package.json        # Project dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

(Specify your project's license here, e.g., MIT, Apache 2.0, etc.)
