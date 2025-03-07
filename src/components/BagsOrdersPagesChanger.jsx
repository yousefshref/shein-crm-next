import React from 'react'

const BagsOrdersPagesChanger = ({ page, setPage }) => {
    return (
        <div className="w-full max-w-[400px] bg-blue-100 gap-5 p-2 rounded-xl grid grid-cols-2">
            <div
                onClick={() => {
                    setPage('bags')
                    localStorage.setItem('page', 'bags')
                }}
                className={`cursor-pointer transition-all p-2 rounded-xl ${page == 'bags' ? "bg-blue-500 text-white" : "bg-blue-200 text-zinc-700"}`}>
                Orders
            </div>
            <div
                onClick={() => {
                    setPage('orders')
                    localStorage.setItem('page', 'orders')
                }}
                className={`cursor-pointer transition-all p-2 rounded-xl ${page == 'bags' ? "bg-blue-200 text-zinc-700" : "bg-blue-500 text-white"}`}>
                Clients
            </div>
        </div>
    )
}

export default BagsOrdersPagesChanger
