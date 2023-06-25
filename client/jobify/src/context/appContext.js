import React, {useReducer, useContext} from 'react'
import reducer from './reducer'
import { DISPLAY_ALERT , CLEAR_ALERT, REGISTER_USER_BEGIN, REGISTER_USER_SUCCESS, REGISTER_USER_ERROR
,LOGIN_USER_BEGIN, LOGIN_USER_SUCCESS, LOGIN_USER_ERROR, LOGOUT_USER, TOGGLE_SIDEBAR, UPDATE_USER_BEGIN
, UPDATE_USER_SUCCESS, UPDATE_USER_ERROR, HANDLE_CHANGE, CLEAR_VALUES, CREATE_JOB_BEGIN, CREATE_JOB_SUCCESS, CREATE_JOB_ERROR
} from "./action"
import axios from 'axios'

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const location = localStorage.getItem('location')

const initialState = {
    //user related
    isLoading:false,
    showAlert:false,
    alertText:'',
    alertType:'',
    user: user ? JSON.parse(user) : null,
    token: token,
    userLocation: location || '',
    jobLocation: location || '',
    showSidebar: false,
    //job related
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: 'full-time',
    statusOptions: ['pending', 'interview', 'declined'],
    status: 'pending',
}

const AppContext = React.createContext()

const AppProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const displayAlert = () => {
        dispatch({type:DISPLAY_ALERT})
        clearAlert()
    }

    const clearAlert = () => {
        setTimeout(()=>{
            dispatch({type:CLEAR_ALERT})
        },3000)
    }

    const addUserToLocalStorage = ({user, token, location}) => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('location', location)
    }

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('location')
    }

    const registerUser = async (currentUser) => {
        dispatch({type:REGISTER_USER_BEGIN})
        
        try {
            const response = await axios.post('/api/v1/auth/register',  currentUser);
            
            //console.log(response)
            
            const {user, token, location} = response.data

            //console.log(user)
            
            dispatch({type:REGISTER_USER_SUCCESS
                , payload:{user, token, location}
            })

            //local storage
            addUserToLocalStorage({user, token, location})

        } catch (error) {
            //console.log(error.response)

            //console.log(error.response.data.msg)

            dispatch({type:REGISTER_USER_ERROR
                , payload:{msg: error.response.data.msg}
            })

        }

        clearAlert()
    }

    const loginUser = async (currentUser) => {
        dispatch({type:LOGIN_USER_BEGIN})
        
        try {
            const response = await axios.post('/api/v1/auth/login',  currentUser);
            
            //console.log(response)
            
            const {user, token, location} = response.data

            //console.log(user)
            
            dispatch({type:LOGIN_USER_SUCCESS
                , payload:{user, token, location}
            })

            //local storage
            addUserToLocalStorage({user, token, location})

        } catch (error) {
            //console.log(error.response)

            //console.log(error.response.data.msg)

            dispatch({type:LOGIN_USER_ERROR
                , payload:{msg: error.response.data.msg}
            })

        }

        clearAlert()
    }

    const logoutUser = () => {
        dispatch({type:LOGOUT_USER})
        removeUserFromLocalStorage()
    }

    const toggleSidebar = () => {
        dispatch({type:TOGGLE_SIDEBAR})
    }

    const updateUser = async (currentUser) => {
        dispatch({ type: UPDATE_USER_BEGIN });

        try {
          const { data } = await axios.patch('/api/v1/auth/updateUser', currentUser, {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          });
          
          const { user, location, token } = data;

          dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: { user, location, token },
          });
      
          addUserToLocalStorage({ user, location, token });
          
        } catch (error) {
            dispatch({
              type: UPDATE_USER_ERROR,
              payload: { msg: error.response.data.msg },
            });
          }
          clearAlert();
    };

    const handleChange = ({ name, value }) => {
        dispatch({
          type: HANDLE_CHANGE,
          payload: { name, value },
        })
    }

    const clearValues = () => {
        dispatch({ type: CLEAR_VALUES })
    }

    const createJob = async () => {
        dispatch({ type: CREATE_JOB_BEGIN });
        try {
          const { position, company, jobLocation, jobType, status } = state;
      
          await axios.post('/api/v1/jobs'
          , {
            company,
            position,
            jobLocation,
            jobType,
            status,
          }, 
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          });

          dispatch({
            type: CREATE_JOB_SUCCESS,
          });

          // call function instead clearValues()
          dispatch({ type: CLEAR_VALUES });

        } catch (error) {
          dispatch({
            type: CREATE_JOB_ERROR,
            payload: { msg: error.response.data.msg },
          });
        }
        clearAlert();
    };

    return <AppContext.Provider value={{...state, displayAlert, registerUser, loginUser, logoutUser
        , toggleSidebar, updateUser, handleChange, clearValues, createJob}}> {children} </AppContext.Provider>
}

const useAppContext = () => {
    return useContext(AppContext)
}

export {AppProvider, initialState, useAppContext}