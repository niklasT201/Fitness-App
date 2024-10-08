/**
 * Stay Strong Fitness App
 * Prototype
 *
 * @format
 */

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, Button, Switch,useColorScheme, View, TouchableWithoutFeedback, TouchableOpacity, Image, Dimensions, BackHandler, Alert, Animated  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './ThemeContext'; 
import RunningScreen from './RunningScreen';
import BikingScreen from './BikingScreen';
import BarcodeScannerScreen from './BarcodeScannerScreen';
import CreatePlanScreen from './CreatePlanScreen';

const { height: screenHeight } = Dimensions.get('window');

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface DayCardProps {
  day: string;
  isCurrentDay: boolean;
  dayNumber: number;
}

function DayCard({ day, dayNumber, isCurrentDay }: DayCardProps): React.JSX.Element {
  return (
    <View style={[styles.dayCard, isCurrentDay && styles.currentDayCard]}>
      <Text style={[styles.dayText, isCurrentDay && styles.currentDayText]}>{day}</Text>
      <Text style={[styles.dayNumberText, isCurrentDay && styles.currentDayText]}>{dayNumber}</Text>
    </View>
  );
}

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

type Exercise = {
  name: string;
  duration: number;
  image?: any; // Use the appropriate type for your image imports
  darkImage?: any;
};
type Activity = {
  title: string;
  icon: string;
  exercises: Exercise[];
};

type Favorite = {
  name: string;
  duration: number;
  image?: any;
  darkImage?: any;
};

type ActivityScreenProps = {
  navigateTo: (screen: string, params?: any) => void;
  updateFavorites: (newFavorites: Favorite[]) => void;
};

