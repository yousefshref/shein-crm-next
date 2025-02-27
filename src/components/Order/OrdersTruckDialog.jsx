import React, { useContext } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { ShippingCompaniesContextProvider } from '@/context/ShippingCompaniesContext'
import { BagContextProvider } from '@/context/BagContext'
import { OrdersContextProvider } from '@/context/OrdersContext'

const OrdersTruckDialog = ({ open, setOpen, page }) => {
    // get shipping couriers
    const { shipping_companies: shipping_couriers } = useContext(ShippingCompaniesContextProvider)

    const { updateBagParams, bagParams, getBags } = useContext(BagContextProvider)
    const { ordersParams, updateOrdersParams, getOrders } = useContext(OrdersContextProvider)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-start">Filter By Shipping Data</DialogTitle>
                </DialogHeader>
                {/* content */}
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-1'>
                        <p className='text-gray-500 text-sm'>Shipping Courier</p>
                        <select onChange={(e) => {
                            if (page == 'bags') {
                                updateBagParams('shipping_company', e.target.value)
                            }
                            if (page == 'orders') {
                                updateOrdersParams('shipping_company', e.target.value)
                            }
                        }} value={page == 'bags' ? bagParams?.shipping_company : ordersParams?.shipping_company} className='input-primary'>
                            <option value="">All Couriers</option>
                            {shipping_couriers?.map((shipping_courier) => (
                                <option key={shipping_courier?.id} value={shipping_courier?.id}>{shipping_courier?.name}</option>
                            ))}
                        </select>
                    </div>

                    {page == 'orders' ? (
                        <>
                            <div className='flex flex-col gap-1'>
                                <p className='text-gray-500 text-sm'>Is Delivered</p>
                                <select onChange={(e) => updateOrdersParams('is_delivered', e.target.value)} value={ordersParams?.is_delivered} className='input-primary'>
                                    <option value="">Anything</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>


                            <div className='flex flex-col gap-1'>
                                <p className='text-gray-500 text-sm'>Is Collected</p>
                                <select onChange={(e) => updateOrdersParams('is_collected', e.target.value)} value={ordersParams?.is_collected} className='input-primary'>
                                    <option value="">Anything</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        </>
                    ) : null}

                </div>
                <DialogFooter>
                    <Button onClick={() => {
                        setOpen(false)
                        if (page == 'orders') {
                            getOrders()
                        }
                        if (page == 'bags') {
                            getBags()
                        }
                    }} className="me-auto px-7">Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default OrdersTruckDialog
