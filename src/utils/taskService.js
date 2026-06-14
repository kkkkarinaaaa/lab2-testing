export function addTask(tasks, title) {
  if (!title || title.trim() === '') {
    throw new Error('Назва завдання обовʼязкова')
  }

  return [
    ...tasks,
    {
      id: Date.now(),
      title: title.trim(),
      completed: false,
    },
  ]
}

export function toggleTask(tasks, id) {
  return tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
}

export function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id)
}

export function filterTasks(tasks, filter) {
  if (filter === 'active') {
    return tasks.filter((task) => !task.completed)
  }

  if (filter === 'completed') {
    return tasks.filter((task) => task.completed)
  }

  return tasks
}

export function getTaskStats(tasks) {
  return {
    total: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    active: tasks.filter((task) => !task.completed).length,
  }
}

export async function saveTask(apiClient, task) {
  const response = await apiClient.post('/tasks', task)
  return response.data
}