function Footer({ navigateTo, currentScreen }: { navigateTo: (screen: string) => void, currentScreen: string }): React.JSX.Element {
  const { isDarkTheme } = useTheme();  // Use the theme context

  const footerBackgroundColor = isDarkTheme ? '#4f308c' : '#388E3C';  // Adjust the background color based on the theme
  const colorSwitch = isDarkTheme ? '#cc5c98' : '#97cf99';  // Adjust the background color based on the theme

  // Check if the current screen is "Calories"
  const isProfileScreen = currentScreen === 'Profile' || currentScreen === 'SettingsScreen';
  const isCaloriesScreen = currentScreen === 'Calories' || currentScreen === 'TotalValues';
  const isHomeScreen = currentScreen === 'Home' || currentScreen === 'CreatePlan';
  const isWorkoutScreen = currentScreen === 'Workouts' || currentScreen === 'WorkoutTimer' || currentScreen === 'Biking' || currentScreen === 'Running' || currentScreen === 'Lifting';

  return (
    <View style={styles.footerContainer}>
      <View style={[styles.footer, { backgroundColor: footerBackgroundColor }]}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigateTo('Home')}>
          <Image source={require('./assets/homeW.png')} style={[styles.footerIcon, isHomeScreen && {tintColor: colorSwitch}]} />
          <Text style={[styles.footerButtonText, isHomeScreen && {color: colorSwitch}]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigateTo('Workouts')}>
          <Image source={require('./assets/workoutW.png')} style={[styles.footerIcon, isWorkoutScreen && {tintColor: colorSwitch}]} />
          <Text style={[styles.footerButtonText, isWorkoutScreen && {color: colorSwitch}]}>Workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigateTo('Calories')}>
          <Image source={require('./assets/fireW.png')} style={[styles.footerIcon, isCaloriesScreen && { tintColor: colorSwitch }]} />
          <Text style={[styles.footerButtonText, isCaloriesScreen && { color: colorSwitch }]}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigateTo('Profile')}>
          <Image source={require('./assets/userW.png')} style={[styles.footerIcon, isProfileScreen && { tintColor: colorSwitch }]} />
          <Text style={[styles.footerButtonText, isProfileScreen && { color: colorSwitch }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


function LoadingScreen(): React.JSX.Element {
  const { isDarkTheme } = useTheme();

  const backgroundColor = isDarkTheme ? '#603ca6' : '#4CAF50';

  return (
    <ScrollView style={[styles.screenContainer, { backgroundColor }]}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
      />
      <View style={styles.loading}>
        <Image source={require('./assets/App-Logo/logo.png')} style={styles.loadingImage} />
      </View>
    </ScrollView>
  );
}

const activities: Activity[] = [
  {
    title: "Upper Body",
    icon: '🏋️‍♂️',
    exercises: [
      /* { name: "Chest", duration: 15 },
      { name: "Back", duration: 20 },
      { name: "Shoulders", duration: 15 },
      { name: "Arms", duration: 10 }, */
      { name: "Chest Press", duration: 15 },
      { name: "Push-Ups", duration: 10 },
      { name: "Lat Pull-Downs", duration: 15 },
      { name: "Rows", duration: 15 },
      { name: "Dumbbell Rowing", duration: 15, image: require('./assets/cards/dumbbell-rowing.png'), darkImage: require('./assets/cards/dumbbell-rowing-purple.png') },
      { name: "Shoulder Press", duration: 12, image: require('./assets/cards/shoulder-press.png'),  darkImage: require('./assets/cards/shoulder-press-purple.png') },
      { name: "Overhead Press", duration: 12, image: require('./assets/cards/overhead-press.png'),  darkImage: require('./assets/cards/overhead-press-purple.png') },
      { name: "Lateral Raises", duration: 10 },
      { name: "Bicep Curls", duration: 10, image: require('./assets/cards/Bizeps-Curls.png'), darkImage: require('./assets/cards/Bizeps-Curls-purple.png') },
      { name: "Bicep Curls with Barbell", duration: 12, image: require('./assets/cards/Bicep-curls-barbell.png'), darkImage: require('./assets/cards/Bicep-curls-barbell-purple.png') },
      { name: "Hammer Curls", duration: 10 },
      { name: "Tricep Extensions", duration: 10 },
      { name: "Dips", duration: 8 },
    ]
  },
  {
    title: "Lower Body",
    icon: '🏋️‍♀️',
    exercises: [
     /*  { name: "Legs", duration: 25 },
      { name: "Glutes", duration: 20 }, */

      { name: "Squats", duration: 15 },
      { name: "Lunges", duration: 12 },
      { name: "Lunges Dumbbell", duration: 12, image: require('./assets/cards/lunges-dumbbell.png'),  darkImage: require('./assets/cards/lunges-dumbbell-purple.png')}, 
      { name: "Leg Press", duration: 15 },
      { name: "Deadlifts", duration: 15 },
      { name: "Calf Raises", duration: 10 },
      { name: "Leg Extensions", duration: 12 },
      { name: "Leg Curls", duration: 12 },
      { name: "Hip Thrusts", duration: 12 },
      { name: "Step-Ups", duration: 10 },
    ]
  },
  {
    title: "Cardio",
    icon: '🏃‍♂️',
    exercises: [
      { name: "Running", duration: 30 },
      { name: "Biking", duration: 25 },

      { name: "Jump Rope", duration: 15 },
      { name: "Swimming", duration: 30 },
      { name: "Rowing", duration: 20 },
      { name: "Stair Climbing", duration: 15 },
      { name: "Elliptical", duration: 25 },
    ]
  },
  {
    title: "Flexibility",
    icon: '🧘‍♀️',
    exercises: [
      { name: "Yoga", duration: 20 },
      { name: "Stretching", duration: 15 },

      { name: "Pilates", duration: 25 },
      { name: "Dynamic Stretching", duration: 10 },
      { name: "Foam Rolling", duration: 10 },
      { name: "Ballet-Inspired Stretches", duration: 15 },
      { name: "Tai Chi", duration: 20 },
    ]
  }
];

function ActivityScreen({ navigateTo, updateFavorites }: ActivityScreenProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(activities);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const { isDarkTheme } = useTheme(); // Use the theme context

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredActivities(activities);
    } else {
      const filtered = activities.map(section => ({
        ...section,
        exercises: section.exercises.filter(exercise => 
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.exercises.length > 0);
      setFilteredActivities(filtered);
    }
  }, [searchQuery]);

  const handleExercisePress = (exerciseName: string, duration: number) => {
    if (exerciseName === "Running") {
      navigateTo('Running');
    } else if (exerciseName === "Biking") {
      navigateTo('Biking');
    }else {
      navigateTo('WorkoutTimer', { exercise: exerciseName, duration });
    }
  };

    const days: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentDate = new Date();
    const currentDay: number = currentDate.getDay();
    // Adjusting for Sunday being 0 in getDay()
    const adjustedCurrentDay: number = currentDay === 0 ? 6 : currentDay - 1;

    // Calculate the day numbers for the week
    const dayNumbers: number[] = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - adjustedCurrentDay + i);
      return date.getDate();
    });

   // Format the date string
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);


    useEffect(() => {
      // Load favorites when component mounts
      loadFavorites();
    }, []);
  
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favoriteExercises');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
  
    const toggleFavorite = async (exerciseName: string, duration: number, image?: any, darkImage?: any) => {
      let newFavorites: Favorite[];
      if (favorites.some(fav => fav.name === exerciseName)) {
        newFavorites = favorites.filter(fav => fav.name !== exerciseName);
      } else {
        newFavorites = [...favorites, { name: exerciseName, duration, image, darkImage }];
      }
      setFavorites(newFavorites);
      try {
        await AsyncStorage.setItem('favoriteExercises', JSON.stringify(newFavorites));
        updateFavorites(newFavorites);
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    };
  
    const favoriteIconColor = isDarkTheme ? '#603ca6' : '#4CAF50';

  return (
    <View style={styles.AscreenContainer}>
       <View style={styles.activityHeader}>
        {showSearch ? (
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search activities..."
              placeholderTextColor="#666"
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                setSearchQuery(text);
              }}
            />
          </View>
        ) : (
          <View style={styles.Aplaceholder} />
        )}
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
          <Image source={require('./assets/search.png')} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.activecards}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScrollView}>
          {days.map((day, index) => (
            <DayCard 
              key={day} 
              day={day} 
              dayNumber={dayNumbers[index]}
              isCurrentDay={index === adjustedCurrentDay} 
            />
          ))}
        </ScrollView>
      </View>
      <ScrollView>
        {filteredActivities.map((section, index) => (
          <View key={index} style={styles.AsectionContainer}>
            <View style={styles.activityContent}>
              <Text style={styles.activityIcon}>{section.icon}</Text>
              <View style={styles.activityTextContainer}>
                <Text style={styles.activityTitle}>{section.title}</Text>
                <Text style={styles.activitySummary}>
                  {section.exercises.length} Exercises · {section.exercises.reduce((acc, exercise) => acc + exercise.duration, 0)} mins
                </Text>
              </View>
            </View>
            {section.exercises.map((exercise, exerciseIndex) => (
              <View key={exerciseIndex} style={styles.exerciseRow}>
                <TouchableOpacity 
                  style={styles.wexerciseCard}
                  onPress={() => handleExercisePress(exercise.name, exercise.duration)}
                >
                  <Text style={styles.exerciseText}>{exercise.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.favoriteButton, {backgroundColor: favoriteIconColor}]}
                  onPress={() => toggleFavorite(exercise.name, exercise.duration, exercise.image, exercise.darkImage)}
                >
                  <Text style={styles.favoriteIcon}>
                    {favorites.some(fav => fav.name === exercise.name) ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
        <View style={styles.placeholder}></View>
      </ScrollView>
    </View>
  );
}

function WorkoutTimerScreen({ route, navigateTo }: { route: { params: { exercise: string, duration: number } }, navigateTo: (screen: string) => void }): React.JSX.Element {
  const { exercise, duration } = route.params;
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const [isActive, setIsActive] = useState(false);
  const { isDarkTheme } = useTheme();  
  const colorSwitch = isDarkTheme ? '#4f308c' : '#388E3C';
  const textSwitch = isDarkTheme ? '#401b5e' : '#1B5E20';
  const buttonSwitch = isDarkTheme ? '#6e45bf' : '#4acf60';

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeLeft / (duration * 60);

  return (
    <View style={styles.wcontainer}>
      <Text style={styles.exerciseTitle}>{exercise}</Text>
      <View style={styles.timerCircle}>
        <View style={[styles.timerProgress, { width: `${progress * 100}%` }]} />
        <Text style={[styles.wtimerText, {color: textSwitch}]}>{formatTime(timeLeft)}</Text>
      </View>
      <View style={styles.wbuttonContainer}>
        <TouchableOpacity style={[styles.timerButton, {backgroundColor: colorSwitch}]} onPress={toggleTimer}>
          <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.resetButton, {backgroundColor: buttonSwitch}]} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => navigateTo('Workouts')}>
        <Text style={styles.backButtonText}>Back to Activities</Text>
      </TouchableOpacity>
    </View>
  );
}

function WelcomeScreen({ onFinish }: { onFinish: () => void }): React.JSX.Element {
  const [name, setName] = useState('');
  const [month, setMonth] = useState('');
  const { isDarkTheme, toggleTheme } = useTheme();
  const colorSwitch = isDarkTheme ? '#603ca6' : '#4CAF50';

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
    <View style={[styles.welcomeContainer, { height: screenHeight, backgroundColor: colorSwitch }]}>
      <StatusBar barStyle="light-content" backgroundColor={colorSwitch} />
      <View style={styles.welcomeContent}>
        <Text style={styles.welcomeText}>Welcome to Stay Strong Fitness!</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
        />
        <Switch
            trackColor={{ false: "#767577", true: '#a13ca6' }}
            thumbColor={isDarkTheme ? "#f4f3f4" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDarkTheme}
          />
        <TouchableOpacity style={styles.saveButton} onPress={handlePress}>
          <Text style={[styles.saveButtonText, {color: colorSwitch}]}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.welcomeImageContainer}>
        <Image source={require('./assets//people/start.png')} style={styles.welcomeImage} />
      </View>
    </View>
  );
}

