// hooks/useAuth.js
import { useReducer } from 'react';

// Определение начального состояния
const initialState = { loggedIn: false };

// Определение редюсера
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, loggedIn: true };
        case 'LOGOUT':
            return { ...state, loggedIn: false };
        default:
            return state;
    }
};

// Пользовательский хук для управления состоянием аутентификации
export const useAuth = () => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    return {
        loggedIn: state.loggedIn,
        login: () => dispatch({ type: 'LOGIN' }),
        logout: () => dispatch({ type: 'LOGOUT' }),
    };
};