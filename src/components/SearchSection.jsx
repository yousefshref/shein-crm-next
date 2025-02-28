'use client'
import { Calendar, Check, CircleX, Search, Truck } from 'lucide-react'
import React, { useContext } from 'react'
import CalendarDialog from './Order/CalendarDialog'
import OrdersSearchDialog from './Order/OrdersSearchDialog'
import OrdersTruckDialog from './Order/OrdersTruckDialog'
import { toast } from 'sonner'
import { BagContextProvider } from '@/context/BagContext'

const SearchSection = ({
    page,
    openCalendar,
    setOpenCalendar,
    openSearch,
    setOpenSearch,
    openTruck,
    setOpenTruck,
}) => {

    const {
        bagParams,
        updateBagParams
    } = useContext(BagContextProvider);

    console.log(bagParams);
    
    return (
        <div className="flex gap-10 items-center">
            <p className="text-[#6C85FF]">Search By</p>
            <>
                <div
                    onClick={() => setOpenCalendar(true)}
                    className="p-2 bg-[#6C85FF] cursor-pointer transition-all duration-300 hover:bg-[#788fff] w-[40px] h-[40px] rounded-full text-white flex flex-col justify-center items-center"
                >
                    <Calendar className="w-full" />
                </div>
                <CalendarDialog page={page} open={openCalendar} setOpen={setOpenCalendar} />
            </>

            {page == 'orders' ? (
                <>
                    <div
                        onClick={() => setOpenSearch(true)}
                        className="p-2 bg-[#6C85FF] cursor-pointer transition-all duration-300 hover:bg-[#788fff] w-[40px] h-[40px] rounded-full text-white flex flex-col justify-center items-center"
                    >
                        <Search className="w-full" />
                    </div>
                    <OrdersSearchDialog open={openSearch} setOpen={setOpenSearch} />
                </>
            ) : null}

            {page == 'bags' ? (
                <>
                    <div
                        onClick={() => {
                            if(bagParams?.is_closed == 'true'){
                                toast.success('Filter Opened Orders')
                                updateBagParams('is_closed', 'false')
                            }else{
                                toast.success('Filter Only Closed Orders')
                                updateBagParams('is_closed', 'true')
                            }
                        }}
                        className="p-2 bg-[#6C85FF] cursor-pointer transition-all duration-300 hover:bg-[#788fff] w-[40px] h-[40px] rounded-full text-white flex flex-col justify-center items-center"
                    >
                        {
                            bagParams?.is_closed == 'true' ?
                                <CircleX className="w-full" />
                            :
                                <Check className="w-full" />
                        }
                    </div>
                    <OrdersSearchDialog open={openSearch} setOpen={setOpenSearch} />
                </>
            ) : null}

            <div
                onClick={() => setOpenTruck(true)}
                className="p-2 bg-[#6C85FF] cursor-pointer transition-all duration-300 hover:bg-[#788fff] w-[40px] h-[40px] rounded-full text-white flex flex-col justify-center items-center"
            >
                <Truck className="w-full" />
            </div>
            <OrdersTruckDialog page={page} open={openTruck} setOpen={setOpenTruck} />
        </div>
    )
}

export default SearchSection
