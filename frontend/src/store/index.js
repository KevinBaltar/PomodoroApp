//frontend/src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
// Import your reducers here
// Example: import tasksReducer from './tasksSlice';
// Example: import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    // Add your reducers here
    // tasks: tasksReducer,
    // user: userReducer,
    // Placeholder reducer - remove when you add actual reducers
    placeholder: (state = { message: 'Redux store configured!' }) => state,
  },
  // Middleware can be added here, e.g., for async operations or logging
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

