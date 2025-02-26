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
import axios from 'axios'
import { toast } from 'sonner'
import { server } from '@/app/server'


const CreateOrUpdateEmployee = ({ open, setOpen, employee, deleteEmployee, getEmployees }) => {
    const [loading, setLoading] = React.useState(false)

    const [username, setUsername] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [role, setRole] = React.useState('seller')

    const createSeller = async () => {
        setLoading(true)
        try {
            const res = await axios.post(`${server}user-sales/create/`, {
                "user": {
                    username,
                    password,
                },
                "sales": {
                    role
                },
            })
            toast.success('Employee created successfully')
            setOpen(false)
            getEmployees()
        } catch (error) {
            console.error(error)
            toast.error('Error creating employee')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (employee && open) {
            setUsername(employee?.user_username)
        }
    }, [employee, open])


    return (
        <Drawer shouldScaleBackground open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className={'flex items-center flex-row w-full'}>
                    <DrawerTitle className={'text-end font-bold text-xl'}>
                        {employee?.id ? 'تعديل موظف' : 'إضافه موظف جديد'}
                    </DrawerTitle>
                    {employee?.id ? (
                        <Trash onClick={() => deleteEmployee(employee?.id)} size={35} className='p-2 ms-auto rounded-md bg-red-500 text-white transition-all duration-200 hover:bg-red-400 cursor-pointer' />
                    ) : (
                        null
                    )}
                </DrawerHeader>
                {/* content */}
                <div className='flex flex-col gap-4 p-4 h-[300px] overflow-y-scroll'>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        اسم المستخدم
                        <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1.5" placeholder="الاسم" />
                    </label>
                    {employee?.id ? null : (
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            كلمة المرور
                            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-1.5" placeholder="كلمة المرور" />
                        </label>
                    )}
                </div>
                <DrawerFooter>
                    <Button onClick={createSeller} variant="default" className="w-fit px-7">
                        <p>حفظ</p>
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateOrUpdateEmployee
