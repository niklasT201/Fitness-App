/**
 * Stay Strong Fitness App
 * Prototype
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, TouchableOpacity, Image } from 'react-native';

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? '#000000' : '#000000', // Changed to black
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? '#333333' : '#333333', // Changed to darker grey
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function Footer({ navigateTo }: { navigateTo: (screen: string) => void }): React.JSX.Element {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigateTo('Home')}>
          <Image source={require('./assets/homeW.png')} style={styles.footerIcon} />
          <Text style={styles.footerButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigateTo('Workouts')}>
          <Image source={require('./assets/workoutW.png')} style={styles.footerIcon} />
          <Text style={styles.footerButtonText}>Workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigateTo('Profile')}>
          <Image source={require('./assets/fireW.png')} style={styles.footerIcon} />
          <Text style={styles.footerButtonText}>Calories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigateTo('Profile')}>
          <Image source={require('./assets/userW.png')} style={styles.footerIcon} />
          <Text style={styles.footerButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: '#FAF3E0', // Changed to a light beige color
    flex: 1,
  };

  const [currentScreen, setCurrentScreen] = React.useState('Home');

  const navigateTo = (screen: string) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Workouts':
        return (
          <View style={{ ...backgroundStyle, padding: 16 }}>
            <Section title="Workouts">
              Here you can find various workouts tailored to your fitness goals.
            </Section>
          </View>
        );
      case 'Profile':
        return (
          <View style={{ ...backgroundStyle, padding: 16 }}>
            <Section title="Profile">
              This is your profile. View and edit your personal information and track your progress.
            </Section>
          </View>
        );
      case 'Home':
      default:
        return (
          <View style={{ ...backgroundStyle, padding: 16 }}>
            <View style={styles.headerContainer}>
              <Text style={styles.greetingText}>Hello personxy</Text>
              <Text style={styles.readyText}>Are you ready to workout?</Text>
              <Image source={require('./assets/profile.jpg')} style={styles.profilePicture} />
            </View>
            <View style={styles.workoutCard}>
              <Image source={require('./assets/running.png')} style={styles.workoutImage} />
              <View style={styles.workoutDetails}>
                <Text>Running</Text>
                <Text>• Warm-up</Text>
                <Text>• Interval Training</Text>
                <Text>• Cool-down</Text>
              </View>
            </View>
            <View style={styles.workoutCard}>
              <Image source={require('./assets/lifting.png')} style={styles.workoutImage} />
              <View style={styles.workoutDetails}>
                <Text>Lifting</Text>
                <Text>• Warm-up</Text>
                <Text>• Strength Training</Text>
                <Text>• Cool-down</Text>
              </View>
            </View>
            <Section title="Track Progress">
              Keep track of your progress with our easy-to-use tracking tools. Set goals, monitor your performance, and celebrate your achievements.
            </Section>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#FAF3E0" // Matching the background color
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {renderScreen()}
      </ScrollView>
      <Footer navigateTo={navigateTo} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#cccccc', // Changed to light grey
    borderRadius: 8,
    backgroundColor: '#ffffff', // Changed to white
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '400',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 5, // Reduced padding to make footer shorter
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50', // Primary color
    borderRadius: 20,
    width: '90%',
    height: 60, // Reduced height
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  footerButton: {
    alignItems: 'center',
    padding: 5, // Reduced padding for the button
  },
  footerButtonText: {
    fontSize: 13, // Reduced font size
    color: '#ffffff', // Secondary color
    marginTop: 2, // Adjusted margin to separate text from icon
  },
  footerIcon: {
    width: 24,
    height: 24,
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '500',
  },
  readyText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  profilePicture: {
    width: 90,
    height: 90,
    borderRadius: 35,
  },
  workoutCard: {
    flexDirection: 'row',
    marginVertical: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  workoutImage: {
    width: 120,
    height: 170,
    marginRight: 16,
  },
  workoutDetails: {
    justifyContent: 'center',
  },
});

export default App;