interface FoodEntry {
  name: string;
  calories: number;
  fat: number;
  sugar: number;
  protein: number;
}

function CaloriesScreen({ navigateTo, dailyValues, setDailyValues, setShowFooter }: { navigateTo: (screen: string) => void, dailyValues: { calories: number; fat: number; sugar: number; protein: number }, setDailyValues: React.Dispatch<React.SetStateAction<{ calories: number; fat: number; sugar: number; protein: number }>>, setShowFooter: (visible: boolean) => void; }): React.JSX.Element {
  const [calories, setCalories] = useState('');
  const [fat, setFat] = useState('');
  const [sugar, setSugar] = useState('');
  const [protein, setProtein] = useState('');
  const [productName, setProductName] = useState('');

  const [showScanner, setShowScanner] = useState(false);

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

  useEffect(() => {
    // Update footer visibility based on the showScanner state
    setShowFooter(!showScanner);

    // Handle the hardware back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showScanner) {
        setShowScanner(false);
        return true;
      }
      return false;
    });

    // Cleanup the event listener on unmount
    return () => backHandler.remove();
  }, [showScanner, setShowFooter]);

  const addValues = async () => {
    const cal = parseFloat(calories) || 0;
    const fatVal = parseFloat(fat) || 0;
    const sugarVal = parseFloat(sugar) || 0;
    const proteinVal = parseFloat(protein) || 0;

     // Check if all fields have valid values
     if (!productName || isNaN(cal) || isNaN(fatVal) || isNaN(sugarVal) || isNaN(proteinVal) ||
      cal <= 0 || fatVal <= 0 || sugarVal <= 0 || proteinVal <= 0) {
      // Show an alert or some feedback to the user
      Alert.alert('Invalid Input', 'Please fill in all fields with valid values greater than 0.');
      return;
    }

    const newEntry: FoodEntry = {
      name: productName,
      calories: cal,
      fat: fatVal,
      sugar: sugarVal,
      protein: proteinVal,
    };

    const updatedValues = {
      calories: dailyValues.calories + cal,
      fat: dailyValues.fat + fatVal,
      sugar: dailyValues.sugar + sugarVal,
      protein: dailyValues.protein + proteinVal,
    };

    setDailyValues(updatedValues);

    // Store the new entry in AsyncStorage
    const entries: FoodEntry[] = JSON.parse(await AsyncStorage.getItem('foodEntries') || '[]');
    entries.push(newEntry);
    await AsyncStorage.setItem('foodEntries', JSON.stringify(entries));

    await AsyncStorage.setItem('dailyValues', JSON.stringify(updatedValues));
    setProductName('');
    setCalories('');
    setFat('');
    setSugar('');
    setProtein('');
};

  const handleBarCodeScanned = (productInfo: {
    productName: string;
    calories: string;
    fat: string;
    sugar: string;
    protein: string;
  }) => {
    setProductName(productInfo.productName);
    setCalories(productInfo.calories);
    setFat(productInfo.fat);
    setSugar(productInfo.sugar);
    setProtein(productInfo.protein);
    setShowScanner(false);
  };

  if (showScanner) {
    return (
      <BarcodeScannerScreen
        onBarCodeScanned={handleBarCodeScanned} // Pass the handler to the scanner screen
        onClose={() => setShowScanner(false)}
      />
    );
  }

  const { isDarkTheme } = useTheme(); // Use the theme context
  const buttonColor = isDarkTheme ? '#603ca6' : '#4CAF50';
  const transButton = isDarkTheme ? 'rgba(96, 60, 166, 0.1)' : 'rgba(76, 175, 80, 0.1)';
  return (
    <ScrollView style={styles.CscreenContainer}>
        <View style={styles.wheaderContainer}>
        <Image source={require('./assets/hearts.png')} style={styles.heartImage} />
        <Text style={styles.headerText}>Track Your Daily Intake</Text>
      </View>
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.calorieInput}
        placeholder="Enter Product Name"
        placeholderTextColor="#666" 
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.calorieInput}
        placeholder="Enter Calories"
        placeholderTextColor="#666"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.calorieInput}
        placeholder="Enter fat (g)"
        placeholderTextColor="#666"
        value={fat}
        onChangeText={setFat}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.calorieInput}
        placeholder="Enter sugar (g)"
        placeholderTextColor="#666"
        value={sugar}
        onChangeText={setSugar}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.calorieInput}
        placeholder="Protein (g)"
        placeholderTextColor="#666"
        value={protein}
        onChangeText={setProtein}
        keyboardType="numeric"
      />
      <TouchableOpacity style={[styles.scanButton, {backgroundColor: transButton}]} onPress={() => setShowScanner(true)}>
        <Text style={[styles.scanButtonText,{color: buttonColor}]}>Scan Barcode</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.calorieSaveButton, {backgroundColor: buttonColor}]} onPress={addValues}>
        <Text style={styles.calorieSaveButtonText}>Add</Text>
      </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.viewTotalButton} onPress={() => navigateTo('TotalValues')}>
        <Text style={[styles.viewTotalButtonText, {color: buttonColor}]}>View Total Values</Text>
      </TouchableOpacity>
      <View style={styles.placeholder}></View>
    </ScrollView>
  );
}

