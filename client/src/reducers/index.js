import { combineReducers } from 'redux';

function category(state = [], action) {
    switch (action.type) {
        case 'UPDATE': {
            return [...action.category];
        }
        default:
            return state
    }
}

function user(state = {}, action) {
    switch (action.type) {
        case 'ADD_USER_CRED': {
            return { username: action.username, admin: action.admin };
        }
        case 'REMOVE_USER_CRED': {
            return { username: "", admin: false };
        }
        default:
            return state
    }
}

function notifications(state = {}, action) {
    switch (action.type) {
        case 'SHOW_ALERT': {
            return {
                title: action.title,
                text: action.text,
                active: true,
                level: action.level
            }
        }
        case 'HIDE_ALERT': {
            return {
                active: false
            }
        }
        default:
            return state
    }
}

export default combineReducers({
    category, user, notifications
})
