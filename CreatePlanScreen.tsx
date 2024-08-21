import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Your Weekly Plan</Text>
      <ScrollView style={styles.scrollView}>
        {days.map((day) => (
          <View key={day} style={styles.daySection}>
            <Text style={styles.dayTitle}>{day}</Text>
            {activities.map((section: ActivitySection, index: number) => (
              <View key={index} style={styles.activitySection}>
                <Text style={styles.activityTitle}>{section.icon} {section.title}</Text>
                {section.exercises.map((exercise: Exercise, i: number) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.exerciseItem,
                      selectedExercises[day]?.includes(exercise.name) && styles.selectedExercise
                    ]}
                    onPress={() => handleExerciseToggle(day, exercise.name)}
                  >
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    {selectedExercises[day]?.includes(exercise.name) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.saveButton} onPress={handleSavePlan}>
        <Text style={styles.saveButtonText}>Save Plan</Text>
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
  scrollView: {
    flex: 1,
  },
  daySection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
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
