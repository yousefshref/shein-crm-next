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
import { Input } from '../ui/input'
import { SellersContextProvider } from '@/context/SellersContext'
import { UserContextProvider } from '@/app/context/UserContext'
import { BagContextProvider } from '@/context/BagContext'

const OrdersSearchDialog = ({ open, setOpen, page }) => {
    const {
        ordersParams,
        updateOrdersParams,

        getOrders,
    } = useContext(OrdersContextProvider)

    const {
        getBags,
        bagParams, updateBagParams
    } = useContext(BagContextProvider)

    // add search fields
    const { sellers } = useContext(SellersContextProvider)

    const {is_seller} = useContext(UserContextProvider)

    // select seller
    // filter bags that its orders has the seller inside it
    // get the total profit of the bags in total
    // get the total profit of the seller

    const [pageTitle, setPageTitle] = React.useState("");  

    useEffect(() => {
        if(page){
            setPageTitle(page);
        }
    }, [page]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-start">Filter with Basic Info</DialogTitle>
                </DialogHeader>
                {/* content */}
                <div className='flex flex-col gap-5'>
                    {is_seller ? null : (
                        <div className='flex flex-col gap-1'>
                            <p className='text-gray-500 text-sm'>Seller</p>
                            <select value={pageTitle == 'orders' ? ordersParams?.sales_id : bagParams?.seller} onChange={(e) => {
                                if(page=='orders'){
                                    updateOrdersParams('sales_id', e.target.value)
                                }else{
                                    updateBagParams('seller', e.target.value)
                                }
                            }} className='input-primary'>
                                <option value="">All Sellers</option>
                                <option value="no">Orders With No Sellers</option>
                                {sellers?.map((seller) => (
                                    <option key={seller?.id} value={seller?.id}>{seller?.user_username}</option>
                                ))}
                            </select>
                        </div>
                    )}
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
                        if(page == 'orders'){
                            getOrders()
                        }
                        if(page == 'bags'){
                            getBags()
                        }
                        setOpen(false)
                    }} className="me-auto px-7">Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default OrdersSearchDialog
