'use client'
import axios from 'axios'
import React, { useEffect } from 'react'
import { server } from '../server'

const UserContext = ({ children }) => {

    const [user, setUser] = React.useState({})
    const [is_seller, setIsSeller] = React.useState(false)

    const getUser = async () => {
        if (localStorage.getItem('token')) {
            try {
                const res = await axios.get(`${server}user/`, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`
                    }
                })
                setUser(res.data)
                if (res.data.role == 'seller') {
                    setIsSeller(true)
                }
            } catch (error) {
                console.error(error)
                if (error.response.status == 401) {
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                }
            }
        }
    }

    useEffect(() => {
        getUser()
    }, [])
    return (
        <UserContextProvider.Provider value={{
            user, is_seller,
            getUser
        }}>
            {children}
        </UserContextProvider.Provider>
    )
}

export default UserContext
export const UserContextProvider = React.createContext()