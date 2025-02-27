'use client'
import { server } from '@/app/server'
import axios from 'axios'
import React, { useEffect } from 'react'

const SellersContext = ({ children }) => {
    const [sellers, setSellers] = React.useState([])
    const getSellers = async () => {
        if (localStorage.getItem('token')) {
            try {
                const res = await axios.get(`${server}sales/`, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`
                    }
                })
                setSellers(res.data)
            } catch (error) {
                console.error(error)
                if (error.response.status == 401) {
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                    return
                }
            }
        }
    }
    useEffect(() => {
        getSellers()
    }, [])
    return (
        <SellersContextProvider.Provider value={{
            sellers
        }}>
            {children}
        </SellersContextProvider.Provider>
    )
}

export default SellersContext
export const SellersContextProvider = React.createContext()
