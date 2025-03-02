import { Plus } from 'lucide-react'
import React, { useEffect } from 'react'
import CreateOrUpdateShippingCourier from './CreateOrUpdateShippingCourier'
import axios from 'axios'
import { server } from '@/app/server'
import { toast } from 'sonner'

const ShippingCouriersSettings = () => {
    // get all
    const [loading, setLoading] = React.useState(true)
    useEffect(() => {
        setLoading(false)
    }, [])
    const [shippingCouriers, setShippingCouriers] = React.useState([])
    const getShippingCouriers = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${server}shipping-couriers/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            })
            setShippingCouriers(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getShippingCouriers()
    }, [])

    // create
    const [open, setOpen] = React.useState(false)
    // update
    const [shippingCourier, setShippingCourier] = React.useState({})
    // delete
    const deleteShippingCourier = async (id) => {
        try {
            setLoading(true)
            const res = await axios.delete(`${server}shipping-couriers/${id}/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            })
            toast.success("Shipping Courier deleted successfully")
            getShippingCouriers()
            setOpen(false)
        } catch (error) {
            toast.error("Error deleting Shipping Courier")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='flex flex-col'>
            <div className='flex items-center gap-5 justify-between mt-20'>
                <h3 className='text-2xl font-bold text-zinc-800'>Shipping Couriers</h3>
                <button onClick={() => {
                    setOpen(true)
                    setShippingCourier({})
                }} className='bg-[#51FF65] hover:bg-[#60ff72] text-white text-xl p-0.5 rounded-md flex flex-col justify-center items-center'>
                    <Plus />
                </button>
                <CreateOrUpdateShippingCourier setShippingCouriers={setShippingCouriers} deleteShippingCourier={deleteShippingCourier} getShippingCouriers={getShippingCouriers} shippingCourier={shippingCourier} open={open} setOpen={setOpen} />
            </div>
            <div className='mt-5 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 items-center gap-7'>
                {
                    loading ? (
                        <div className=''>Loading...</div>
                    ) :
                        shippingCouriers?.length == 0 ? (
                            <div className='col-span-4 text-center text-xl text-yellow-700 p-5 bg-yellow-100 rounded-xl'>
                                لا يوجد شركات شحن
                            </div>
                        ) :
                            shippingCouriers?.map((shipping, index) => {
                                return (
                                    <div
                                        key={index}
                                        onMouseEnter={() => {
                                            const underline = document.getElementById(`courier-${index}`)
                                            underline.style.width = '100%'
                                        }}
                                        onMouseLeave={() => {
                                            const underline = document.getElementById(`courier-${index}`)
                                            underline.style.width = '30%'
                                        }}
                                        onClick={() => {
                                            setShippingCourier(shipping)
                                            setOpen(true)
                                        }}
                                        className='flex flex-col gap-1 w-fit cursor-pointer'>
                                        <p>{shipping?.name}</p>
                                        <div id={`courier-${index}`} className='h-[2px] transition-all duration-500 bg-blue-500 w-[30%]' />
                                    </div>
                                )
                            })}
            </div>
        </div>
    )
}

export default ShippingCouriersSettings
