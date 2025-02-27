'use client'
import { server } from '@/app/server'
import axios from 'axios'
import React, { useEffect } from 'react'

const ShippingCompaniesContext = ({ children }) => {
    const [shipping_companies, setShippingCompanies] = React.useState([])
    const getShippingCompanies = async () => {
        if (localStorage.getItem('token')) {
            try {
                const res = await axios.get(`${server}shipping-couriers/`, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`
                    }
                })
                setShippingCompanies(res.data)
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
        getShippingCompanies()
    }, [])
    return (
        <ShippingCompaniesContextProvider.Provider value={{
            shipping_companies
        }}>
            {children}
        </ShippingCompaniesContextProvider.Provider>
    )
}

export default ShippingCompaniesContext
export const ShippingCompaniesContextProvider = React.createContext()
