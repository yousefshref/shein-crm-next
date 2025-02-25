import React, { useContext } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { OrdersContextProvider } from '@/context/OrdersContext'

const CalendarDialog = ({ open, setOpen }) => {
    const {
        date_from_str, setDateFrom,
        date_to_str, setDateTo,
    } = useContext(OrdersContextProvider)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-end">فلتر الطلبات بالتاريخ</DialogTitle>
                </DialogHeader>
                {/* content */}
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-1'>
                        <p className='text-gray-500 text-sm'>من</p>
                        <input onChange={(e) => setDateFrom(e.target.value)} value={date_from_str} type="date" className='p-1.5 px-3 bg-gray-100 rounded-md' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='text-gray-500 text-sm'>الى</p>
                        <input onChange={(e) => setDateTo(e.target.value)} value={date_to_str} type="date" className='p-1.5 px-3 bg-gray-100 rounded-md' />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)} className="me-auto px-7">تم</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CalendarDialog
