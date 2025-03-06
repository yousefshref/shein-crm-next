'use client'
import React, { useEffect } from 'react'
import { useContext, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { BagContextProvider } from "@/context/BagContext";
import { formatNumber } from "@/lib/utils";
import CreateOrUpdateBag from "@/components/Bag/CreateOrUpdateBag";
import { UserContextProvider } from '@/app/context/UserContext';
import SearchSection from '../SearchSection';
import BagsOrdersPagesChanger from '../BagsOrdersPagesChanger';
import ChartsSection from '../ChartsSection';
import { toast } from 'sonner';
import { OrdersContextProvider } from '@/context/OrdersContext';


const BagsSection = ({ page, setPage }) => {
    const { is_seller, user } = useContext(UserContextProvider);
    const { getOrder } = useContext(OrdersContextProvider);

    useEffect(() => {
        if (!user) {
            toast.error("You are not logged in");
            window.location.href = "/login";
        }
    }, [user]);


    const { loading, progress, open, setOpen, bags, setBagDetails, getBag, setOrdersDetails } =
        useContext(BagContextProvider);


    const [openCalendar, setOpenCalendar] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const [openTruck, setOpenTruck] = useState(false);

        
    return (
        <div
            className={`relative flex flex-col transition-all duration-500
          ${open || openCalendar || openSearch || openTruck ? "scale-95" : ""}
        `}
        >
            {/* loading */}
            {loading ? (
                <div className="fixed w-full h-full left-0 top-0 transition-all duration-200 bg-black/30 z-50">
                    <Progress value={progress} />
                </div>
            ) : null}

            {/* charts */}
            <ChartsSection />

            {/* choose bags or orders */}
            <div className="mt-14 grid grid-cols-2 gap-5">
                <BagsOrdersPagesChanger page={page} setPage={setPage} />

                {/* search */}
                <SearchSection
                    openCalendar={openCalendar}
                    setOpenCalendar={setOpenCalendar}
                    openSearch={openSearch}
                    setOpenSearch={setOpenSearch}
                    openTruck={openTruck}
                    setOpenTruck={setOpenTruck}
                    page={page}
                />
            </div>

            {/* order details */}
            <div className="mt-14 items-start gap-10 grid grid-cols-3">
                <div className="col-span-1 flex flex-col">
                    <p className="text-[#6C85FF]">Total Bags</p>
                    <p className="text-zinc-500 text-sm mt-1">
                        {formatNumber(bags?.length)}
                    </p>
                </div>
                {is_seller ? null : (
                    <>
                        <div className="col-span-1 flex flex-col">
                            <p className="text-[#6C85FF]">Total Bags Sales</p>
                            <p className="text-zinc-500 text-sm mt-1 grid grid-cols-2">
                                <span>
                                    {formatNumber(
                                        bags?.reduce(
                                            (total, bag) => total + Number(bag?.price_in_egp),
                                            0
                                        )
                                    )}
                                </span>
                                <span>EGP</span>
                            </p>
                            {/* <p className="text-zinc-500 text-sm grid grid-cols-2">
                                <span>
                                    {formatNumber(
                                        bags?.reduce(
                                            (total, bag) => total + Number(bag?.price_in_sar),
                                            0
                                        )
                                    )}
                                </span>
                                <span>SAR</span>
                            </p> */}
                        </div>
                        <div className="col-span-1 flex flex-col">
                            <p className="text-[#6C85FF]">Total Bags Profit</p>
                            <p className="text-zinc-500 text-sm grid grid-cols-2">
                                <span>
                                    {formatNumber(
                                        bags?.reduce(
                                            (total, bag) => total + Number(bag?.profit_in_egp),
                                            0
                                        )
                                    )}
                                </span>
                                <span>EGP</span>
                            </p>
                            {/* <p className="text-zinc-500 text-sm grid grid-cols-2 mt-1">
                                <span>
                                    {formatNumber(
                                        bags?.reduce(
                                            (total, bag) => total + Number(bag?.profit_in_sar),
                                            0
                                        )
                                    )}
                                </span>
                                <span>SAR</span>
                            </p> */}
                        </div>
                    </>
                )}
            </div>
            {/* order create order */}
            <div
                onClick={() => {
                    setOpen(true)
                    setBagDetails(
                        {
                            name: '',
                            date: '',
                            weight: 0,
                            shipping_company: '',
                            shipping_cost_in_egp: 0,
                            shipping_cost_in_sar: 0,
                            price_in_egp: 0,
                            price_in_sar: 0,
                            profit_in_egp: 0,
                            profit_in_sar: 0,
                            xg: '',
                            discount_in_egp: 0,
                            discount_in_sar: 0,
                        }
                    )
                    setOrdersDetails([])
                }}
                className="mt-14 bg-[#71ff6c] cursor-pointer transition-all duration-300 hover:bg-[#57ff51] w-[40px] h-[40px] rounded-full text-white flex flex-col justify-center items-center"
            >
                <Plus className="w-full" />
            </div>
            <CreateOrUpdateBag open={open} setOpen={setOpen} />
            {/* orders list */}
            <div className="mt-5 flex flex-col gap-5">
                <div
                    className={`${is_seller ? "grid grid-cols-6" : "grid grid-cols-8"
                        } gap-10 md:text-sm text-xs font-bold`}
                >
                    <p className="col-span-1">Name</p>
                    <p className="col-span-1">Date</p>
                    <p className="col-span-1">Price</p>
                    <p className="col-span-1">Total Paid</p>
                    <p className="col-span-1">Pieces</p>
                    <p className="col-span-1">Shipping Company</p>
                    {is_seller ? null : (
                        <>
                            <p className="col-span-1">Profit</p>
                            <p className="col-span-1">XG</p>
                        </>
                    )}
                </div>
                {bags?.length == 0 ? (
                    <div className="p-3 px-4 col-span-7 bg-yellow-100 text-yellow-500 text-lg">
                        <p>No Bags</p>
                    </div>
                ) : (
                    bags?.map((bag) => (
                        <div
                            key={bag?.id}
                            className={`${is_seller ? "grid grid-cols-6" : "grid grid-cols-8"
                                } gap-10 md:text-sm text-xs transition-all duration-300 border-b py-3 border-black/30 hover:bg-blue-50 cursor-pointer px-1`}
                            onClick={() => {
                                setOpen(true);
                                getBag(bag?.id);
                            }}
                        >
                            <p className="col-span-1">{bag?.name}</p>
                            <p className="col-span-1">{bag?.date || "No Date"}</p>
                            <p className="col-span-1">
                                <span className="flex flex-col space-y-2">
                                    <span className="grid grid-cols-2">
                                        <span>{formatNumber(bag?.price_in_egp)}</span>
                                        <span>EGP</span>
                                    </span>
                                    {/* <span className="grid grid-cols-2">
                                        <span>{formatNumber(bag?.price_in_sar)}</span>
                                        <span>SAR</span>
                                    </span> */}
                                </span>
                            </p>
                            <p className="col-span-1">
                                <span className="flex flex-col space-y-2">
                                    <span className="grid grid-cols-2">
                                        <span>{formatNumber(bag?.total_paid_in_egp)}</span>
                                        <span>EGP</span>
                                    </span>
                                </span>
                            </p>
                            <p className="col-span-1">
                                <span className="flex flex-col space-y-2">
                                    <span className="grid grid-cols-2">
                                        <span>{formatNumber(bag?.total_pieces)}</span>
                                    </span>
                                    {/* <span className="grid grid-cols-2">
                                        <span>{formatNumber(bag?.shipping_cost_in_sar)}</span>
                                        <span>SAR</span>
                                    </span> */}
                                </span>
                            </p>
                            <p className="col-span-1">
                                {bag?.shipping_company_name || "None"}
                            </p>
                            {is_seller ? null : (
                                <>
                                    <p className="col-span-1 flex flex-col">
                                        <span className="grid grid-cols-2">
                                            <span>{formatNumber(bag?.profit_in_egp)}</span>
                                            <span>EGP</span>
                                        </span>
                                        {/* <span className="grid grid-cols-2">
                                            <span>{formatNumber(bag?.profit_in_sar)}</span>
                                            <span>SAR</span>
                                        </span> */}
                                    </p>
                                    <p className="col-span-1">{bag?.xg || "None"}</p>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default BagsSection
