# Nanakshahi Calendar App

A React Native (Expo) mobile application for the Nanakshahi Calendar, featuring date conversion, event tracking, and bilingual support.

## Features

- **Current Date Display**: Shows both Nanakshahi and Gregorian dates on the home screen
- **Monthly Calendar View**: Interactive calendar showing Nanakshahi months (Chet to Phagan)
- **Event Highlighting**: Important Gurpurabs and events are highlighted on calendar days
- **Date Converter**: Convert between Gregorian and Nanakshahi dates
- **Bilingual Support**: English and Punjabi language support using react-i18next
- **Dark Mode**: Toggle between light and dark themes
- **Persistent Settings**: Language and theme preferences are saved using AsyncStorage
- **Event Management**: View and filter events by type (Gurpurab, Holiday, Event)

## Screens

1. **Home Screen**: Displays current dates and today's events
2. **Calendar Screen**: Monthly calendar view with event indicators
3. **Converter Screen**: Date conversion between Gregorian and Nanakshahi
4. **Events Screen**: List of all events with filtering options

## Technology Stack

- React Native (Expo)
- TypeScript
- React Navigation (Bottom Tabs)
- React i18next (Internationalization)
- AsyncStorage (Data Persistence)
- Custom styling with StyleSheet

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nanakshahi-calendar
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Run on your preferred platform:

```bash
# For Android
npm run android

# For iOS
npm run ios

# For Web
npm run web
```

## Project Structure

```
src/
├── components/          # Reusable components
├── contexts/           # React contexts (Theme, Language)
├── data/              # Event data and utilities
├── i18n/              # Internationalization setup
├── navigation/        # Navigation configuration
├── screens/           # Screen components
├── types/             # TypeScript type definitions
└── utils/             # Utility functions (date conversion)
```

## Key Features Implementation

### Date Conversion

The app includes a simplified date conversion system between Gregorian and Nanakshahi calendars. The conversion logic is based on the Nanakshahi calendar rules.

### Event System

Events are stored as dummy data and can be easily extended to integrate with a backend API. Events include:

- Gurpurabs (Guru anniversaries)
- Holidays (Vaisakhi, etc.)
- General events

### Internationalization

The app supports English and Punjabi languages with the ability to switch between them. All text content is externalized and can be easily translated.

### Theme System

Dark and light themes are implemented using React Context. Theme preferences are persisted using AsyncStorage.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Nanakshahi calendar calculations based on Sikh calendar principles
- Event data includes important Sikh religious dates
- UI/UX inspired by modern mobile design patterns
