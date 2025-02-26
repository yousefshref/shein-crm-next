'use client'
import { OrdersContextProvider } from '@/context/OrdersContext'
import React, { useContext, useEffect } from 'react'

import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import axios from 'axios'
import { server } from '@/app/server'
import { Trash } from 'lucide-react'
import { UserContextProvider } from '@/app/context/UserContext'


const CreateOrUpdateOrder = () => {
    const { is_seller } = useContext(UserContextProvider)
    const {
        open, setOpen,

        sales, setSales,
        customer_name, setCustomerName,
        customer_phone, setCustomerPhone,
        customer_wp, setCustomerWp,
        // shipping details
        shipping_courier, setShippingCourier,
        shipping_cost, setShippingCost,
        order_status, setOrderStatus,
        address, setAddress,
        // money details
        total_order_in_sar, setTotalOrderInSar,
        total_order_in_eg, setTotalOrderInEg,
        total_order_profit_in_sar, setTotalOrderProfitInSar,
        total_order_profit_in_eg, setTotalOrderProfitInEg,
        paid, setPaid,
        remain, setRemain,
        is_collected, setIsCollected,

        createOrder,


        updateOrder, order,

        deleteOrder

    } = useContext(OrdersContextProvider)

    // get sales
    const [salesList, setSalesList] = React.useState([])
    useEffect(() => {
        if (open) {
            const getSales = async () => {
                try {
                    const res = await axios.get(`${server}sales/`, {
                        headers: {
                            Authorization: `Token ${localStorage.getItem('token')}`
                        }
                    })
                    setSalesList(res.data)
                } catch (error) {
                    console.error(error)
                }
            }
            getSales()
        }
    }, [open])
    // get shipping couriers
    const [shipping_couriers, setShippingCouriers] = React.useState([])
    useEffect(() => {
        if (open) {
            const getShippingCouriers = async () => {
                try {
                    const res = await axios.get(`${server}shipping-couriers/`, {
                        headers: {
                            Authorization: `Token ${localStorage.getItem('token')}`
                        }
                    })
                    setShippingCouriers(res.data)
                } catch (error) {
                    console.error(error)
                }
            }
            getShippingCouriers()
        }
    }, [open])
    // get order statuses
    const [order_statuses, setOrderStatuses] = React.useState([])
    useEffect(() => {
        if (open) {
            const getOrderStatuses = async () => {
                try {
                    const res = await axios.get(`${server}order-statuses/`, {
                        headers: {
                            Authorization: `Token ${localStorage.getItem('token')}`
                        }
                    })
                    setOrderStatuses(res.data)
                } catch (error) {
                    console.error(error)
                }
            }
            getOrderStatuses()
        }
    }, [open])


    useEffect(() => {
        if (paid && total_order_in_sar) {
            setRemain(total_order_in_sar - paid)
        }
        if (!paid) {
            setRemain(total_order_in_sar)
        }
    }, [paid])

    return (
        <Drawer shouldScaleBackground open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className={'flex items-center flex-row w-full'}>
                    <DrawerTitle className={'text-end font-bold text-xl'}>
                        {order?.id ? "تعديل الطلب" : "إضافه طلب جديد"}
                    </DrawerTitle>
                    <Trash onClick={deleteOrder} size={35} className='p-2 ms-auto rounded-md bg-red-500 text-white transition-all duration-200 hover:bg-red-400 cursor-pointer' />
                </DrawerHeader>
                {/* content */}
                <div className="p-5 flex flex-col gap-8 h-[300px] overflow-y-scroll" dir="rtl">
                    {/* Basic Information Section */}
                    <div className="">
                        <h2 className="font-bold text-right text-blue-500">معلومات اساسية</h2>
                        <div className="mt-2">
                            <div className='flex flex-col gap-1'>
                                <p>السيلز</p>
                                <select onChange={(e) => setSales(e.target.value)} value={sales} className='p-1 px-3 rounded-xl bg-gray-100 mt-1'>
                                    <option value="">أختر السيلز</option>
                                    {salesList?.map((sale) => (
                                        <option key={sale.id} value={sale.id}>
                                            {sale?.user_username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-5">
                                <div className='flex flex-col'>
                                    <p>اسم العميل</p>
                                    <Input onChange={(e) => setCustomerName(e.target.value)} value={customer_name} className="bg-gray-50 mt-1" />
                                </div>
                                <div className='flex flex-col'>
                                    <p>رقم الهاتف</p>
                                    <Input type="number" onChange={(e) => setCustomerPhone(e.target.value)} value={customer_phone} className="bg-gray-50 mt-1" />
                                </div>
                                <div className='flex flex-col'>
                                    <p>رقم الواتس اب</p>
                                    <Input type="number" onChange={(e) => setCustomerWp(e.target.value)} value={customer_wp} className="bg-gray-50 mt-1" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Information Section */}
                    <div className="mt-7">
                        <h2 className="font-bold text-right text-blue-500">معلومات الشحن</h2>
                        <div className="mt-2">
                            <div className="grid grid-cols-4 gap-4 items-end">
                                <div className="col-span-3 flex flex-col gap-1">
                                    <p>شركة الشحن</p>
                                    <select onChange={(e) => setShippingCourier(e.target.value)} value={shipping_courier} className='p-1 px-3 rounded-xl bg-gray-100 mt-1'>
                                        <option value="">أختر شركة الشحن</option>
                                        {shipping_couriers?.map((shipping_courier) => (
                                            <option key={shipping_courier.id} value={shipping_courier.id}>
                                                {shipping_courier?.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative">
                                    <Input type="number" onChange={(e) => setShippingCost(e.target.value)} value={shipping_cost} placeholder="تكلفه الشحن" className="bg-gray-50 pl-12" />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">EGP</span>
                                </div>
                            </div>
                            <div className="mt-5 grid grid-cols-6 gap-4 items-end">
                                <div className="col-span-2 flex flex-col gap-1">
                                    <p>حالة الطلب</p>
                                    <select onChange={(e) => setOrderStatus(e.target.value)} value={order_status} className='p-1 px-3 rounded-xl bg-gray-100 mt-1'>
                                        <option value="">اختر الحاله</option>
                                        {order_statuses?.map((order_status) => (
                                            <option key={order_status.id} value={order_status.id}>
                                                {order_status?.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-4 flex flex-col gap-1">
                                    <p>العنوان</p>
                                    <Input onChange={(e) => setAddress(e.target.value)} value={address} className="w-full bg-gray-50" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Details Section */}
                    <div className="mt-10">
                        <h2 className="font-bold text-right text-blue-500">التفاصيل المالية</h2>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            {is_seller ? (
                                <div className='p-2 px-5 rounded-xl bg-yellow-100 text-yellow-600 mt-2'>
                                    <p>ليس لديك صلاحية لهذه الخانات</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-1">
                                        <p>مجموع الطلبات بالريال</p>
                                        <Input type="number" onChange={(e) => setTotalOrderInSar(e.target.value)} value={total_order_in_sar} className="bg-gray-50" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p>مجموع الطلبات بالجنيه</p>
                                        <Input type="number" onChange={(e) => setTotalOrderInEg(e.target.value)} value={total_order_in_eg} className="bg-gray-50" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p>مجموع الأرباح بالريال</p>
                                        <Input type="number" onChange={(e) => setTotalOrderProfitInSar(e.target.value)} value={total_order_profit_in_sar} className="bg-gray-50" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p>مجموع الأرباح بالجنيه</p>
                                        <Input type="number" onChange={(e) => setTotalOrderProfitInEg(e.target.value)} value={total_order_profit_in_eg} className="bg-gray-50" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p>المدفوع</p>
                                        <Input type="number" onChange={(e) => setPaid(e.target.value)} value={paid} className="bg-gray-50" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p>المتبقي</p>
                                        <Input type="number" onChange={(e) => setRemain(e.target.value)} value={remain} className="bg-gray-50" />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Collection Status Button */}
                    <div className="flex gap-3 justify-start pt-4 items-center">
                        <input onChange={(e) => setIsCollected(e.target.checked)} checked={is_collected} type="checkbox" />
                        <p>تم التحصيل</p>
                    </div>
                </div>
                <DrawerFooter>
                    <Button onClick={order?.id ? updateOrder : createOrder} variant="default" className="w-fit px-7">حفظ</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateOrUpdateOrder
