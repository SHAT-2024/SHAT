import { actionTypes } from "./actionTypes";

export const initialState = {
    usernameForm: '',
    emailForm: '',
    passwordForm: '',
    bioForm: '',
    logInStatus: {
        loggedIn: false,
        token: null,
        user: {}
    },
    parsedToken: {},
    loggedInUSer:{},
    userUpdated: false,
    avatarInput: 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg',
    selectedUserConversation: {},
    selectedConversation: 0,
    newUserConversation: {},
    newConversation: 0,

}

export const reducer = (state = initialState, action) => {
    const {type, payload} = action;
    
    switch(type){
        case actionTypes.SET_USERNAME :
            return {
                ...state, usernameForm: payload
            }
        case actionTypes.SET_EMAIL :
            return {
                ...state, emailForm: payload
            }
        case actionTypes.SET_PASSWORD :
            return {
                ...state, passwordForm: payload
            }
        case actionTypes.SET_BIO :
            return {
                ...state, bioForm: payload
            }
        case actionTypes.SET_LOGIN_STATUS :
            return {
                ...state,
                logInStatus: {
                    ...state.logInStatus,
                    loggedIn: payload.loggedIn,
                    token: payload.token,
                    user: payload.user
                }
            };
        case actionTypes.SET_PARSED_TOKEN :
            return {
                ...state,
                parsedToken: payload
            };
        case actionTypes.SET_LOGGEDIN_USER :
            return {
                ...state,
                loggedInUSer: payload
            };        
        case actionTypes.SET_USERUPDAtED :
            return {
                ...state, userUpdated : payload
            }
        case actionTypes.SET_AVATAR_INPUT :
            return {
                ...state, avatarInput : payload
            }
        case actionTypes.SET_SELECTED_USER_CONVERSATION :
            return {
                ...state, selectedUserConversation : payload
            }    
        case actionTypes.SET_SELECTED_CONVERSATION :
            return {
                ...state, selectedConversation : payload
            }
        case actionTypes.SET_NEW_USER_CONVERSATION :
            return {
                ...state, newUserConversation : payload
            }    
        case actionTypes.SET_New_CONVERSATION :
            return {
                ...state, newConversation : payload
            }
    
        default: return state;
    }
}