function TotalValuesScreen({ dailyValues }: { dailyValues: { calories: number; fat: number; sugar: number; protein: number } }): React.JSX.Element {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const { isDarkTheme } = useTheme(); // Use the theme context
  const colorSwitch = isDarkTheme ? '#603ca6' : '#4CAF50';
  const cardSwitch = isDarkTheme ? '#f2e8f5' : '#e8f5e9';

  useEffect(() => {
    const loadFoodEntries = async () => {
      const entries: FoodEntry[] = JSON.parse(await AsyncStorage.getItem('foodEntries') || '[]');
      setFoodEntries(entries);
    };
    loadFoodEntries();
  }, []);

  return (
    <ScrollView style={styles.TscreenContainer}>
    <View style={styles.TheaderContainer}>
      <Text style={styles.TheaderText}>Total Values</Text>
    </View>
    <View style={styles.totalValuesContainer}>
      <View style={[styles.valueContainer, {backgroundColor: cardSwitch}]}>
        <Text style={[styles.valueLabel, {color: colorSwitch}]}>Consumed Calories:</Text>
        <Text style={styles.totalValuesText}>{dailyValues.calories} kcal</Text>
      </View>
      <View style={[styles.valueContainer, {backgroundColor: cardSwitch}]}>
        <Text style={[styles.valueLabel, {color: colorSwitch}]}>Consumed Protein:</Text>
        <Text style={styles.totalValuesText}>{dailyValues.protein} g</Text>
      </View>
      <View style={[styles.valueContainer, {backgroundColor: cardSwitch}]}>
        <Text style={[styles.valueLabel, {color: colorSwitch}]}>Consumed Sugar:</Text>
        <Text style={styles.totalValuesText}>{dailyValues.sugar} g</Text>
      </View>
      <View style={[styles.valueContainer, {backgroundColor: cardSwitch}]}>
        <Text style={[styles.valueLabel, {color: colorSwitch}]}>Consumed Fat:</Text>
        <Text style={styles.totalValuesText}>{dailyValues.fat} g</Text>
      </View>
    </View>
    <View style={styles.foodEntriesContainer}>
      <Text style={styles.foodEntriesHeader}>Added Products:</Text>
      {foodEntries.map((entry, index) => (
        <View key={index} style={styles.foodEntry}>
          <Text style={styles.foodEntryName}>{entry.name}</Text>
          <Text style={styles.foodEntryDetails}>
            Calories: {entry.calories}, Fat: {entry.fat}g, Sugar: {entry.sugar}g, Protein: {entry.protein}g
          </Text>
        </View>
      ))}
    </View>
    <View style={styles.Pplaceholder}></View>
  </ScrollView>
);
}


