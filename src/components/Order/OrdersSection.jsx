'use client'
import { UserContextProvider } from '@/app/context/UserContext';
import { Progress } from '@radix-ui/react-progress';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner';
import SearchSection from '../SearchSection';
import { formatNumber } from '@/lib/utils';
import { FolderClosed, Plus } from 'lucide-react';
import CreateOrUpdateBag from '../Bag/CreateOrUpdateBag';
import BagsOrdersPagesChanger from '../BagsOrdersPagesChanger';
import { OrdersContextProvider } from '@/context/OrdersContext';
import ChartsSection from '../ChartsSection';



import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import PieceDetails from '../PieceDetails';
import CreateOrUpdateOrder from './CreateOrUpdateOrder';
import { BagContextProvider } from '@/context/BagContext';


const OrdersSection = ({ page, setPage }) => {


    const { is_seller, user } = useContext(UserContextProvider);

    useEffect(() => {
        if (!user) {
            toast.error("You are not logged in");
            window.location.href = "/login";
        }
    }, [user]);


    const { 
        ordersParams, 
        loading, progress, open, setOpen, 
        orders, setOrders, getOrders, 
        fastUpdateOrder, setIsDelivered, updateOrder 
    } =
        useContext(OrdersContextProvider);

    useEffect(() => {
        if (page == 'orders') {
            getOrders()
        }
    }, [page])


    const [openCalendar, setOpenCalendar] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const [openTruck, setOpenTruck] = useState(false);


    const [openedCustomer, setOpenedCustomer] = useState(null);


    const [openBag, setOpenBag] = useState(false);
    const {setBag,  getBag} = useContext(BagContextProvider)
    const [order, setOrder] = useState(null);


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
            <div className="mt-20 items-start gap-10 grid grid-cols-2">
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
                {/* {is_seller ? null : (
                    ordersParams?.sales_id ? (
                        <>
                            <div className="col-span-1 flex flex-col">
                                <p className="text-[#6C85FF]">Seller Sales</p>
                                <p className="text-zinc-500 text-sm mt-1 grid grid-cols-2">
                                    <span>
                                        {formatNumber(
                                            orders?.filter(o => o?.seller_id == ordersParams?.sales_id)?.map((order) => order?.pieces)?.flat().reduce((total, orderPiece) => total + Number(orderPiece?.price_in_egp), 0)
                                        )}
                                    </span>
                                    <span>EGP</span>
                                </p>
                                <p className="text-zinc-500 text-sm mt-1 grid grid-cols-2">
                                    <span>
                                    {
                                        (() => {
                                            const total = orders?.map((order) => order?.pieces)
                                                ?.flat()
                                                .reduce((total, orderPiece) => total + Number(orderPiece?.price_in_egp), 0) || 0;

                                            const filteredTotal = orders?.filter(o => o?.seller_id == ordersParams?.sales_id)
                                                ?.map((order) => order?.pieces)
                                                ?.flat()
                                                .reduce((total, orderPiece) => total + Number(orderPiece?.price_in_egp), 0) || 0;

                                            const percentage = total > 0 ? (total- filteredTotal) : 0;

                                            return `${formatNumber(percentage.toFixed(2))}`;
                                        })()
                                    }
                                    </span>
                                    <span>EGP</span>
                                </p>
                                <p className="text-zinc-500 text-sm mt-1 grid grid-cols-2">
                                    <span>
                                    {
                                        (() => {
                                            const total = orders?.map((order) => order?.pieces)
                                                ?.flat()
                                                .reduce((total, orderPiece) => total + Number(orderPiece?.price_in_egp), 0) || 0;

                                            const filteredTotal = orders?.filter(o => o?.seller_id == ordersParams?.sales_id)
                                                ?.map((order) => order?.pieces)
                                                ?.flat()
                                                .reduce((total, orderPiece) => total + Number(orderPiece?.price_in_egp), 0) || 0;

                                            const percentage = total > 0 ? (filteredTotal / total) * 100 : 0;

                                            return `% ${formatNumber(percentage.toFixed(2))}`;
                                        })()
                                    }
                                    </span>
                                </p>
                            </div>
                    </>
                    ) : null
                )} */}
            </div>


            {/* orders list */}
            <div className="mt-20 flex flex-col gap-5">
                <div className={`${"grid grid-cols-9"
                    } gap-10 md:text-sm text-xs font-bold`}
                >
                    <p className="col-span-1">Order</p>
                    <p className="col-span-1">Customer Number</p>
                    <p className="col-span-1">Pieces</p>
                    <p className="col-span-1">Paid</p>
                    <p className="col-span-1">Remaining</p>
                    <p className="col-span-1">Is Delivered</p>
                    <p className="col-span-1">Is Collected</p>
                    <p className="col-span-1">Seller</p>
                    <p className="col-span-1">Date</p>
                </div>

                {orders?.length == 0 ? (
                    <div className="p-3 px-4 col-span-7 bg-yellow-100 text-yellow-500 text-lg">
                        <p>No Clients</p>
                    </div>
                ) : (
                    orders?.map((order) => (
                        <div
                            key={order?.id}
                            className={`${"grid grid-cols-9"
                                } gap-10 md:text-sm text-xs transition-all duration-300 border-b py-3 border-black/30 hover:bg-blue-50 cursor-pointer px-1`}

                        >
                            <p
                                onClick={async() => {
                                    const bag = await getBag(order?.bag)
                                    setBag(bag)
                                    setOpenBag(true)
                                    setOrder(order)
                                }}
                                className="col-span-1">{order?.bag_name}</p>
                            <p
                                onClick={() => {
                                    setOpenedCustomer(order)
                                }} className="col-span-1">{order?.customer_number}</p>
                            <p
                                onClick={() => {
                                    setOpenedCustomer(order)
                                }} className="col-span-1">{order?.how_many_pices ? order?.how_many_pices : order?.pieces?.length}</p>
                            <p
                                onClick={() => {
                                    setOpenedCustomer(order)
                                }} className="col-span-1 flex flex-col">
                                <span>
                                    {formatNumber(order?.paid_in_egp)} EGP
                                </span>
                                {/* <span>
                                    {formatNumber(order?.paid_in_sar)} EGP
                                </span> */}
                            </p>
                            <p
                                onClick={() => {
                                    setOpenedCustomer(order)
                                }} className="col-span-1 flex flex-col">
                                <span>
                                    {formatNumber(order?.remaining_in_egp)} EGP
                                </span>
                                {/* <span>
                                    {formatNumber(order?.remaining_in_sar)} EGP
                                </span> */}
                            </p>
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
                            <p
                                onClick={() => {
                                    setOpenedCustomer(order)
                                }} className="col-span-1">{order?.seller ? order?.seller : "No Seller"}</p>
                            <p
                                onClick={() => {
                                    setOpenedCustomer(order)
                                }}>{order?.date || "No Date"}</p>
                        </div>
                    ))
                )}
            </div>

            <CreateOrUpdateBag open={openBag} setOpen={setOpenBag} clickedOrder={order} />

            {/* pop the data */}
            <Dialog open={openedCustomer}>
                <DialogContent className="flex flex-col w-full max-w-[97%] h-full max-h-[94%] overflow-y-scroll">

                    <DialogHeader className={'h-0 overflow-hidden'}>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>

                    {/* close */}
                    <div onClick={() => setOpenedCustomer(null)} className='absolute z-50 p-1 bg-red-500 text-white rounded-sm cursor-pointer top-3 right-3 px-3'>
                        X
                    </div>

                    {/* content */}
                    {/* all pieces */}
                    <div className="flex flex-col space-y-1">
                        <p className="text-blue-500 text-sm mb-3">Pieces</p>
                        {openedCustomer?.pieces?.map((piece, pieceId) => (
                            <PieceDetails key={pieceId} piece={piece} />
                        ))}
                    </div>
                    {/* bsic info and seller */}
                    <div className='mt-5 space-y-3 p-2 rounded-xl bg-gray-100'>
                        <div className={`grid ${openedCustomer?.seller_name ? "grid-cols-2" : "grid-cols-1"} gap-5`}>
                            {openedCustomer?.seller_name ? (
                                <p className='col-span-1'><span className='text-sm'>Seller:</span> <span className='font-bold'>{openedCustomer?.seller_name}</span></p>
                            ) : null}
                            <p className='col-span-1'><span className='text-sm'>Bag Name:</span> <span className='font-bold'>{openedCustomer?.bag_name}</span></p>
                        </div>
                        <div className='grid grid-cols-2 items-center gap-5 w-full'>
                            {/* <p><span className="text-sm col-span-1">Customer Name:</span> <span className='font-bold'>{openedCustomer?.customer_name}</span></p> */}
                            <p><span className="text-sm col-span-1">Customer Number:</span> <span className='font-bold'>{openedCustomer?.customer_number}</span></p>
                            <p><span className="text-sm col-span-1">Pieces:</span> <span className="font-bold">{openedCustomer?.how_many_pices || openedCustomer?.pieces?.length}</span></p>
                        </div>
                        {openedCustomer?.customer_note ? (
                            <p><span className="text-sm">Notes:</span> <span className='font-bold'>{openedCustomer?.customer_note}</span></p>
                        ) : null}
                        <p><span className="text-sm">Address:</span> <span className="font-bold">{openedCustomer?.address}</span></p>
                    </div>
                    {/* paid and remaining */}
                    <div className='mt-5 p-2 space-y-3'>
                        <div className='grid grid-cols-2 gap-5'>
                            <div className='col-span-1 space-y-1'>
                                <p className='text-sm text-gray-500'>Paid:</p>
                                <p className=''>{openedCustomer?.paid_in_egp || 0} EGP</p>
                                {/* <p className=''>{openedCustomer?.paid_in_sar || 0} SAR</p> */}
                            </div>
                            <div className='col-span-1 space-y-1'>
                                <p className='text-sm text-gray-500'>Remaining:</p>
                                <p className=''>{openedCustomer?.remaining_in_egp || 0} EGP</p>
                                {/* <p className=''>{openedCustomer?.remaining_in_sar || 0} SAR</p> */}
                            </div>
                        </div>
                    </div>
                    {/* collected and delivered */}
                    <div className='mt-5 p-2 space-y-3'>
                        <div className='grid grid-cols-2 gap-5'>
                            <div className='col-span-1 space-y-1'>
                                <p className='text-sm text-gray-500'>Is Dilivered:</p>
                                <p className={`${openedCustomer?.is_delivered ? "text-green-500" : "text-red-500"}`}>{openedCustomer?.is_delivered ? "Yes" : "No"}</p>
                            </div>
                            <div className='col-span-1 space-y-1'>
                                <p className='text-sm text-gray-500'>Is Collected:</p>
                                <p className={`${openedCustomer?.is_collected ? "text-green-500" : "text-red-500"}`}>{openedCustomer?.is_collected ? "Yes" : "No"}</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default OrdersSection
