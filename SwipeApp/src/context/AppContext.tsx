import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, CurrentUser, mockUsers, currentUserMock } from '../data/mockData';
import { CalendarEvent } from '../components/Calendar';

interface AppState {
  currentUser: CurrentUser | null;
  users: User[];
  matches: string[];
  calendarEvents: CalendarEvent[];
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
}

type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: CurrentUser }
  | { type: 'UPDATE_CURRENT_USER'; payload: Partial<CurrentUser> }
  | { type: 'ADD_MATCH'; payload: string }
  | { type: 'REMOVE_USER'; payload: string }
  | { type: 'ADD_CALENDAR_EVENT'; payload: CalendarEvent }
  | { type: 'REMOVE_CALENDAR_EVENT'; payload: string }
  | { type: 'UPDATE_CALENDAR_EVENT'; payload: { id: string; updates: Partial<CalendarEvent> } }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'LOGOUT' };

// Примеры событий календаря для демонстрации
const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Кофе с Анной',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // через 2 дня
    time: '18:00',
    type: 'date',
    description: 'Встреча в кафе "Центральное"',
  },
  {
    id: '2',
    title: 'Встреча с друзьями',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // через 5 дней
    time: '20:00',
    type: 'meeting',
    description: 'Вечеринка у Максима',
  },
  {
    id: '3',
    title: 'Напоминание: обновить фото',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // завтра
    time: '12:00',
    type: 'reminder',
    description: 'Добавить новые фотографии в профиль',
  },
];

const initialState: AppState = {
  currentUser: null,
  users: mockUsers,
  matches: [],
  calendarEvents: mockCalendarEvents,
  isAuthenticated: false,
  onboardingCompleted: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
      };
    
    case 'UPDATE_CURRENT_USER':
      return {
        ...state,
        currentUser: state.currentUser ? { ...state.currentUser, ...action.payload } : null,
      };
    
    case 'ADD_MATCH':
      return {
        ...state,
        matches: [...state.matches, action.payload],
      };
    
    case 'REMOVE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      };
    
    case 'ADD_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: [...state.calendarEvents, action.payload],
      };
    
    case 'REMOVE_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: state.calendarEvents.filter(event => event.id !== action.payload),
      };
    
    case 'UPDATE_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: state.calendarEvents.map(event => 
          event.id === action.payload.id 
            ? { ...event, ...action.payload.updates }
            : event
        ),
      };
    
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        onboardingCompleted: true,
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        users: mockUsers, // Reset users
      };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  login: (phoneNumber: string) => void;
  updateProfile: (updates: Partial<CurrentUser>) => void;
  swipeRight: (userId: string) => void;
  swipeLeft: (userId: string) => void;
  addCalendarEvent: (event: CalendarEvent) => void;
  removeCalendarEvent: (eventId: string) => void;
  updateCalendarEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = (phoneNumber: string) => {
    // Simulate login - in real app this would be API call
    const user = { ...currentUserMock, phoneNumber };
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
  };

  const updateProfile = (updates: Partial<CurrentUser>) => {
    dispatch({ type: 'UPDATE_CURRENT_USER', payload: updates });
  };

  const swipeRight = (userId: string) => {
    // Simulate match (50% chance for demo)
    const isMatch = Math.random() > 0.5;
    if (isMatch) {
      dispatch({ type: 'ADD_MATCH', payload: userId });
    }
    dispatch({ type: 'REMOVE_USER', payload: userId });
  };

  const swipeLeft = (userId: string) => {
    dispatch({ type: 'REMOVE_USER', payload: userId });
  };

  const addCalendarEvent = (event: CalendarEvent) => {
    dispatch({ type: 'ADD_CALENDAR_EVENT', payload: event });
  };

  const removeCalendarEvent = (eventId: string) => {
    dispatch({ type: 'REMOVE_CALENDAR_EVENT', payload: eventId });
  };

  const updateCalendarEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    dispatch({ type: 'UPDATE_CALENDAR_EVENT', payload: { id: eventId, updates } });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const value: AppContextType = {
    state,
    dispatch,
    login,
    updateProfile,
    swipeRight,
    swipeLeft,
    addCalendarEvent,
    removeCalendarEvent,
    updateCalendarEvent,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