function SettingsScreen({ navigateTo }: { navigateTo: (screen: string) => void }): React.JSX.Element {
  const { isDarkTheme, toggleTheme } = useTheme();
  const colorSwitch = isDarkTheme ? '#603ca6' : '#4CAF50';

  return (
    <ScrollView style={[styles.sscreenContainer, { backgroundColor: colorSwitch }]}>
      <View style={styles.profileHeaderContainer}>
        <Image source={require('./assets/profile.png')} style={styles.profileHeaderImage} />
        <Text style={styles.profileText}>Settings</Text>
      </View>

      {/* App in Progress Section */}
      <View style={styles.settingsCard}>
        <Text style={[styles.settingsHeader, {color: colorSwitch}]}>App in Progress</Text>
        <View style={styles.separator} />
        <Text style={styles.settingsText}>
          This app is still in progress. Design changes, functions, and features may be updated or changed. We appreciate your understanding.
        </Text>
      </View>

      {/* Theme Switch */}
      <View style={styles.settingsCard}>
        <Text style={[styles.settingsHeader, {color: colorSwitch}]}>Theme</Text>
        <View style={styles.separator} />
        <View style={styles.switchContainer}>
          <Text style={styles.settingsText}>Dark Purple & White</Text>
          <Switch
            trackColor={{ false: "#767577", true: colorSwitch }}
            thumbColor={isDarkTheme ? "#f4f3f4" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDarkTheme}
          />
        </View>
      </View>

      {/* Notification Settings */}
      <View style={styles.settingsCard}>
        <Text style={[styles.settingsHeader, {color: colorSwitch}]}>Notifications</Text>
        <View style={styles.separator} />
        <View style={styles.switchContainer}>
          <Text style={styles.settingsText}>Enable Notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#4CAF50" }}
            thumbColor="#f4f3f4"
            ios_backgroundColor="#3e3e3e"
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.settingsText}>Sound</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#4CAF50" }}
            thumbColor="#f4f3f4"
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      </View>

      {/* Language Settings */}
      <View style={styles.settingsCard}>
        <Text style={[styles.settingsHeader, {color: colorSwitch}]}>Language</Text>
        <View style={styles.separator} />
        <TouchableOpacity style={[styles.settingsButton, {backgroundColor: colorSwitch}]}>
          <Text style={styles.settingsButtonText}>Change Language</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.settingsCard}>
        <Text style={[styles.settingsHeader, {color: colorSwitch}]}>About</Text>
        <View style={styles.separator} />
        <Text style={styles.settingsText}>
          Version 1.0.0
        </Text>
        <TouchableOpacity style={[styles.settingsButton, {backgroundColor: colorSwitch}]}>
          <Text style={styles.settingsButtonText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingsButton, {backgroundColor: colorSwitch}]}>
          <Text style={styles.settingsButtonText}>Terms of Service</Text>
        </TouchableOpacity>
      </View>

      {/* Back Button */}
      <View style={styles.profileSettingsContainer}>
        <TouchableOpacity style={[styles.settingsButton, {backgroundColor: colorSwitch}]} onPress={() => navigateTo('Profile')}>
          <Text style={styles.settingsButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.placeholder}></View>
    </ScrollView>
  );
}


function ProfileScreen({ onNameChange, navigateTo, completedWorkouts, completedHours, completeCalories }: { onNameChange: (name: string) => void, navigateTo: (screen: string) => void, completedWorkouts: number, completedHours: number, completeCalories: number, }): React.JSX.Element {
  const [userName, setUserName] = useState<string | null>(null);
  const [joinMonth, setJoinMonth] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const { isDarkTheme } = useTheme(); 
  const buttonColor = isDarkTheme ? '#603ca6' : '#4CAF50';

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
        <Text style={styles.profileText}>My Profile</Text>
      </View>
      
      {/* Profile Details Card */}
      <View style={styles.card}>
        {isEditing ? (
          <TextInput
            style={styles.profileinput}
            placeholder="Enter new name"
            value={newName}
            onChangeText={setNewName}
          />
        ) : (
          <Text style={styles.profileUserName}>{userName}</Text>
        )}
        <Text style={styles.profileDetail}>Joined: {joinMonth} 2024</Text>
        {isEditing ? (
          <TouchableOpacity style={[styles.editProfileButton, {backgroundColor: buttonColor}]} onPress={handleSave}>
            <Text style={styles.editProfileButtonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.editProfileButton, {backgroundColor: buttonColor}]} onPress={() => setIsEditing(true)}>
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Statistics Card */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>Your Statistics</Text>
        <View style={styles.separator} />
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
      
      {/* Settings Card */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>Settings</Text>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.cardItem} onPress={() => navigateTo('SettingsScreen')}>
          <Image source={require('./assets/settings.png')} style={styles.icons} />
          <View>
            <Text style={styles.cardItemTitle}>General Settings</Text>
            <Text style={styles.cardItemDescription}>Customize app preferences</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardItem} onPress={() => navigateTo('Feedback')}>
          <Image source={require('./assets/feedback.png')} style={styles.icons} />
          <View>
            <Text style={styles.cardItemTitle}>Feedback</Text>
            <Text style={styles.cardItemDescription}>Share your thoughts with us</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* About Card */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>About</Text>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.cardItem} onPress={() => navigateTo('AboutUs')}>
          <Image source={require('./assets/about.png')} style={styles.icons} />
          <View>
            <Text style={styles.cardItemTitle}>About Us</Text>
            <Text style={styles.cardItemDescription}>Learn more about our app and team</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardItem} onPress={() => navigateTo('PrivacyPolicy')}>
          <Image source={require('./assets/policy.png')} style={styles.icons} />
          <View>
            <Text style={styles.cardItemTitle}>Privacy Policy</Text>
            <Text style={styles.cardItemDescription}>Read our privacy policy</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.Pplaceholder}></View>
    </ScrollView>
  );
}

