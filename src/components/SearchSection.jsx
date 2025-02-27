import { Calendar, Search, Truck } from 'lucide-react'
import React from 'react'
import CalendarDialog from './Order/CalendarDialog'
import OrdersSearchDialog from './Order/OrdersSearchDialog'
import OrdersTruckDialog from './Order/OrdersTruckDialog'

const SearchSection = ({
    page,
    openCalendar,
    setOpenCalendar,
    openSearch,
    setOpenSearch,
    openTruck,
    setOpenTruck,
}) => {
    return (
        <div className="flex gap-10 items-center">
            <p className="text-[#6C85FF]">Search By</p>
            {page == 'bags' ? (
                <>
                    <div
                        onClick={() => setOpenCalendar(true)}
                        className="p-2 bg-[#6C85FF] cursor-pointer transition-all duration-300 hover:bg-[#788fff] w-[40px] h-[40px] rounded-full text-white flex flex-col justify-center items-center"
                    >
                        <Calendar className="w-full" />
                    </div>
                    <CalendarDialog page={page} open={openCalendar} setOpen={setOpenCalendar} />
                </>
            ) : null}

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
