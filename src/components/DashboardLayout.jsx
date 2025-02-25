'use client'
import React, { useContext, useEffect } from 'react'
import { LogOut, Settings, ShoppingCart } from "lucide-react";
import { UserContextProvider } from '@/app/context/UserContext';

const DashboardLayout = ({ children }) => {
    const { is_seller } = useContext(UserContextProvider)
    const [path, setPath] = React.useState(null)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPath(window.location.pathname)
        }
    }, [])
    return (
        <div className="flex gap-5 md:p-5 p-3">
            {/* slider */}
            <div className="flex bg-gray-100 items-center text-center md:p-1 p-3 rounded-xl md:flex-col flex-row gap-4 justify-between fixed md:h-[95%] h-fit md:w-fit w-full z-20 md:right-3 right-0 md:-translate-y-1/2 md:top-1/2 top-0">
                <div className="flex md:flex-col flex-row items-center gap-4">
                    <h3 className="md:text-2xl text-base font-bold">LOGO</h3>
                    <div onClick={() => { window.location.href = '/' }} className={`md:mt-5 md:mx-0 mx-auto md:p-2 p-1 h-fit ${path == '/' ? "bg-[#6C85FF] hover:bg-[#788fff] text-white" : "bg-[#CED6FF] hover:bg-[#c6cfff] text-zinc-500"} cursor-pointer transition-all duration-300 md:w-[40px] w-[30px] rounded-xl flex flex-col justify-center items-center`}>
                        <ShoppingCart className="w-full" />
                    </div>
                    {is_seller ? null : (
                        <div onClick={() => { window.location.href = '/settings' }} className={`md:mt-2 md:mx-0 mx-auto md:p-2 p-1 h-fit ${path == '/settings' ? "bg-[#6C85FF] hover:bg-[#788fff] text-white" : "bg-[#CED6FF] hover:bg-[#c6cfff] text-zinc-500"} cursor-pointer transition-all duration-300 md:w-[40px] w-[30px] rounded-xl flex flex-col justify-center items-center`}>
                            <Settings className="w-full" />
                        </div>
                    )}
                </div>
                <div onClick={() => {
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                }} className="md:mt-2 md:p-2 p-1 bg-[#FF5353] cursor-pointer transition-all duration-300 hover:bg-[#ff7373] md:w-[40px] w-[30px] h-fit rounded-xl text-white flex flex-col justify-center items-center">
                    <LogOut className="w-full" />
                </div>
            </div>
            {/* content */}
            <div className='md:w-[calc(100%-100px)] w-[100%] ms-auto md:mt-0 mt-16'>
                {children}
            </div>
        </div>
    )
}

export default DashboardLayout