function App(): React.JSX.Element {
  const { isDarkTheme } = useTheme(); // Access the theme context
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [currentScreenParams, setCurrentScreenParams] = useState<any>(null);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [joinMonth, setJoinMonth] = useState<string | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [dailyValues, setDailyValues] = useState({ calories: 0, fat: 0, sugar: 0, protein: 0 });
  const [completedHours, setCompletedHours] = useState(0);
  const [completedWorkouts, setCompletedWorkouts] = useState(0);
  const [completeCalories, setCompletedCalories] = useState(0);
  const [showFooter, setShowFooter] = useState(true);
  const backgroundColor = isDarkTheme ? '#603ca6' : '#4CAF50';
  const shadowedColor = isDarkTheme ? '#301e52' : '#265728';
  const workoutColor = isDarkTheme ? '#8a69bf' : '#6ABF69';

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
      switch (currentScreen) {
        case 'TotalValues':
          setCurrentScreen('Calories');
          return true;
        case 'SettingsScreen':
          setCurrentScreen('Profile');
          return true;
        case 'Workouts':
        case 'Calories':
        case 'Profile':
          setCurrentScreen('Home');
          return true;
        case 'Running':
        case 'Biking':
          setCurrentScreen('Workouts');
          return true;
        case 'Home':
          // Allow default behavior (exit app) when on Home screen
          return false;
        default:
          setCurrentScreen('Home');
          return true;
      }
    });

    return () => backHandler.remove(); // Cleanup the event listener on unmount
  }, [currentScreen]);

  const backgroundStyle = {
    backgroundColor: currentScreen === 'BarcodeScanner' 
      ? 'black' 
      : (isDarkTheme ? '#603ca6' : '#4CAF50'), // Adjust for dark or light theme, except for BarcodeScanner
    flex: 1,
  };

  const navigateTo = (screen: string, params?: any) => {
    setCurrentScreen(screen);
    setCurrentScreenParams(params);
    if (screen === 'BarcodeScanner') {
      setShowFooter(false);
    } else {
      setShowFooter(true);
    }
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

  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const updateFavorites = (newFavorites: Favorite[]) => {
    setFavorites(newFavorites);
  };

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const [todayExercises, setTodayExercises] = useState<string[]>([]);

  const loadTodayExercises = async () => {
    try {
      const storedPlan = await AsyncStorage.getItem('weeklyPlan');
      if (storedPlan) {
        const plan = JSON.parse(storedPlan);
        const today = new Date().toLocaleString('en-us', { weekday: 'short' });
  
        // Check what's being retrieved
        console.log("Today's key:", today); 
        
        console.log("Plan data:", plan); // logs the entire stored plan
        
        // Debugging step: check if the day's key is in the plan
        if (plan[today]) {
          setTodayExercises(plan[today]);
        } else {
          console.warn(`No exercises found for ${today}`);
          setTodayExercises([]); // Ensure it's cleared if no exercises are found for today
        }
      } else {
        console.warn('No weekly plan found in storage');
        setTodayExercises([]);
      }
    } catch (error) {
      console.error('Error loading today\'s exercises:', error);
      setTodayExercises([]); // Ensure to handle the state correctly if an error occurs
    }
  };
  
  useEffect(() => {
    loadTodayExercises();
  }, []);
  

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favoriteExercises');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    loadFavorites();
  }, []);

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

  /* const images = {
    running: isDarkTheme ? require('./assets/cards/running-purple.png') : require('./assets/cards/running.png'),
    biking: isDarkTheme ? require('./assets/cards/biking-purple.png') : require('./assets/cards/biking.png'),
  }; */

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Workouts':
        return (
          <ActivityScreen 
            navigateTo={navigateTo} 
            updateFavorites={updateFavorites}
          />
        );
      case 'Lifting':
        return (
          <ActivityScreen 
            navigateTo={navigateTo} 
            updateFavorites={updateFavorites}
          />
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
          <CaloriesScreen
          navigateTo={navigateTo}
          dailyValues={dailyValues}
          setDailyValues={setDailyValues}
          setShowFooter={setShowFooter} // Pass the setShowFooter function
        />
        );
      case 'TotalValues':
        return (
          <TotalValuesScreen dailyValues={dailyValues} />
        );
      case 'WorkoutTimer':
        return (
          <WorkoutTimerScreen route={{ params: currentScreenParams }} navigateTo={navigateTo} />
        );
      case 'Running':
        return (
          <RunningScreen onRunningComplete={handleRunningComplete} />
        );
      case 'Biking':
        return (
          <BikingScreen onRunningComplete={handleBikingComplete} />
        );
      case 'BarcodeScanner': // Add this case to render the BarcodeScannerScreen
        return (
          <BarcodeScannerScreen onBarCodeScanned={() => {}} onClose={() => navigateTo('Home')} />
        );
      case 'CreatePlan':
        return (
          <CreatePlanScreen navigateTo={navigateTo} activities={activities} />
        );
      case 'Home':
      default:
        return (
          <View style={{ ...backgroundStyle, padding: 16, backgroundColor }}>
            <StatusBar
              barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
              backgroundColor={isMenuVisible ? shadowedColor : backgroundColor} // Match the overlay color
            />
            {isMenuVisible && (
              <TouchableWithoutFeedback onPress={toggleMenu}>
                <View style={styles.overlay} />
              </TouchableWithoutFeedback>
            )}
            <View style={styles.headerContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.greetingText}>Hello {userName}!</Text>
                <Text style={styles.readyText}>Ready to workout?</Text>
              </View>
              <TouchableOpacity onPress={toggleMenu}>
                <Image source={require('./assets/profile.png')} style={styles.profilePicture} />
              </TouchableOpacity>
            </View>
            
             {/* Pop-up Menu */}
              {isMenuVisible && (
                <View style={styles.menuContainer}>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => { setIsMenuVisible(false); navigateTo('Profile'); }}
                  >
                    <Text style={styles.menuText}>Go to Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => { setIsMenuVisible(false); navigateTo('CreatePlan'); }}
                  >
                    <Text style={styles.menuText}>Edite Plan</Text>
                  </TouchableOpacity>
                </View>
              )}

            <View style={styles.homeStat}>
              {completedWorkouts > 0 && (
                <View style={styles.statBoxH}>
                  <Image source={require('./assets/run-man.png')} style={styles.statImage1} />
                  <Text style={styles.statValue}>{completedWorkouts}</Text>
                  <Text style={styles.statLabelH}>Workouts</Text>
                </View>
              )}
              {completeCalories > 0 && (
                <View style={styles.statBoxH}>
                  <Image source={require('./assets/heartw.png')} style={styles.statImage1} />
                  <Text style={styles.statValue}>{completeCalories}</Text>
                  <Text style={styles.statLabelH}>Calories</Text>
                </View>
              )}
              {completedHours > 0 && (
                <View style={styles.statBoxH}>
                  <Image source={require('./assets/flame.png')} style={styles.statImage} />
                  <Text style={styles.statValue}>{completedHours}</Text>
                  <Text style={styles.statLabelH}>Hours</Text>
                </View>
              )}
            </View>

            {(favorites.length > 0 || todayExercises.length > 0) && (
            <View style={styles.chooseTrainingContainer}>
              <Text style={styles.chooseTrainingText}>Choose the Session</Text>
            </View>
            )}
            
            {favorites.length > 0 && (
            <View style={styles.favoritesContainer}>
              <Text style={styles.favoritesTitle}>Favorite Workouts</Text>
              {favorites.map((favorite, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.favoriteItem}
                  onPress={() => navigateTo('WorkoutTimer', { exercise: favorite.name, duration: favorite.duration })}
                >
                  {favorite.image ? (
                    <Image 
                      source={isDarkTheme ? favorite.darkImage : favorite.image} 
                      style={styles.favoriteImage} 
                    />
                  ) : (
                    <View style={[styles.favoriteTextContainer, {backgroundColor: workoutColor}]}>
                      <Text style={styles.favoriteText}>{favorite.name}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

           {/* Add the Create Plan Button */}
           {(favorites.length == 0 && todayExercises.length == 0) && (
           <View style={styles.createPlanButtonContainer}>
              <TouchableOpacity 
                style={styles.createPlanButton}
                onPress={() => navigateTo('CreatePlan')}
              >
                <Text style={[styles.createPlanButtonText, {color: backgroundColor}]}>+</Text>
              </TouchableOpacity>
            </View>
             )}

            {todayExercises.length > 0 && (
              <View style={styles.todayPlanContainer}>
                <Text style={styles.todayPlanTitle}>Today's Exercises</Text>
                {todayExercises.map((exercise, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.exerciseItem}
                    onPress={() => navigateTo('WorkoutTimer', { exercise, duration: 30 })}
                  >
                    <Text style={styles.exerciseText}>{exercise}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          
            {/* <TouchableWithoutFeedback onPress={() => navigateTo('Running')}>
              <Image source={images.running} style={styles.workoutImage} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigateTo('Lifting')}>
              <Image source={require('./assets/cards/lifting.png')} style={styles.workoutImage} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigateTo('Biking')}>
              <Image source={images.biking} style={styles.workoutImage} />
            </TouchableWithoutFeedback> */}
            <View style={styles.placeholder}></View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={
          currentScreen === 'BarcodeScanner' || isDarkTheme 
          ? 'light-content' 
          : 'dark-content'
        }
        backgroundColor={
          currentScreen === 'BarcodeScanner' 
          ? 'black' 
          : isDarkTheme 
          ? '#603ca6' 
          : '#4CAF50'
        }
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        {isFirstTime ? <WelcomeScreen onFinish={handleWelcomeFinish} /> : renderScreen()}
      </ScrollView>
      {!isFirstTime && !showSplash && showFooter && !isMenuVisible && <Footer navigateTo={navigateTo} currentScreen={currentScreen}/>}
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
    marginBottom: 20,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '400',
  },
  screenContainer: {
    flex: 1,
  },

//Footer
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

//Loading
  loading: {
    alignItems: 'center', // Center the image horizontally
  },
  loadingImage: {
    width: '70%',
    height: '100%',
    aspectRatio: 1, // Maintain aspect ratio
    resizeMode: 'contain', // Contain within the container
    marginBottom: '40%', // Add some margin below the image
  },

//Welcome 
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

//Home
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
  menuContainer: {
    position: 'absolute',
    top: 85,
    right: 40,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    width: 250,
  },
  menuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 8,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  statBoxH: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '31%',
  },
  statLabelH: {
    fontSize: 16,
    color: '#333',
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
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  daysScrollView: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  dayCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5', // Light gray background for non-current days
  },
  currentDayCard: {
    backgroundColor: 'transparent', // Your theme green for the current day
  },
  dayText: {
    fontSize: 14,
    color: '#333333', // Dark gray for non-current day text
  },
  dayNumberText: {
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#333333', // Dark gray for non-current day number
  },
  currentDayText: {
    color: 'white', // White text for the current day
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
  createPlanButtonContainer: {
    position: 'absolute',
    bottom: 5,    // Position the button 20 units from the bottom
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:10,
},
  createPlanButton: {
    backgroundColor: '#ffffff', // Green color for the button
    width: 250,
    height: 60,
    borderRadius: 30, // Makes the button circular
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,  // Adds shadow to the button
  },
  createPlanButtonText: {
    color: '#4CAF50',  // White color for the plus sign
    fontSize: 40,   // Size of the plus sign
    lineHeight: 45, // Ensures the plus sign is vertically centered
    fontWeight: 'bold',
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 5,
  },
  exerciseName: {
    fontSize: 16,
  },
  todayPlanContainer: {
    marginTop: 20,
  },
  todayPlanTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  workoutImage: {
    width: '125%',
    height: 200,
    marginBottom: -25,
    borderRadius: 15,
    alignSelf: 'center',
    transform: [{ scale: 0.8 }], // Scale down to zoom out
  },
  favoritesContainer: {
    marginTop: 20,
  },
  favoritesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  favoriteItem: {
    marginBottom: 5,
  },
  favoriteImage: {
    width: '125%',
    height: 200,
    marginBottom: -20,
    marginTop: -15,
    borderRadius: 15,
    alignSelf: 'center',
    transform: [{ scale: 0.8 }], // Scale down to zoom out
  },
  favoriteTextContainer: {
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  favoriteText: {
    color: '#fff',
    fontSize: 16,
    /* textAlign: 'center', */ 
  },

//Calories
  CscreenContainer: {
    flex: 1,
    padding: 16,
  },
  wheaderContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heartImage: {
    width: '80%', // Reduce the width of the image
    height: undefined,
    aspectRatio: 1, // Maintain aspect ratio
    resizeMode: 'contain', // Contain within the container
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f5f5f5',
  },
   inputContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  calorieInput: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  scanButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',  // Very light transparent green
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  calorieSaveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  calorieSaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  viewTotalButton: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewTotalButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  foodEntriesContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  foodEntriesHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  foodEntry: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  foodEntryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  foodEntryDetails: {
    fontSize: 14,
    color: '#777',
  },

//Use later
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
  container: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
    margin: 0,
    borderRadius: 16,
  },

//Total Values
  TscreenContainer: {
    flex: 1,
    padding: 16,
  },
  TheaderContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  TheaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  totalValuesContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  valueContainer: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
  },
  valueLabel: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '500',
  },
  totalValuesText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
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

//Running
  runningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

// Profile 
  profileDetailsContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  profileHeaderImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
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
  profileHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  homeStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  editProfileButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 16,
    alignSelf: 'center',
    width: '100%',
  },
  editProfileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    width: '30%',
  },
  statValue: {
    fontSize: 23,
    fontWeight: '600',
    color: '#000',
  },
  statLabel: {
    fontSize: 13,
    color: '#333',
  },
  profileSettingsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#fff',
    marginTop: 25,
  },
  icons: {
    height: 20,
    width: 20,
    marginRight: 20,  // Adds space between icon and text
  },
  profileText: {
    fontSize: 25,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  profileinput: {
    width: '100%',
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: '#000',
  },
  cardContainer: {
    padding: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    margin: 16,
    marginBottom: 1,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
  }, 
  cardSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
  },
  cardItem: {
    marginBottom: 16,
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Vertically align items in the center
  },
  cardItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  cardItemDescription: {
    fontSize: 14,
    color: '#666666',
  },
  profileInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  Pplaceholder: {
    marginTop: 80,
  },

  //Settings
  sscreenContainer: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
 settingsContainer: {
    padding: 16,
  },
  settingsCard: {
    width: '90%',
    marginBottom: 5,
    marginTop: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginLeft: '5%',
  },
  settingsHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  settingsButton: {
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingsEmail: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },

//Activities
  exerciseText: {
    fontSize: 16,
    color: '#000',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  Aplaceholder: {
    flex: 1,
  },
  searchBarContainer: {
    flex: 1,
    marginRight: 10,
  },
  searchBar: {
    backgroundColor: '#ffffff',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#333', // This sets the text color for both placeholder and typed text
  },
  AscreenContainer: {
    flex: 1,
    marginTop: 20,
  },
  AsectionContainer: {
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff', // Card-like appearance
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  activecards: {
    padding: 16,
  },
  activityCard: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  activityImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  activityContent: {
    flexDirection: 'row', // Arrange icon and text in a row
    alignItems: 'center',
    marginBottom: 10,
  },
  activityIcon: {
    fontSize: 30,
    marginRight: 10,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  activitySummary: {
    fontSize: 14,
    color: '#666666',
  },
  wexerciseCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 15,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  favoriteButton: {
    width: 50,
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  placeholder: {
    marginTop: 70,
  },

//Exercises
  wcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  exerciseTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF', // Darker green for the title
    marginBottom: 30,
    textAlign: 'center',
  },
  timerCircle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#FFF', // Lighter green circle
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
  timerProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#66BB6A', // Green progress bar
    height: '100%',
  },
  wtimerText: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#1B5E20', // Dark green text
    zIndex: 1,
  },
  wbuttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  timerButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  resetButton: {
    backgroundColor: '#D32F2F', // Red for the reset button to indicate caution
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 5,
    borderColor: '#FFF',
    borderWidth: 2,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;

// Remove Total Screen
// Add Report Screen and move the total Values to it
// Add Calorie daily statistics
// Adding Pink Mode to Settingsscreen #ff71bd #603ca6
// Improve Create Plan Navbar
// Improve Welcome Screen
// Adding Images to Exercises