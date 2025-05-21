import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Button,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchTasks } from '../../services/taskServices';

type Task = { id: string; title: string; status: string; createdAt: string };

const statusColors: Record<string, string> = {
  todo: '#999',
  in_progress: '#07f',
  done: '#2a4',
};

function TaskItem({ task, animation }: { task: Task; animation: Animated.Value }) {
  return (
    <Animated.View
      style={[
        styles.itemContainer,
        {
          backgroundColor: statusColors[task.status] ?? '#eee',
          opacity: animation,
        },
      ]}
    >
      <Text style={styles.itemTitle}>{task.title}</Text>
      <Text style={styles.itemStatus}>{task.status}</Text>
    </Animated.View>
  );
}

export default function TaskListScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const lastFetch = useRef<string | null>(null);
  const animations = useRef<Record<string, Animated.Value>>({});
  const loadingRef = useRef(false);

  const animateTask = (id: string) => {
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

  const loadTasks = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      console.log('Chargement des tâches, lastFetch:', lastFetch.current);
      const newTasks: Task[] = await fetchTasks(lastFetch.current ?? undefined);
      console.log('Tâches reçues:', newTasks.map(t => t.id));

      if (newTasks.length > 0) {
        // Calculer la date max des nouvelles tâches
        const maxDate = newTasks.reduce((max, task) => {
          const taskTime = new Date(task.createdAt).getTime();
          return taskTime > max ? taskTime : max;
        }, lastFetch.current ? new Date(lastFetch.current).getTime() : 0);

        lastFetch.current = new Date(maxDate).toISOString();
        console.log('Mise à jour lastFetch à', lastFetch.current);

        setTasks(old => {
          const existingIds = new Set(old.map(t => t.id));
          const filtered = newTasks.filter(t => !existingIds.has(t.id));
          filtered.forEach(t => animateTask(t.id));
          const combined = [...filtered, ...old];
          combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          const limited = combined.slice(0, 20);
          console.log('Tâches après fusion et tri (max 20):', limited.map(t => t.id));
          return limited;
        });
      } else {
        console.log('Aucune nouvelle tâche.');
      }
    } catch (e) {
      console.error('Erreur chargement tâches:', e);
    }
    setLoading(false);
    loadingRef.current = false;
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    const interval = setInterval(loadTasks, 5000);
    return () => clearInterval(interval);
  }, [loadTasks]);

  const simulateAdd = async () => {
    if (simulating) return;
    setSimulating(true);
    try {
      const response = await fetch('http://192.168.28.22:3000/api/simulate', { method: 'POST' });
      if (response.status === 202) {
        const data = await response.json();
        alert(data.message);
        lastFetch.current = null;
        setTasks([]);
        await loadTasks();
      } else if (response.status === 409) {
        const data = await response.json();
        alert(data.message);
      } else {
        alert('Erreur inconnue lors de la simulation');
      }
    } catch (e) {
      alert('Erreur réseau ou serveur');
      console.error('Erreur simulate:', e);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Simuler des ajouts" onPress={simulateAdd} disabled={loading || simulating} />
      {(loading || simulating) && <ActivityIndicator style={{ margin: 8 }} />}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} animation={animateTask(item.id)} />
        )}
        contentContainerStyle={{ paddingVertical: 12 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadTasks} />}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Aucune tâche</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  itemContainer: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  itemStatus: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
  },
});
