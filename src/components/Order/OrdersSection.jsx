'use client'
import { UserContextProvider } from '@/app/context/UserContext';
import { Progress } from '@radix-ui/react-progress';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner';
import SearchSection from '../SearchSection';
import { formatNumber } from '@/lib/utils';
import { Plus } from 'lucide-react';
import CreateOrUpdateBag from '../Bag/CreateOrUpdateBag';
import BagsOrdersPagesChanger from '../BagsOrdersPagesChanger';
import { OrdersContextProvider } from '@/context/OrdersContext';
import ChartsSection from '../ChartsSection';

const OrdersSection = ({ page, setPage }) => {

    const { is_seller } = useContext(UserContextProvider);


    const { loading, progress, open, setOpen, orders, setOrders, getOrders, fastUpdateOrder, setIsDelivered, updateOrder } =
        useContext(OrdersContextProvider);

    useEffect(() => {
        if (page == 'orders') {
            getOrders()
        }
    }, [page])


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

            {/* choose orders or orders */}
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
            <div className="mt-20 items-start gap-10 grid grid-cols-3">
                <div className="col-span-1 flex flex-col">
                    <p className="text-[#6C85FF]">Total Clients</p>
                    <p className="text-zinc-500 text-sm mt-1">
                        {formatNumber(orders?.length)}
                    </p>
                </div>
                {is_seller ? null : (
                    <>
                        <div className="col-span-1 flex flex-col">
                            <p className="text-[#6C85FF]">Total Orders Sales</p>
                            <p className="text-zinc-500 text-sm mt-1 grid grid-cols-2">
                                <span>
                                    {formatNumber(
                                        orders?.map((order) => order?.pieces)?.flat().reduce((total, orderPiece) => total + Number(orderPiece?.price_in_egp), 0)
                                    )}
                                </span>
                                <span>EGP</span>
                            </p>
                            <p className="text-zinc-500 text-sm grid grid-cols-2">
                                <span>
                                    {formatNumber(
                                        orders?.map((order) => order?.pieces)?.flat().reduce((total, orderPiece) => total + Number(orderPiece?.price_in_sar), 0)
                                    )}
                                </span>
                                <span>SAR</span>
                            </p>
                        </div>
                    </>
                )}
            </div>


            {/* orders list */}
            <div className="mt-20 flex flex-col gap-5">
                <div
                    className={`${is_seller ? "grid grid-cols-5" : "grid grid-cols-7"
                        } gap-10 md:text-sm text-xs font-bold`}
                >
                    <p className="col-span-1">Bag</p>
                    <p className="col-span-1">Customer name</p>
                    <p className="col-span-1">He Should Pay</p>
                    <p className="col-span-1">Pieces Count</p>
                    {is_seller ? null : (
                        <>
                            <p className="col-span-1">Paid</p>
                        </>
                    )}
                    <p className="col-span-1">Is Delivered</p>
                    <p className="col-span-1">Is Collected</p>
                    <p className="col-span-1">Date</p>
                </div>
                {orders?.length == 0 ? (
                    <div className="p-3 px-4 col-span-7 bg-yellow-100 text-yellow-500 text-lg">
                        <p>No Orders</p>
                    </div>
                ) : (
                    orders?.map((order) => (
                        <div
                            key={order?.id}
                            className={`${is_seller ? "grid grid-cols-5" : "grid grid-cols-7"
                                } gap-10 md:text-sm text-xs transition-all duration-300 border-b py-3 border-black/30 hover:bg-blue-50 cursor-pointer px-1`}
                        >
                            <p className="col-span-1">{order?.bag_name}</p>
                            <p className="col-span-1">{order?.customer_name}</p>
                            <p className="col-span-1 flex flex-col">
                                <span>
                                    {formatNumber(order?.pieces?.reduce((total, piece) => total + Number(piece?.price_in_egp), 0))} EGP
                                </span>
                                <span>
                                    {formatNumber(order?.pieces?.reduce((total, piece) => total + Number(piece?.price_in_sar), 0))} EGP
                                </span>
                            </p>
                            <p className="col-span-1">{order?.how_many_pices || order?.pieces?.length}</p>
                            {is_seller ? null : (
                                <>
                                    <p className="col-span-1 flex flex-col">
                                        <span className="grid grid-cols-2">
                                            <span>{formatNumber(order?.paid_in_egp)}</span>
                                            <span>EGP</span>
                                        </span>
                                        <span className="grid grid-cols-2">
                                            <span>{formatNumber(order?.paid_in_sar)}</span>
                                            <span>SAR</span>
                                        </span>
                                    </p>
                                </>
                            )}
                            <select className={`col-span-1 ${order?.is_delivered ? "bg-green-100" : "bg-red-100"} w-full`} value={order?.is_delivered} onChange={e => {
                                fastUpdateOrder(order?.id, { is_delivered: e.target.value == 'true' ? true : false })
                            }}>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                            <select className={`col-span-1 ${order?.is_collected ? "bg-green-100" : "bg-red-100"} w-full`} value={order?.is_collected} onChange={e => {
                                fastUpdateOrder(order?.id, {
                                    is_collected: e.target.value == 'true' ? true : false
                                })
                            }}>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                            <p>{order?.date || "No Date"}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default OrdersSection
