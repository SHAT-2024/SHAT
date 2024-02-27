import { actionTypes } from "./actionTypes"

export const setUsername = (username) => {
    return { type: actionTypes.SET_USERNAME, payload: username }
}

export const setEmail = (email) => {
    return { type: actionTypes.SET_EMAIL, payload: email }
}

export const setPassword = (password) => {
    return { type: actionTypes.SET_PASSWORD, payload: password }
}

export const setBio = (bio) => {
    return { type: actionTypes.SET_BIO, payload: bio }
}

export const setLogInStatus = (loggedIn, token, user) => {
    return { type: actionTypes.SET_LOGIN_STATUS, payload: {loggedIn, token, user} }
}

export const setParsedToken = (paredToken) => {
    return { type: actionTypes.SET_PARSED_TOKEN, payload: paredToken }
}

export const setLoggedInUsers = (loggedInUser) => {
    return { type: actionTypes.SET_LOGGEDIN_USER, payload: loggedInUser }
}

export const setUpdatedUser = (UserEdited) => {
    return { type: actionTypes.SET_USERUPDAtED, payload: UserEdited }
}

export const setAvatarInput = (avatarInput) => {
    return { type: actionTypes.SET_AVATAR_INPUT, payload: avatarInput }
}

export const setSelectedUserConversation = (SelectedUserInfo) => {
    return { type: actionTypes.SET_SELECTED_USER_CONVERSATION, payload: SelectedUserInfo }
}

export const setSelectedConversation = (SelectedConversationID) => {
    return { type: actionTypes.SET_SELECTED_CONVERSATION, payload: SelectedConversationID }
}

export const setNewUserConversation = (newUserInfo) => {
    return { type: actionTypes.SET_NEW_USER_CONVERSATION, payload: newUserInfo }
}

export const setNewConversation = (newConversationID) => {
    return { type: actionTypes.SET_New_CONVERSATION, payload: newConversationID }
}