<span style="font-size: 2em; font-family: 'JetBrains Mono', monospace;">
  <h1 align="center">Meowtracks</h1>
</span>

📜 Description
Meowtracks is een slimme GPS- en bewegingsmonitor voor katten, ontworpen om real-time locatiegegevens, activiteitsniveaus en afwijkende bewegingspatronen bij te houden. Het systeem stuurt data van een ESP32-gebaseerde T-Beam rechtstreeks via WiFi naar een Node.js-backend met MongoDB-opslag. Zo kunnen kattenbaasjes op tijd gewaarschuwd worden voor mogelijke gezondheidsrisico’s of gevaarlijke situaties.

⚙️ Core features
🐾 Real-time locatiebepaling via GNSS

📊 Activiteitstracking met behulp van een versnellingssensor (MPU)

⚠️ Analyse van afwijkende bewegingspatronen

🌐 Directe dataoverdracht via WiFi (zonder LoRa)

📡 Visualisatie via een mobiele app/webinterface

🐈 Gebruiksvriendelijke en kattenvriendelijke hardwarebehuizing

📦 Tech stack
Hardware: LilyGO T-Beam v1.2 (ESP32 + GNSS + MPU6050)

Backend: Node.js + Express

Database: MongoDB (cloud)

Frontend: React Native (voor mobiele interface)

Protocol: HTTP over WiFi

📂 Folder structure
bash
Kopiëren
Bewerken
/meowtracks
│
├── /backend # Node.js server
│ ├── routes # API endpoints
│ ├── models # Mongoose models
│ └── controllers # Logic handlers
│
├── /firmware # Arduino/ESP32 firmware for the T-Beam
│
├── /mobile-app # React Native frontend
│
├── /docs # Handleiding, documentatie en presentaties
│
└── README.md # Projectbeschrijving
🔧 Installation

1. ESP32 Firmware
   Installeer Arduino IDE

Voeg de ESP32 board manager toe via de board URL

Flash de firmware op de T-Beam met juiste WiFi- en endpointconfiguratie

2. Backend (Node.js)
   bash
   Kopiëren
   Bewerken
   cd backend
   npm install
   npm run dev
   Zorg ervoor dat .env een geldige MongoDB URI bevat.

3. Mobiele app
   bash
   Kopiëren
   Bewerken
   cd mobile-app
   npm install
   npx expo start
   📸 Screenshots and media
   Voeg hier mockups, video’s of foto’s toe van het systeem in werking, eventueel met GIF's of Figma-previews.

📚 Resources
AsyncStorage in React Native
Officiële doc:
https://react-native-async-storage.github.io/async-storage/docs/install/

AsyncStorage basics & best practices (medium artikel):
https://medium.com/react-native-training/react-native-asyncstorage-2021-33a781550601

React Native Image Picker (expo-image-picker)
Expo docs over Image Picker:
https://docs.expo.dev/versions/latest/sdk/imagepicker/

React Navigation - useFocusEffect
useFocusEffect hook om actie te triggeren als screen in focus komt:
https://reactnavigation.org/docs/use-focus-effect/

Uitleg en voorbeeld:
https://reactnavigation.org/docs/use-focus-effect/#example

React Native state management tips
Hoe je component state kan syncen met AsyncStorage en updates kan doorvoeren:
https://reactnative.dev/docs/state

Patterns voor state synchronisatie:
https://reactjs.org/docs/hooks-effect.html

React Native Maps & Markers
react-native-maps documentatie:
https://github.com/react-native-maps/react-native-maps

Gebruik van Marker met custom images:
https://github.com/react-native-maps/react-native-maps/blob/master/docs/marker.md#custom-markers

React Native UI en styling tips
Styling en positionering (flexbox en absolute positioning):
https://reactnative.dev/docs/layout-props

🧑‍💻 Authors
Mikolaj Buelens
Rowan Biets
