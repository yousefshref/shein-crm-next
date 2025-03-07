'use client'
import React, { useEffect } from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'
import { server } from '@/app/server'
import axios from 'axios'
import { toast } from 'sonner'


const CreateOrUpdateOrderStatuses = ({ setOrderStatuses, deleteOrderStatus, open, setOpen, orderStatus, getOrderStatus }) => {
    // create
    const [loading, setLoading] = React.useState(false)

    const [name, setName] = React.useState('')
    const createOrderStatus = async () => {
        try {
            setLoading(true)
            const res = await axios.post(`${server}order-statuses/`, {
                name
            })
            toast.success('Order Status created successfully')
            setName('')
            setOpen(false)
            setOrderStatuses(prev => [...prev, res.data])
        } catch (error) {
            console.error(error)
            toast.error('Error creating Order Status')
        } finally {
            setLoading(false)
        }
    }

    // update
    useEffect(() => {
        if (orderStatus) {
            setName(orderStatus.name)
        }
    }, [orderStatus])

    const updateOrderStatus = async () => {
        try {
            setLoading(true)
            const res = await axios.put(`${server}order-statuses/${orderStatus.id}/`, {
                name
            })
            toast.success('Order Status updated successfully')
            setName('')
            setOpen(false)
            getOrderStatus()
        } catch (error) {
            console.error(error)
            toast.error('Error updating Order Status')
        } finally {
            setLoading(false)
        }
    }


    return (
        <Drawer shouldScaleBackground open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className={'flex items-center flex-row w-full'}>
                    <DrawerTitle className={'text-end font-bold text-xl'}>
                        {orderStatus ? 'تعديل حاله الطلب' : 'إضافه حاله الطلب'}
                    </DrawerTitle>
                    {orderStatus?.id ? <Trash onClick={() => deleteOrderStatus(orderStatus.id)} size={35} className='p-2 ms-auto rounded-md bg-red-500 text-white transition-all duration-200 hover:bg-red-400 cursor-pointer' /> : null}
                </DrawerHeader>
                {/* content */}
                <div className='flex flex-col gap-4 p-4 h-[300px] overflow-y-scroll'>
                    <div className='flex flex-col gap-2'>
                        <p>اسم الحاله</p>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" className='input-primary' placeholder='اسم الحاله' />
                    </div>
                </div>
                <DrawerFooter>
                    <Button onClick={loading ? null : orderStatus?.id ? updateOrderStatus : createOrderStatus} variant="default" className="w-fit px-7">
                        {loading ? <p>جاري الحفظ...</p> : <p>حفظ</p>}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateOrUpdateOrderStatuses
