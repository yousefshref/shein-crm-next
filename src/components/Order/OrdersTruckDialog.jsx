import React, { useContext, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { OrdersContextProvider } from '@/context/OrdersContext'
import axios from 'axios'
import { server } from '@/app/server'

const OrdersTruckDialog = ({ open, setOpen }) => {
    const {
        order_status_param, setOrderStatus_param,
        shipping_courier_param, setShippingCourier_param,
        is_collected_param, setIsCollected_param,

        getOrders,
    } = useContext(OrdersContextProvider)


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


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-end">فلتر الطلبات بالمعلومات الاساسية</DialogTitle>
                </DialogHeader>
                {/* content */}
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-1'>
                        <p className='text-gray-500 text-sm'>اسم الشركة</p>
                        <select value={shipping_courier_param} onChange={(e) => setShippingCourier_param(e.target.value)} className='input-primary'>
                            <option value="">جميع الطبات</option>
                            {shipping_couriers?.map((shipping_courier) => (
                                <option key={shipping_courier?.id} value={shipping_courier?.id}>{shipping_courier?.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <p className='text-gray-500 text-sm'>حالة الطلب</p>
                        <select value={order_status_param} onChange={(e) => setOrderStatus_param(e.target.value)} className='input-primary'>
                            <option value="">كل الحالات</option>
                            {order_statuses?.map((order_status) => (
                                <option key={order_status?.id} value={order_status?.id}>{order_status?.name}</option>
                            ))}
                        </select>
                    </div>


                    <div className='flex flex-col gap-1'>
                        <p className='text-gray-500 text-sm'>تم التحصيل</p>
                        <select value={is_collected_param} onChange={(e) => setIsCollected_param(e.target.value)} className='input-primary'>
                            <option value="">كل الحالات</option>
                            <option value="true">نعم</option>
                            <option value="false">لا</option>
                        </select>
                    </div>

                </div>
                <DialogFooter>
                    <Button onClick={() => {
                        getOrders()
                        setOpen(false)
                    }} className="me-auto px-7">تم</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default OrdersTruckDialog
