/**
 * Stay Strong Fitness App
 * Prototype
 *
 * @format
 */

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, Button, useColorScheme, View, TouchableWithoutFeedback, TouchableOpacity, Image, Dimensions, BackHandler, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: screenHeight } = Dimensions.get('window');

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
        <TouchableOpacity style={styles.footerButton} onPress={() => navigateTo('Calories')}>
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
    <View style={[styles.welcomeContainer, { height: screenHeight }]}>
      <View style={styles.welcomeContent}>
        <Text style={styles.welcomeText}>Welcome! Please enter your name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handlePress}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.welcomeImageContainer}>
        <Image source={require('./assets/start.png')} style={styles.welcomeImage} />
      </View>
    </View>
  );
}

function CaloriesScreen({ navigateTo, dailyValues, setDailyValues }: { navigateTo: (screen: string) => void, dailyValues: { calories: number; fat: number; sugar: number; protein: number }, setDailyValues: React.Dispatch<React.SetStateAction<{ calories: number; fat: number; sugar: number; protein: number }>> }): React.JSX.Element {
  const [calories, setCalories] = useState('');
  const [fat, setFat] = useState('');
  const [sugar, setSugar] = useState('');
  const [protein, setProtein] = useState('');

  useEffect(() => {
    const resetDailyValues = async () => {
      const lastReset = await AsyncStorage.getItem('lastReset');
      const now = new Date();
      if (lastReset) {
        const lastResetDate = new Date(lastReset);
        if (now.getDate() !== lastResetDate.getDate() || now.getMonth() !== lastResetDate.getMonth() || now.getFullYear() !== lastResetDate.getFullYear()) {
          await AsyncStorage.setItem('dailyValues', JSON.stringify({ calories: 0, fat: 0, sugar: 0, protein: 0 }));
          setDailyValues({ calories: 0, fat: 0, sugar: 0, protein: 0 });
          await AsyncStorage.setItem('lastReset', now.toISOString());
        }
      } else {
        await AsyncStorage.setItem('lastReset', now.toISOString());
      }
    };

    const loadDailyValues = async () => {
      const storedValues = await AsyncStorage.getItem('dailyValues');
      if (storedValues) {
        setDailyValues(JSON.parse(storedValues));
      }
    };

    resetDailyValues();
    loadDailyValues();
  }, [setDailyValues]);

  const addValues = async () => {
    const cal = parseInt(calories, 10) || 0;
    const fatVal = parseInt(fat, 10) || 0;
    const sugarVal = parseInt(sugar, 10) || 0;
    const proteinVal = parseInt(protein, 10) || 0;

    const updatedValues = {
      calories: dailyValues.calories + cal,
      fat: dailyValues.fat + fatVal,
      sugar: dailyValues.sugar + sugarVal,
      protein: dailyValues.protein + proteinVal,
    };

    setDailyValues(updatedValues);
    await AsyncStorage.setItem('dailyValues', JSON.stringify(updatedValues));
    setCalories('');
    setFat('');
    setSugar('');
    setProtein('');
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.calorieImageContainer}>
        <Image source={require('./assets/heart.png')} style={styles.heartImage} />
      </View>
      <TextInput
        style={styles.calorieInput}
        placeholder="Enter calories"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.calorieInput}
        placeholder="Enter fat (g)"
        value={fat}
        onChangeText={setFat}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.calorieInput}
        placeholder="Enter sugar (g)"
        value={sugar}
        onChangeText={setSugar}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.calorieInput}
        placeholder="Enter protein (g)"
        value={protein}
        onChangeText={setProtein}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.calorieSaveButton} onPress={addValues}>
        <Text style={styles.calorieSaveButtonText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.viewTotalButton} onPress={() => navigateTo('TotalValues')}>
        <Text style={styles.viewTotalButtonText}>View Total Values</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


function TotalValuesScreen({ dailyValues }: { dailyValues: { calories: number; fat: number; sugar: number; protein: number } }): React.JSX.Element {
  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.totalValuesContainer}>
        <Text style={styles.totalValuesText}>Total Calories: {dailyValues.calories} g</Text>
        <Text style={styles.totalValuesText}>Total Protein: {dailyValues.protein} g</Text>
        <Text style={styles.totalValuesText}>Total Sugar: {dailyValues.sugar} g</Text>
        <Text style={styles.totalValuesText}>Total Fat: {dailyValues.fat} g</Text>
      </View>
    </ScrollView>
  );
}

