<script setup>
import { ref, computed, onMounted } from 'vue'
import posthog from 'posthog-js'
import { addTask, toggleTask, deleteTask, filterTasks, getTaskStats } from './utils/taskService'

const appStatus = import.meta.env.VITE_APP_STATUS

const tasks = ref([])
const newTask = ref('')
const filter = ref('all')
const error = ref('')
const showUrgentFilter = ref(false)

onMounted(() => {
  posthog.onFeatureFlags(() => {
    showUrgentFilter.value = posthog.isFeatureEnabled('show-urgent-filter')
    console.log('show-urgent-filter:', showUrgentFilter.value)
  })
})

const visibleTasks = computed(() => filterTasks(tasks.value, filter.value))
const stats = computed(() => getTaskStats(tasks.value))

function handleAddTask() {
  error.value = ''

  try {
    tasks.value = addTask(tasks.value, newTask.value)

    const createdTask = tasks.value[tasks.value.length - 1]

    posthog.capture('task_created', {
      task_id: createdTask.id,
      title_length: createdTask.title.length,
      category: 'task',
      is_authenticated: false,
    })

    newTask.value = ''
  } catch (e) {
    error.value = e.message
  }
}

function handleToggleTask(id) {
  tasks.value = toggleTask(tasks.value, id)

  const task = tasks.value.find((task) => task.id === id)

  if (task && task.completed) {
    posthog.capture('task_completed', {
      task_id: id,
      category: 'task',
      is_authenticated: false,
    })
  }
}

function handleDeleteTask(id) {
  const taskToDelete = tasks.value.find((task) => task.id === id)

  tasks.value = deleteTask(tasks.value, id)

  posthog.capture('task_deleted', {
    task_id: id,
    was_completed: taskToDelete ? taskToDelete.completed : false,
    category: 'task',
    reason: 'user_action',
  })
}
</script>

<template>
  <main class="container">
    <h1>Менеджер завдань</h1>

    <p class="app-status">
      {{ appStatus }}
    </p>

    <section class="form">
      <input v-model="newTask" placeholder="Введіть завдання" aria-label="Введіть завдання" />

      <button @click="handleAddTask">Додати</button>
    </section>

    <p v-if="error" class="error">
      {{ error }}
    </p>

    <section class="filters">
      <button @click="filter = 'all'">Усі</button>
      <button @click="filter = 'active'">Активні</button>
      <button @click="filter = 'completed'">Виконані</button>
      <button v-if="showUrgentFilter" @click="filter = 'urgent'">Термінові</button>
    </section>

    <ul>
      <li v-for="task in visibleTasks" :key="task.id">
        <label>
          <input type="checkbox" :checked="task.completed" @change="handleToggleTask(task.id)" />
          <span :class="{ completed: task.completed }">
            {{ task.title }}
          </span>
        </label>

        <button @click="handleDeleteTask(task.id)">Видалити</button>
      </li>
    </ul>

    <section class="stats">
      <p>Усього: {{ stats.total }}</p>
      <p>Активні: {{ stats.active }}</p>
      <p>Виконані: {{ stats.completed }}</p>
    </section>
  </main>
</template>