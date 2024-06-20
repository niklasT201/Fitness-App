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
    backgroundColor: '#f5f5f5', // Changed to a brighter color
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
            <Section title="Welcome to Stay Strong">
              Your journey to a healthier life begins here! Start exploring the app to find workouts, track your progress, and stay motivated.
            </Section>
            <Section title="Workouts">
              Find a variety of workouts tailored to your goals. Whether you're a beginner or an expert, there's something for everyone.
            </Section>
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
        backgroundColor="#f5f5f5" // Matching the footer color
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50', // Primary color
    borderRadius: 20,
    width: '90%',
    height: 80, // Increased height to accommodate icons
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  footerButton: {
    alignItems: 'center',
    padding: 10,
  },
  footerButtonText: {
    fontSize: 16,
    color: '#ffffff', // Secondary color
    marginTop: 5, // Added margin to separate text from icon
  },
  footerIcon: {
    width: 24,
    height: 24,
  },
});

export default App;
