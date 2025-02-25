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

const OrdersSearchDialog = ({ open, setOpen }) => {
    const {
        sales_id, setSalesId,
        customer_name_param, setCustomerName_param,
        customer_phone_param, setCustomerPhone_param,
        customer_wp_param, setCustomerWp_param,

        getOrders,
    } = useContext(OrdersContextProvider)

    // add search fields
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


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-end">فلتر الطلبات بالمعلومات الاساسية</DialogTitle>
                </DialogHeader>
                {/* content */}
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-1'>
                        <p className='text-gray-500 text-sm'>سيلز معين</p>
                        <select value={sales_id} onChange={(e) => setSalesId(e.target.value)} className='input-primary'>
                            <option value="">جميع الطبات</option>
                            {salesList?.map((sale) => (
                                <option key={sale?.id} value={sale?.id}>{sale?.user_username}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='text-gray-500 text-sm'>الاسم</p>
                        <Input value={customer_name_param} onChange={(e) => setCustomerName_param(e.target.value)} placeholder='اسم العميل' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='text-gray-500 text-sm'>رقم الهاتف</p>
                        <Input value={customer_phone_param} onChange={(e) => setCustomerPhone_param(e.target.value)} placeholder='رقم الهاتف' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='text-gray-500 text-sm'>واتس اب</p>
                        <Input value={customer_wp_param} onChange={(e) => setCustomerWp_param(e.target.value)} placeholder='واتس اب' />
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

export default OrdersSearchDialog
