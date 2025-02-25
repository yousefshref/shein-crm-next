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


const CreateOrUpdateShippingCourier = ({ deleteShippingCourier, open, setOpen, shippingCourier, getShippingCouriers }) => {
    // create
    const [loading, setLoading] = React.useState(false)

    const [name, setName] = React.useState('')
    const createShippingCourier = async () => {
        try {
            setLoading(true)
            const res = await axios.post(`${server}shipping-couriers/`, {
                name
            })
            toast.success('Shipping Courier created successfully')
            setName('')
            setOpen(false)
        } catch (error) {
            console.error(error)
            toast.error('Error creating Shipping Courier')
        } finally {
            setLoading(false)
        }
    }

    // update
    useEffect(() => {
        if (shippingCourier) {
            setName(shippingCourier.name)
        }
    }, [shippingCourier])

    const updateShippingCourier = async () => {
        try {
            setLoading(true)
            const res = await axios.put(`${server}shipping-couriers/${shippingCourier.id}/`, {
                name
            })
            toast.success('Shipping Courier updated successfully')
            setName('')
            setOpen(false)
            getShippingCouriers()
        } catch (error) {
            console.error(error)
            toast.error('Error updating Shipping Courier')
        } finally {
            setLoading(false)
        }
    }


    return (
        <Drawer shouldScaleBackground open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className={'flex items-center flex-row w-full'}>
                    <DrawerTitle className={'text-end font-bold text-xl'}>
                        {shippingCourier ? 'تعديل شركة شحن' : 'إضافه شركة شحن'}
                    </DrawerTitle>
                    {shippingCourier?.id ? <Trash onClick={() => deleteShippingCourier(shippingCourier.id)} size={35} className='p-2 ms-auto rounded-md bg-red-500 text-white transition-all duration-200 hover:bg-red-400 cursor-pointer' /> : null}
                </DrawerHeader>
                {/* content */}
                <div className='flex flex-col gap-4 p-4 h-[300px] overflow-y-scroll'>
                    <div className='flex flex-col gap-2'>
                        <p>اسم الشركة</p>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" className='input-primary' placeholder='اسم الشركة' />
                    </div>
                </div>
                <DrawerFooter>
                    <Button onClick={loading ? null : shippingCourier?.id ? updateShippingCourier : createShippingCourier} variant="default" className="w-fit px-7">
                        {loading ? <p>جاري الحفظ...</p> : <p>حفظ</p>}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateOrUpdateShippingCourier
