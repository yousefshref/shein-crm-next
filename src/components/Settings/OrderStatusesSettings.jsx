import { Plus } from 'lucide-react'
import React, { useEffect } from 'react'
import CreateOrUpdateOrderStatuses from './CreateOrUpdateOrderStatuses'
import axios from 'axios'
import { server } from '@/app/server'
import { toast } from 'sonner'

const OrderStatusesSettings = () => {
    // get all
    const [loading, setLoading] = React.useState(true);

    const [orderStatuses, setOrderStatuses] = React.useState([]);

    const getOrderStatuses = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${server}order-statuses/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            });
            setOrderStatuses(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrderStatuses();
    }, []);

    // create
    const [open, setOpen] = React.useState(false);
    // update
    const [orderStatus, setOrderStatus] = React.useState({});
    // delete
    const deleteOrderStatus = async (id) => {
        try {
            setLoading(true);
            const res = await axios.delete(`${server}order-statuses/${id}/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            });
            toast.success("Order Status deleted successfully");
            getOrderStatuses();
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Error deleting Order Status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col'>
            <div className='flex items-center gap-5 justify-between mt-20'>
                <h3 className='text-2xl font-bold text-zinc-800'>حالات الطلبات</h3>
                <button onClick={() => {
                    setOpen(true)
                    setOrderStatus({})
                }} className='bg-[#51FF65] hover:bg-[#60ff72] text-white text-xl p-0.5 rounded-md flex flex-col justify-center items-center'>
                    <Plus />
                </button>
                <CreateOrUpdateOrderStatuses setOrderStatuses={setOrderStatuses} deleteOrderStatus={deleteOrderStatus} getOrderStatus={getOrderStatuses} orderStatus={orderStatus} open={open} setOpen={setOpen} />
            </div>
            <div className='mt-5 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 items-center gap-7'>
                {
                    loading ? (
                        <div className=''>Loading...</div>
                    ) :
                        orderStatuses?.length == 0 ? (
                            <div className='col-span-4 text-center text-xl text-yellow-700 p-5 bg-yellow-100 rounded-xl'>
                                لا يوجد حالات
                            </div>
                        ) :
                            orderStatuses?.map((status, index) => {
                                return (
                                    <div
                                        key={index}
                                        onMouseEnter={() => {
                                            const underline = document.getElementById(`status-${index}`)
                                            underline.style.width = '100%'
                                        }}
                                        onMouseLeave={() => {
                                            const underline = document.getElementById(`status-${index}`)
                                            underline.style.width = '30%'
                                        }}
                                        onClick={() => {
                                            setOrderStatus(status)
                                            setOpen(true)
                                        }}
                                        className='flex flex-col gap-1 w-fit cursor-pointer'>
                                        <p>{status?.name}</p>
                                        <div id={`status-${index}`} className='h-[2px] transition-all duration-500 bg-blue-500 w-[30%]' />
                                    </div>
                                )
                            })}
            </div>
        </div>
    )
}

export default OrderStatusesSettings
