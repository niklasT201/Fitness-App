import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, ScrollView, StyleSheet } from 'react-native';
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

function CreatePlanScreen({ navigateTo, activities }: { navigateTo: (screen: string, params?: any) => void;activities: ActivitySection[];}): React.JSX.Element {
  const [selectedExercises, setSelectedExercises] = useState<{ [key: string]: string[] }>({
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: []
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
      navigateTo('Home');
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  return (
    <View style={styles.planContainer}>
      <Text style={styles.planTitle}>Create Your Weekly Plan</Text>
      {days.map((day) => (
        <View key={day} style={styles.daySection}>
          <Text style={styles.dayTitle}>{day}</Text>
          {activities.map((section: ActivitySection, index: number) => (
            <View key={index} style={styles.activitySection}>
                <Text style={styles.activityTitle}>{section.title}</Text>
                {section.exercises.map((exercise: Exercise, i: number) => (
                <TouchableOpacity
                    key={i}
                    style={styles.exerciseItem}
                    onPress={() => handleExerciseToggle(day, exercise.name)}
                >
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    {selectedExercises[day]?.includes(exercise.name) ? <Text>✓</Text> : null}
                </TouchableOpacity>
                ))}
            </View>
            ))}
        </View>
      ))}
      <Button title="Save Plan" onPress={handleSavePlan} />
    </View>
  );
}

const styles = StyleSheet.create({
      planContainer: {
        padding: 20,
        /* backgroundColor: '#f5f5f5', */
      },
      planTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      daySection: {
        marginBottom: 20,
      },
      dayTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      activitySection: {
        marginBottom: 10,
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
      activityTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
      },
  });

export default CreatePlanScreen;