import React, { useRef } from 'react';
import { Animated, FlatList, View } from 'react-native';
import TaskItem from './TaskItem';

type Task = { id: string; title: string; status: string };

export default function TaskListScreen() {
  const tasks: Task[] = [
    { id: '1', title: 'Faire les courses', status: 'todo' },
    { id: '2', title: 'Envoyer un email', status: 'done' },
  ];

  // Garde un dictionnaire de Animated.Value pour chaque tâche
  const animations = useRef<Record<string, Animated.Value>>({});

  // Crée une animation si elle n'existe pas encore pour cette tâche
  const getAnimation = (id: string) => {
    if (!animations.current[id]) {
      animations.current[id] = new Animated.Value(0);
      Animated.timing(animations.current[id], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
    return animations.current[id];
  };

  return (
    <View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} animation={getAnimation(item.id)} />
        )}
      />
    </View>
  );
}
