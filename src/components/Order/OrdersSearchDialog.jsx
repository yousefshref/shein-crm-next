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
import { Input } from '../ui/input'
import { SellersContextProvider } from '@/context/SellersContext'

const OrdersSearchDialog = ({ open, setOpen }) => {
    const {
        ordersParams,
        updateOrdersParams,

        getOrders,
    } = useContext(OrdersContextProvider)

    // add search fields
    const { sellers } = useContext(SellersContextProvider)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-start">Filter with Basic Info</DialogTitle>
                </DialogHeader>
                {/* content */}
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-1'>
                        <p className='text-gray-500 text-sm'>Seller</p>
                        <select value={ordersParams?.sales_id} onChange={(e) => updateOrdersParams('sales_id', e.target.value)} className='input-primary'>
                            <option value="">All Sellers</option>
                            {sellers?.map((seller) => (
                                <option key={seller?.id} value={seller?.id}>{seller?.user_username}</option>
                            ))}
                        </select>
                    </div>
                    {/* <div className='flex flex-col gap-1'>
                        <p className='text-gray-500 text-sm'>Customer Name</p>
                        <Input value={ordersParams?.customer_name} onChange={(e) => updateOrdersParams('customer_name', e.target.value)} placeholder='Customer Name' />
                    </div> */}
                    <div className='flex flex-col gap-1'>
                        <p className='text-gray-500 text-sm'>Customer Number</p>
                        <Input value={ordersParams?.customer_number} onChange={(e) => updateOrdersParams('customer_number', e.target.value)} placeholder='Customer Number' />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => {
                        getOrders()
                        setOpen(false)
                    }} className="me-auto px-7">Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default OrdersSearchDialog
