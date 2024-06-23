/**
 * Stay Strong Fitness App
 * Prototype
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, Button, useColorScheme, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

function WelcomeScreen({ onFinish }: { onFinish: () => void }): React.JSX.Element {
  const [name, setName] = useState('');

  const handlePress = async () => {
    if (name) {
      await AsyncStorage.setItem('userName', name);
      onFinish();
    }
  };

  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeText}>Welcome! Please enter your name:</Text>
      <TextInput 
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Save" onPress={handlePress} />
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [userName, setUserName] = useState<string | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    const checkUserName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName);
        setIsFirstTime(false);
      }
    };
    checkUserName();
  }, []);

  const backgroundStyle = {
    backgroundColor: '#FAF3E0', // Changed to a light beige color
    flex: 1,
  };

  const navigateTo = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleWelcomeFinish = () => {
    const getUserName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      setUserName(storedName);
    };
    getUserName();
    setIsFirstTime(false);
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
              <View style={styles.textContainer}>
                <Text style={styles.greetingText}>Hello {userName}!</Text>
                <Text style={styles.readyText}>Ready to workout?</Text>
              </View>
              <Image source={require('./assets/profile.jpg')} style={styles.profilePicture} />
            </View>
            <View style={styles.chooseTrainingContainer}>
              <Text style={styles.chooseTrainingText}>Choose the Session</Text>
            </View>
            <View style={styles.workoutCard}>
              <Image source={require('./assets/running.png')} style={styles.workoutImage} />
              <View style={styles.workoutDetails}>
                <Text style={styles.workoutCategorie}>Running</Text>
                <Text style={styles.workoutText}>• Warm-up</Text>
                <Text style={styles.workoutText}>• Interval Training</Text>
                <Text style={styles.workoutText}>• Cool-down</Text>
              </View>
            </View>
            <View style={styles.workoutCard}>
              <Image source={require('./assets/lifting.png')} style={styles.workoutImage} />
              <View style={styles.workoutDetails}>
                <Text style={styles.workoutCategorie}>Lifting</Text>
                <Text style={styles.workoutText}>• Warm-up</Text>
                <Text style={styles.workoutText}>• Strength Training</Text>
                <Text style={styles.workoutText}>• Cool-down</Text>
              </View>
            </View>
            <View style={styles.workoutCard}>
              <Image source={require('./assets/biking.png')} style={styles.workoutImage} />
              <View style={styles.workoutDetails}>
                <Text style={styles.workoutCategorie}>Biking</Text>
                <Text style={styles.workoutText}>• Warm-up</Text>
                <Text style={styles.workoutText}>• Interval Training</Text>
                <Text style={styles.workoutText}>• Cool-down</Text>
              </View>
            </View>
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
        {isFirstTime ? <WelcomeScreen onFinish={handleWelcomeFinish} /> : renderScreen()}
      </ScrollView>
      {!isFirstTime && <Footer navigateTo={navigateTo} />}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  textContainer: {
    flexDirection: 'column',
  },
  greetingText: {
    fontSize: 35,
    fontWeight: '700',
    color: '#4CAF50',
  },
  readyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 10,
  },
  profilePicture: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  chooseTrainingContainer: {
    marginTop: 16,
    width: '80%',
    height: 40, // Reduced height
    marginBottom: 8,
    paddingVertical: 8, // Adjusted vertical padding for proper height
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center', // Center the text vertically
    alignSelf: 'center', // Center the container
  },
  chooseTrainingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  workoutCard: {
    flexDirection: 'row',
    marginVertical: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 15,
    backgroundColor: '#ffffff',
  },
  workoutImage: {
    width: 120,
    height: 190,
    marginRight: 16,
  },
  workoutDetails: {
    justifyContent: 'flex-start', // Align text to the top
    flex: 1,
    paddingTop: 10, // Add padding to move text higher
  },
  workoutText: {
    color: '#000000',
    fontSize: 15,
    marginBottom: 4,
    marginLeft: 10, // Add margin to move text to the right
  },
  workoutCategorie: {
    color: '#000000',
    fontSize: 20,
    marginBottom: 8,
    textDecorationLine: 'underline', // Underline the category text
    marginLeft: 10, // Add margin to move text to the right
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 16,
    color: '#000000',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});

export default App;
