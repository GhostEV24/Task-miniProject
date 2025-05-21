const API_URL = 'http://192.168.28.22:3000/api/tasks';

export async function fetchTasks(after?: string) {
  const url = after ? `${API_URL}?after=${encodeURIComponent(after)}` : API_URL;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des tâches');
  }
  const data = await response.json();
  return data;
}