function RunningScreen(): React.JSX.Element {
  const [seconds, setSeconds] = useState(3600); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      timerRef.current = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [seconds, isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartPress = () => {
    setIsRunning(true);
  };

  return (
    <View style={styles.runningContainer}>
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      {!isRunning && (
        <TouchableOpacity style={styles.startButton} onPress={handleStartPress}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function ProfileScreen(): React.JSX.Element {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadUserName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName);
      }
    };
    loadUserName();
  }, []);

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.profileImageContainer}>
        <Image source={require('./assets/profile.png')} style={styles.profileImage} />
      </View>
      <View style={styles.profileDetailsContainer}>
        <Text style={styles.profileUserName}>{userName}</Text>
        <Text style={styles.profileDetail}>Email: example@example.com</Text>
        <Text style={styles.profileDetail}>Joined: January 2024</Text>
        {/* Add more details as needed */}
      </View>
    </ScrollView>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [userName, setUserName] = useState<string | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [dailyValues, setDailyValues] = useState({ calories: 0, fat: 0, sugar: 0, protein: 0 });

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
    backgroundColor: '#4CAF50', // Changed to green color
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
            <View style={styles.textContainer}>
                <Text style={styles.greetingText}>Workouts</Text>
              </View>
            <TouchableWithoutFeedback onPress={() => navigateTo('Running')}>
              <Image source={require('./assets/running.png')} style={styles.workoutImage} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigateTo('Lifting')}>
              <Image source={require('./assets/lifting.png')} style={styles.workoutImage} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigateTo('Biking')}>
              <Image source={require('./assets/biking.png')} style={styles.workoutImage} />
            </TouchableWithoutFeedback>
          </View>
        );
      case 'Profile':
        return (
          <ProfileScreen />
        );
      case 'Calories':
        return (
          <CaloriesScreen navigateTo={navigateTo} dailyValues={dailyValues} setDailyValues={setDailyValues} />
        );
      case 'TotalValues':
        return (
          <TotalValuesScreen dailyValues={dailyValues} />
        );
        case 'Running':
        return (
          <RunningScreen />
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
              <TouchableWithoutFeedback onPress={() => navigateTo('Profile')}>
                <Image source={require('./assets/profile.png')} style={styles.profilePicture} />
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.chooseTrainingContainer}>
              <Text style={styles.chooseTrainingText}>Choose the Session</Text>
            </View>
            <TouchableWithoutFeedback onPress={() => navigateTo('Running')}>
              <Image source={require('./assets/running.png')} style={styles.workoutImage} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigateTo('Lifting')}>
              <Image source={require('./assets/lifting.png')} style={styles.workoutImage} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigateTo('Biking')}>
              <Image source={require('./assets/biking.png')} style={styles.workoutImage} />
            </TouchableWithoutFeedback>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#4CAF50" // Matching the background color
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
    backgroundColor: '#ffffff', // Changed to beige
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
    backgroundColor: '#388E3C', // Darker green color
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
  welcomeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#4CAF50',
    overflow: 'hidden',
  },
  welcomeContent: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 50,
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
  saveButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 45,
  },
  saveButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  welcomeImageContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  welcomeImage: {
    width: '110%',
    height: 450, // Adjust height as needed
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
    color: '#ffffff', // Changed to beige color
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
    marginBottom: 19,
    marginRight: -25,
  },
  chooseTrainingContainer: {
    marginTop: 16,
    width: '80%',
    height: 40, // Reduced height
    marginBottom: 8,
    paddingVertical: 8, // Adjusted vertical padding for proper height
    borderRadius: 20,
    backgroundColor: '#ffffff', // Changed to beige color
    alignItems: 'center',
    justifyContent: 'center', // Center the text vertically
    alignSelf: 'center', // Center the container
  },
  chooseTrainingText: {
    color: '#000000', // Changed to black color
    fontSize: 16,
    fontWeight: '700',
  },
  workoutImage: {
    width: '125%',
    height: 200,
    marginBottom: -25,
    borderRadius: 15,
    alignSelf: 'center',
    transform: [{ scale: 0.8 }], // Scale down to zoom out
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  calorieInput: {
    width: '80%',
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    alignSelf: 'center', // Center the input fields
  },
  calorieSaveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 5,
    width: '80%',
    backgroundColor: '#ffffff',
    alignSelf: 'center', // Center the button
  },
  calorieSaveButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center', // Center the text within the button
  },
  viewTotalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFA500', // Different color for the view total button
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center', // Center the button
  },
  viewTotalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalValuesContainer: {
    padding: 20,
    borderRadius: 10,
    margin: 10,
  },
  totalValuesText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  calorieImageContainer: {
    alignItems: 'center', // Center the image horizontally
    marginBottom: 20, // Add some margin below the image
  },
  heartImage: {
    width: '70%', // Reduce the width of the image
    height: undefined,
    aspectRatio: 1, // Maintain aspect ratio
    resizeMode: 'contain', // Contain within the container
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: '60%', // Reduce the width of the image
    height: undefined,
    aspectRatio: 1, // Maintain aspect ratio
    resizeMode: 'contain', // Contain within the container
  },
  profileDetailsContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginHorizontal: 20,
  },
  profileUserName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  profileDetail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
  },
  runningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  startButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
