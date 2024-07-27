/**
 * Stay Strong Fitness App
 * Prototype
 *
 * @format
 */

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, Button, useColorScheme, View, TouchableWithoutFeedback, TouchableOpacity, Image, Dimensions, BackHandler, Alert, Animated  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RunningScreen from './RunningScreen';
import BikingScreen from './BikingScreen';

const { height: screenHeight } = Dimensions.get('window');

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

function LoadingScreen(): React.JSX.Element {
  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.loading}>
        <Image source={require('./assets/logo.png')} style={styles.loadingImage} />
      </View>
    </ScrollView>
  );
}

function ActivityScreen({ navigateTo }: { navigateTo: (screen: string) => void }): React.JSX.Element {
  const activities = [
    { name: 'Cardio', image: require('./assets/running.png') },
    { name: 'Strength Training', image: require('./assets/lifting.png') },
    { name: 'Cycling', image: require('./assets/biking.png') },
    // Add more activities as needed
  ];

  return (
    <ScrollView style={styles.screenContainer}>
      {activities.map((activity, index) => (
        <TouchableWithoutFeedback key={index} onPress={() => navigateTo(activity.name)}>
          <View style={styles.activityCard}>
            <Image source={activity.image} style={styles.activityImage} />
            <Text style={styles.activityText}>{activity.name}</Text>
          </View>
        </TouchableWithoutFeedback>
      ))}
    </ScrollView>
  );
}

