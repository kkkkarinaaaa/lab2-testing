import { describe, it, expect, vi } from 'vitest'
import {
  addTask,
  toggleTask,
  deleteTask,
  filterTasks,
  getTaskStats,
  saveTask
} from './taskService'

describe('taskService', () => {
  it('додає нове завдання до списку', () => {
    const tasks = []
    const result = addTask(tasks, 'Підготувати лабораторну')

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Підготувати лабораторну')
    expect(result[0].completed).toBe(false)
  })

  it('обрізає зайві пробіли в назві завдання', () => {
    const result = addTask([], '   Купити продукти   ')

    expect(result[0].title).toBe('Купити продукти')
  })

  it('викидає помилку, якщо назва завдання порожня', () => {
    expect(() => addTask([], '')).toThrow('Назва завдання обовʼязкова')
  })

  it('змінює статус виконання вибраного завдання', () => {
    const tasks = [{ id: 1, title: 'Task 1', completed: false }]

    const result = toggleTask(tasks, 1)

    expect(result[0].completed).toBe(true)
  })

  it('видаляє завдання за id', () => {
    const tasks = [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true }
    ]

    const result = deleteTask(tasks, 1)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(2)
  })

  it('фільтрує тільки активні завдання', () => {
    const tasks = [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true }
    ]

    const result = filterTasks(tasks, 'active')

    expect(result).toHaveLength(1)
    expect(result[0].completed).toBe(false)
  })

  it('рахує статистику завдань', () => {
    const tasks = [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true },
      { id: 3, title: 'Task 3', completed: false }
    ]

    const result = getTaskStats(tasks)

    expect(result).toEqual({
      total: 3,
      completed: 1,
      active: 2
    })
  })

  it('використовує mock API-клієнта під час збереження завдання', async () => {
    const mockApiClient = {
      post: vi.fn().mockResolvedValue({
        data: { id: 10, title: 'Mock task', completed: false }
      })
    }

    const task = { title: 'Mock task', completed: false }
    const result = await saveTask(mockApiClient, task)

    expect(mockApiClient.post).toHaveBeenCalledWith('/tasks', task)
    expect(result.id).toBe(10)
    expect(result.title).toBe('Mock task')
  })
})