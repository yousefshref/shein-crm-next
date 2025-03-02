'use client'
import DashboardLayout from '@/components/DashboardLayout'
import CreateOrUpdateEmployee from '@/components/Order/CreateOrUpdateEmployee'
import { Progress } from '@/components/ui/progress'
import axios from 'axios'
import { Plus } from 'lucide-react'
import React, { useEffect } from 'react'
import { server } from '../server'
import { toast } from 'sonner'
import ShippingCouriersSettings from '@/components/Settings/ShippingCouriersSettings'
import OrderStatusesSettings from '@/components/Settings/OrderStatusesSettings'

const page = () => {
    const [open, setOpen] = React.useState(false)

    const [loading, setLoading] = React.useState(true)
    const [progress, setProgress] = React.useState(0)
    useEffect(() => {
        setProgress(30)
        setLoading(false)
        setProgress(100)
    }, [])

    // display employees
    const [employees, setEmployees] = React.useState([])
    const getEmployees = async () => {
        setLoading(true)
        setProgress(30)
        try {
            const res = await axios.get(`${server}sales/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            })
            setLoading(false)
            setEmployees(res.data)
        } catch (error) {
            console.error(error)
        } finally {
            setProgress(100)
        }
    }
    useEffect(() => {
        getEmployees()
    }, [])
    // get employee
    const [employee, setEmployee] = React.useState({})
    // delete employee
    const deleteEmployee = async (id) => {
        setLoading(true)
        try {
            const res = await axios.delete(`${server}sales/${id}/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            })
            toast.success("Employee deleted successfully")
            getEmployees()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }
    return (
        <DashboardLayout>
            <div className={`flex flex-col ${open ? 'scale-95' : ''} transition-all duration-300`}>
                {loading && (
                    <div className='fixed w-full h-full top-0 left-0 z-[100] bg-zinc-800/20'>
                        <Progress value={progress} />
                    </div>
                )}
                {/* employees */}
                <div className='flex items-center gap-5 justify-between mt-10'>
                    <h3 className='text-2xl font-bold text-zinc-800'>Employees</h3>
                    <button onClick={() => {
                        setOpen(true)
                        setEmployee({})
                    }} className='bg-[#51FF65] hover:bg-[#60ff72] text-white text-2xl p-0.5 rounded-md flex flex-col justify-center items-center'>
                        <Plus />
                    </button>
                    <CreateOrUpdateEmployee getEmployees={getEmployees} deleteEmployee={deleteEmployee} employee={employee} open={open} setOpen={setOpen} />
                </div>
                <div className='grid md:grid-cols-3 grid-cols-2 items-center gap-7 mt-5'>
                    {
                        employees?.length == 0 ? (
                            <div className='col-span-3 text-center text-xl text-yellow-700 p-5 bg-yellow-100 rounded-xl'>
                                لا يوجد موظفين
                            </div>
                        ) :
                            employees?.map((employee, index) => (
                                <div onClick={() => {
                                    setEmployee(employee)
                                    setOpen(true)
                                }} key={index} className='md:col-span-1 cursor-pointer bg-gray-100 p-1.5 px-4 rounded-xl flex items-center gap-4'>
                                    <img className='md:w-16 w-12 md:h-16 h-1w-12 rounded-md' src="https://i.pinimg.com/736x/20/af/45/20af4549c7ddbe0e465c860f8d63e5e1.jpg" alt="text" />
                                    <div className='flex flex-col'>
                                        <p className='font-bold md:text-base text-sm'>{employee?.user_username}</p>
                                    </div>
                                </div>
                            ))}
                </div>



                {/* shippig courier */}
                <ShippingCouriersSettings />

                {/* order statuses */}
                {/* <OrderStatusesSettings /> */}
            </div>
        </DashboardLayout>
    )
}

export default page