function WelcomeScreen({ onFinish }: { onFinish: () => void }): React.JSX.Element {
  const [name, setName] = useState('');
  const [month, setMonth] = useState('');

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    setMonth(months[currentMonth]);
  }, []);

  const handlePress = async () => {
    if (name) {
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('joinMonth', month);
      onFinish();
    }
  };

  return (
    <View style={[styles.welcomeContainer, { height: screenHeight }]}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <View style={styles.welcomeContent}>
        <Text style={styles.welcomeText}>Welcome to Stay Strong Fitness!</Text>
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
        <Image source={require('./assets/hearts.png')} style={styles.heartImage} />
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
      <View style={styles.totalheader}>
        <Text style={styles.totalheaderText}>Total Values</Text>
      </View>
      <View style={styles.totalValuesContainer}>
        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>Consumed Calories:</Text>
          <Text style={styles.totalValuesText}>{dailyValues.calories} g</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>Consumed Protein:</Text>
          <Text style={styles.totalValuesText}>{dailyValues.protein} g</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>Consumed Sugar:</Text>
          <Text style={styles.totalValuesText}>{dailyValues.sugar} g</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>Consumed Fat:</Text>
          <Text style={styles.totalValuesText}>{dailyValues.fat} g</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function SettingsScreen({ navigateTo }: { navigateTo: (screen: string) => void }): React.JSX.Element {
  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.profileHeaderContainer}>
        <Image source={require('./assets/profile.png')} style={styles.profileHeaderImage} />
        <Text style={styles.profileText}>Feedback</Text>
      </View>
      <View style={styles.settingsCard}>
        <Text style={styles.settingsHeader}>App in Progress</Text>
        <Text style={styles.settingsText}>
          This app is still in progress. Design changes, functions, and features may be updated or changed. We appreciate your understanding.
        </Text>
      </View>
      <View style={styles.settingsCard}>
        <Text style={styles.settingsHeader}>Feedback</Text>
        <Text style={styles.settingsText}>
          We value your feedback. Please send any suggestions or issues to:
        </Text>
        <Text style={styles.settingsEmail}>feedback@example.com</Text>
      </View>
      <View style={styles.profileSettingsContainer}>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigateTo('Profile')}>
          <Text style={styles.settingsButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


function ProfileScreen({ onNameChange, navigateTo, completedWorkouts, completedHours, completeCalories }: { onNameChange: (name: string) => void, navigateTo: (screen: string) => void, completedWorkouts: number, completedHours: number, completeCalories: number, }): React.JSX.Element {
  const [userName, setUserName] = useState<string | null>(null);
  const [joinMonth, setJoinMonth] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const loadUserName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName);
        setNewName(storedName);
      }
    };
    loadUserName();
  }, []);

  useEffect(() => {
    const loadJoinMonth = async () => {
      const storedMonth = await AsyncStorage.getItem('joinMonth');
      if (storedMonth) {
        setJoinMonth(storedMonth);
      }
    };
    loadJoinMonth();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem('userName', newName);
    setUserName(newName);
    setIsEditing(false);
    onNameChange(newName); // Update the app state
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.profileHeaderContainer}>
        <Image source={require('./assets/profile.png')} style={styles.profileHeaderImage} />
        <Text style={styles.profileText}>Your Profile</Text>
      </View>
      <View style={styles.profileDetailsContainer}>
        {isEditing ? (
          <TextInput
            style={styles.Profileinput}
            placeholder="Enter new name"
            value={newName}
            onChangeText={setNewName}
          />
        ) : (
          <Text style={styles.profileUserName}>{userName}</Text>
        )}
        {/* <Text style={styles.profileDetail}>Email: example@example.com</Text> */}
        <Text style={styles.profileDetail}>Joined: {joinMonth} 2024</Text>
        {isEditing ? (
          <TouchableOpacity style={styles.editProfileButton} onPress={handleSave}>
            <Text style={styles.editProfileButtonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editProfileButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.profileStatsContainer}>
        <Text style={styles.statsTitle}>Your Statistics</Text>
        <View style={styles.statRow}>
          <View style={styles.statBox}>
          <Text style={styles.statValue}>{completedWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{completeCalories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{completedHours}</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
        </View>
      </View>
      <View style={styles.profileSettingsContainer}>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigateTo('SettingsScreen')}>
          <Text style={styles.settingsButtonText}>Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [joinMonth, setJoinMonth] = useState<string | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [dailyValues, setDailyValues] = useState({ calories: 0, fat: 0, sugar: 0, protein: 0 });
  const [completedHours, setCompletedHours] = useState(0);
  const [completedWorkouts, setCompletedWorkouts] = useState(0);
  const [completeCalories, setCompletedCalories] = useState(0);

  useEffect(() => {
    const checkUserName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      const storedMonth = await AsyncStorage.getItem('joinMonth');
      if (storedName) {
        setUserName(storedName);
        setJoinMonth(storedMonth);
        setIsFirstTime(false);
      }
      setShowSplash(false);
    };

    setTimeout(() => {
      checkUserName();
    }, 2000);

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (currentScreen === 'TotalValues') {
        setCurrentScreen('Calories');
        return true; // Prevent default behavior of closing the app
      } else if (currentScreen === 'SettingsScreen') {
        setCurrentScreen('Profile');
        return true; // Prevent default behavior of closing the app
      } else if (currentScreen !== 'Home') {
        setCurrentScreen('Home');
        return true; // Prevent default behavior of closing the app
      }
      return false; // Allow default behavior to happen if already on the home screen
    });

    return () => backHandler.remove(); // Cleanup the event listener on unmount
  }, [currentScreen]);

  const backgroundStyle = {
    backgroundColor: '#4CAF50', // Changed to green color
    flex: 1,
  };

  const navigateTo = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleWelcomeFinish = async () => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    const storedName = await AsyncStorage.getItem('userName');
    const storedMonth = await AsyncStorage.getItem('joinMonth');
    setUserName(storedName);
    setJoinMonth(storedMonth);
    setIsFirstTime(false);
  };

  const handleNameChange = (name: string) => {
    setUserName(name);
  };

  const handleRunningComplete = async () => {
    const updatedHours = completedHours + 1; // Increment the completed hours by 1
    setCompletedHours(updatedHours);
    await AsyncStorage.setItem('completedHours', updatedHours.toString());
    const updatedWorkouts = completedWorkouts + 1; // Increment the completed workouts by 1
    setCompletedWorkouts(updatedWorkouts);
    await AsyncStorage.setItem('completedWorkouts', updatedWorkouts.toString());
    const updatedCalories = completeCalories + 1000; // Increment the completed workouts by 1
    setCompletedCalories(updatedCalories);
    await AsyncStorage.setItem('completeCalories', updatedCalories.toString());
  };

  const handleBikingComplete = () => {
    setCompletedWorkouts(prev => prev + 1);
    setCompletedHours(prev => prev + 1);
    setCompletedCalories(prev => prev + 300); // Add the calories burned in biking
  };

  useEffect(() => {
    const loadCompletedData = async () => {
      const storedHours = await AsyncStorage.getItem('completedHours');
      const storedWorkouts = await AsyncStorage.getItem('completedWorkouts');
      const storedCalories = await AsyncStorage.getItem('completeCalories');
      if (storedHours) {
        setCompletedHours(parseInt(storedHours, 10));
      }
      if (storedWorkouts) {
        setCompletedWorkouts(parseInt(storedWorkouts, 10));
      }
      if (storedCalories) {
        setCompletedCalories(parseInt(storedCalories, 10));
      }
    };
    loadCompletedData();
  }, []);

  if (showSplash) {
    return <LoadingScreen />;
  }

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
          <ProfileScreen onNameChange={handleNameChange} navigateTo={navigateTo} completedHours={completedHours} completedWorkouts={completedWorkouts} completeCalories={completeCalories} />
        );
      case 'SettingsScreen':
        return (
          <SettingsScreen navigateTo={navigateTo} />
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
          <RunningScreen onRunningComplete={handleRunningComplete} />
        );
      case 'Lifting':
        return (
          <BikingScreen onRunningComplete={handleBikingComplete} />
        );
      case 'Biking':
        return (
          <BikingScreen onRunningComplete={handleBikingComplete} />
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
            <View style={styles.homeStat}>
              {completedWorkouts > 0 && (
                <View style={styles.statBox}>
                  <Image source={require('./assets/run-man.png')} style={styles.statImage1} />
                  <Text style={styles.statValue}>{completedWorkouts}</Text>
                  <Text style={styles.statLabel}>Workouts</Text>
                </View>
              )}
              {completeCalories > 0 && (
                <View style={styles.statBox}>
                  <Image source={require('./assets/heartw.png')} style={styles.statImage1} />
                  <Text style={styles.statValue}>{completeCalories}</Text>
                  <Text style={styles.statLabel}>Calories</Text>
                </View>
              )}
              {completedHours > 0 && (
                <View style={styles.statBox}>
                  <Image source={require('./assets/flame.png')} style={styles.statImage} />
                  <Text style={styles.statValue}>{completedHours}</Text>
                  <Text style={styles.statLabel}>Hours</Text>
                </View>
              )}
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
      {!isFirstTime && !showSplash && <Footer navigateTo={navigateTo} />}
    </SafeAreaView>
  );
};

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
  loading: {
    alignItems: 'center', // Center the image horizontally
  },
  loadingImage: {
    backgroundColor: '#4CAF50',
    width: '100%',
    height: '100%',
    aspectRatio: 1, // Maintain aspect ratio
    resizeMode: 'contain', // Contain within the container
    marginBottom: 90, // Add some margin below the image
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#4CAF50',
    overflow: 'hidden',
  },
  welcomeContent: {
    marginTop: 80,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 36,
    color: '#ffffff',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 25,
  },
  saveButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  welcomeImageContainer: {
    marginTop: 65,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  welcomeImage: {
    borderRadius: 30,
    backgroundColor: '#ffffff',
    width: '110%',
    height: 300, // Adjust height as needed
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
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
    marginRight: -15,
  },
  statImage: {
    width: 35,
    height: 35,
    marginBottom: 10,
    marginTop: 5,
  },
  statImage1: {
    width: 50,
    height: 50,
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
    fontSize: 22,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  calorieImageContainer: {
    alignItems: 'center', // Center the image horizontally
    marginBottom: 10, // Add some margin below the image
  },
  heartImage: {
    width: '80%', // Reduce the width of the image
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
    marginTop: 50,
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
  totalheader: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  totalheaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  valueContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
  },
  valueLabel: {
    fontSize: 18,
    color: '#777',
  },
  runningImage:{
      marginTop: 50,
      width: '90%',
      height: 180,
      borderRadius: 15,
      alignSelf: 'center',
  },
  runtimerContainer:{
    alignItems: 'center', // Center the image horizontally
    marginBottom: 20, // Add some margin below the image
  },
  progressBarContainer: {
    width: '85%',
    height: 32,
    backgroundColor: '#cccccc',
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 40,
  },
  progressCBarContainer: {
    width: '85%',
    height: 32,
    backgroundColor: '#cccccc',
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#44c94a',
  },
  progressText: {
    marginLeft: 10,
    marginTop: 1,
    position: 'absolute',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  stopButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  stopButtonImage: {
    width: 61,
    height: 61,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonImage: {
    width: 60,
    height: 60,
    marginLeft: 5,
  },
  cancelTButton: {
    marginTop: -10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 20,
  },
  profileHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileHeaderImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
  },
  editProfileButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 16,
  },
  editProfileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  profileStatsContainer: {
    padding: 16,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    marginTop: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  homeStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statBox: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '31%',
  },
  statValue: {
    fontSize: 23,
    fontWeight: '600',
    color: '#000',
  },
  statLabel: {
    fontSize: 16,
    color: '#333',
  },
  profileSettingsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#fff',
    marginTop: 25,
  },
  settingsButton: {
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  profileText: {
    fontSize: 30,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  Profileinput:{
      width: '100%',
      height: 40,
      borderColor: '#cccccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 8,
      marginBottom: 16,
      color: '#000',
  },
 settingsContainer: {
    padding: 16,
  },
  settingsCard: {
    width: '90%',
    marginBottom: 3,
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginLeft: 15,
  },
  settingsHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333333',
    marginBottom: 16,
  },
  settingsEmail: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    marginVertical: 5,
  },
  activityImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  activityText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default App;
