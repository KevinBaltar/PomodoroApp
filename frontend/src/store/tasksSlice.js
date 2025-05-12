//frontend/src/store/tasksSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      // Payload should be the new task object
      state.items.push(action.payload);
    },
    removeTask: (state, action) => {
      // Payload should be the task id
      state.items = state.items.filter(task => task.id !== action.payload);
    },
    toggleTaskCompletion: (state, action) => {
      // Payload should be the task id
      const existingTask = state.items.find(task => task.id === action.payload);
      if (existingTask) {
        existingTask.completed = !existingTask.completed;
      }
    },
    // Example for async thunks (usually defined outside reducers with createAsyncThunk)
    // setTasksLoading: (state) => {
    //   state.status = 'loading';
    // },
    // setTasksSucceeded: (state, action) => {
    //   state.status = 'succeeded';
    //   state.items = action.payload; // Payload should be the array of tasks
    // },
    // setTasksFailed: (state, action) => {
    //   state.status = 'failed';
    //   state.error = action.payload; // Payload should be the error message
    // },
  },
  // Extra reducers for handling actions from createAsyncThunk would go here
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchTasks.pending, (state) => {
  //       state.status = 'loading';
  //     })
  //     .addCase(fetchTasks.fulfilled, (state, action) => {
  //       state.status = 'succeeded';
  //       state.items = action.payload;
  //     })
  //     .addCase(fetchTasks.rejected, (state, action) => {
  //       state.status = 'failed';
  //       state.error = action.error.message;
  //     });
  // },
});

export const { addTask, removeTask, toggleTaskCompletion } = tasksSlice.actions;

// Selector to get all tasks
// export const selectAllTasks = state => state.tasks.items;

// Selector to get task by ID
// export const selectTaskById = (state, taskId) => 
//   state.tasks.items.find(task => task.id === taskId);

export default tasksSlice.reducer;

