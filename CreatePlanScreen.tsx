import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './ThemeContext'; 

interface Exercise {
  name: string;
  duration: number;
}

interface ActivitySection {
  title: string;
  icon: string;
  exercises: Exercise[];
}

function CreatePlanScreen({ 
  navigateTo, 
  activities 
}: { 
  navigateTo: (screen: string, params?: any) => void;
  activities: ActivitySection[];
}): React.JSX.Element {
  const [selectedExercises, setSelectedExercises] = useState<{ [key: string]: string[] }>({
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
  });
  const [visibleDay, setVisibleDay] = useState<string | null>(null);
  const { isDarkTheme } = useTheme();  // Use the theme context
  const colorSwitch =  isDarkTheme ? '#603ca6' : '#4CAF50';
  const transButton = isDarkTheme ? '#ece0f2' : '#e0f2e0';

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    loadExistingPlan();
  }, []);

  const loadExistingPlan = async () => {
    try {
      const storedPlan = await AsyncStorage.getItem('weeklyPlan');
      if (storedPlan) {
        setSelectedExercises(JSON.parse(storedPlan));
      }
    } catch (error) {
      console.error('Error loading existing plan:', error);
    }
  };

  const handleExerciseToggle = (day: string, exercise: string) => {
    setSelectedExercises(prev => {
      const dayExercises = prev[day] || [];
      if (dayExercises.includes(exercise)) {
        return { ...prev, [day]: dayExercises.filter(e => e !== exercise) };
      } else {
        return { ...prev, [day]: [...dayExercises, exercise] };
      }
    });
  };

  const handleSavePlan = async () => {
    try {
      await AsyncStorage.setItem('weeklyPlan', JSON.stringify(selectedExercises));
      Alert.alert('Success', 'Plan saved successfully!');
      navigateTo('Home');
    } catch (error) {
      console.error('Error saving plan:', error);
      Alert.alert('Error', 'Failed to save plan. Please try again.');
    }
  };

  const toggleDayVisibility = (day: string) => {
    setVisibleDay(prev => (prev === day ? null : day));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Your Weekly Plan</Text>
      <ScrollView horizontal style={styles.daysContainer} showsHorizontalScrollIndicator={false}>
        {days.map((day, index) => (
          <TouchableOpacity 
            key={day} 
            style={[
              styles.dayButton, 
              visibleDay === day && styles.activeDayButton,
              index === days.length - 1 && styles.lastDayButton // Special styling for Sunday
            ]} 
            onPress={() => toggleDayVisibility(day)}
          >
            <Text style={styles.dayText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView style={styles.scrollView}>
        {visibleDay && (
          <View style={styles.exerciseList}>
            {activities.map((section: ActivitySection, index: number) => (
              <View key={index} style={styles.activitySection}>
                <Text style={styles.activityTitle}>{section.icon} {section.title}</Text>
                {section.exercises.map((exercise: Exercise, i: number) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.exerciseItem,
                      selectedExercises[visibleDay]?.includes(exercise.name) && [styles.selectedExercise, {backgroundColor: transButton}]
                    ]}
                    onPress={() => handleExerciseToggle(visibleDay, exercise.name)}
                  >
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    {selectedExercises[visibleDay]?.includes(exercise.name) && (
                      <Text style={[styles.checkmark, {color: colorSwitch}]}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={handleSavePlan}>
        <Text style={[styles.saveButtonText, {color: colorSwitch}]}>Save Plan</Text>
      </TouchableOpacity>
      <View style={styles.placeholder}></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    color: '#f5f5f5',
  },
  daysContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 15, // Adding padding to align with lists
  },
  dayButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    marginRight: 10, // Spacing between day buttons
    minWidth: 80, // Minimum width to prevent squishing
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDayButton: {
    backgroundColor: 'transparent',
  },
  lastDayButton: {
    marginRight: 30, // No margin on the last day button (Sunday)
    paddingRight: 15, // Add padding to the right side for spacing
  },
  dayText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  exerciseList: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  activitySection: {
    marginBottom: 15,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedExercise: {
    backgroundColor: '#e0f2e0',
  },
  exerciseName: {
    fontSize: 16,
    color: '#333',
  },
  checkmark: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
    margin: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    marginTop: 70,
  },
});

export default CreatePlanScreen;
