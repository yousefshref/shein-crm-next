import React, { useContext } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { BagContextProvider } from '@/context/BagContext'

const CalendarDialog = ({ open, setOpen, }) => {
    const {
        bagParams, updateBagParams
    } = useContext(BagContextProvider)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-start">Filter By Date</DialogTitle>
                </DialogHeader>
                {/* content */}
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-1'>
                        <p className='text-gray-500 text-sm'>from</p>
                        <input onChange={(e) => {
                            updateBagParams('date_from', e.target.value)
                        }} value={bagParams?.date_from} type="date" className='p-1.5 px-3 bg-gray-100 rounded-md' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='text-gray-500 text-sm'>to</p>
                        <input onChange={(e) => updateBagParams('date_to', e.target.value)} value={bagParams?.date_to} type="date" className='p-1.5 px-3 bg-gray-100 rounded-md' />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)} className="me-auto px-7">Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CalendarDialog
