import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function BikingScreen({ onRunningComplete }: { onRunningComplete: () => void }): React.JSX.Element {
    const totalTime = 3600; // Total time in seconds (60 minutes)
    const totalCalories = 300; // Total calories burned in one hour
    const [seconds, setSeconds] = useState(totalTime);
    const [isBiking, setIsBiking] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
  
    useEffect(() => {
      const loadTimerState = async () => {
        const savedSeconds = await AsyncStorage.getItem('bikingTimerSeconds');
        const savedIsRunning = await AsyncStorage.getItem('bikingTimerIsRunning');
        if (savedSeconds !== null) setSeconds(parseInt(savedSeconds, 10));
        if (savedIsRunning !== null) setIsBiking(savedIsRunning === 'true');
      };
  
      loadTimerState();
    }, []);
  
    useEffect(() => {
      if (isBiking && seconds > 0) {
        timerRef.current = setTimeout(() => {
          setSeconds(prevSeconds => {
            const newSeconds = prevSeconds - 1;
            AsyncStorage.setItem('bikingTimerSeconds', newSeconds.toString());
            return newSeconds;
          });
        }, 1000);
      } else if (seconds === 0) {
        setIsBiking(false); // Stop the timer when it reaches zero
        onRunningComplete(); // Notify that running is complete
        setSeconds(totalTime); // Reset the timer to the initial value
      }
  
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [seconds, isBiking]);
  
    const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    };
  
    const handleStartPress = () => {
      if (!isBiking) {
        setIsBiking(true);
        AsyncStorage.setItem('bikingTimerIsRunning', 'true');
      }
    };
  
    const handleStopPress = () => {
      setIsBiking(false);
      AsyncStorage.setItem('bikingTimerIsRunning', 'false');
    };
  
    const handleCancelPress = () => {
      setIsBiking(false);
      setSeconds(totalTime);
      AsyncStorage.setItem('bikingTimerIsRunning', 'false');
      AsyncStorage.setItem('bikingTimerSeconds', totalTime.toString());
    };
  
    const progress = (1 - seconds / totalTime) * 100;
    const calorieProgress = ((totalTime - seconds) / totalTime) * totalCalories;
  
    return (
      <View style={styles.runningContainer}>
        <Image source={require('./assets/cards/biketimer.png')} style={styles.runningImage} />
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: `${progress}%`,
              },
            ]}
          />
          <Text style={styles.progressText}>Progress: {progress.toFixed(0)}%</Text>
        </View>
        <View style={styles.progressCBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: `${(calorieProgress / totalCalories) * 100}%`,
                backgroundColor: 'red', // Different color for the calorie bar
              },
            ]}
          />
          <Text style={styles.progressText}>Calories Burned: {calorieProgress.toFixed(0)}</Text>
        </View>
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
        {!isBiking && (
          <TouchableOpacity style={styles.startButton} onPress={handleStartPress}>
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        )}
        {isBiking && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.stopButton} onPress={handleStopPress}>
              <Image source={require('./assets/Pause-Button.png')} style={styles.stopButtonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPress}>
              <Image source={require('./assets/Cancel-Button.png')} style={styles.cancelButtonImage} />
            </TouchableOpacity>
          </View>
        )}
        {isBiking && (
           <TouchableOpacity style={styles.cancelTButton} onPress={handleCancelPress}>
           <Text style={styles.cancelButtonText}>Cancel</Text>
         </TouchableOpacity>
        )}
      </View>
    );
  }

  const styles = StyleSheet.create({
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
  
  export default BikingScreen;
  