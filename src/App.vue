<script setup>
import { ref, computed } from 'vue'
import { addTask, toggleTask, deleteTask, filterTasks, getTaskStats } from './utils/taskService'

const appStatus = import.meta.env.VITE_APP_STATUS

const tasks = ref([])
const newTask = ref('')
const filter = ref('all')
const error = ref('')

const visibleTasks = computed(() => filterTasks(tasks.value, filter.value))
const stats = computed(() => getTaskStats(tasks.value))

function handleAddTask() {
  error.value = ''

  try {
    tasks.value = addTask(tasks.value, newTask.value)
    newTask.value = ''
  } catch (e) {
    error.value = e.message
  }
}

function handleToggleTask(id) {
  tasks.value = toggleTask(tasks.value, id)
}

function handleDeleteTask(id) {
  tasks.value = deleteTask(tasks.value, id)
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
