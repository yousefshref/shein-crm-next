'use client'
import axios from 'axios'
import React from 'react'
import { server } from '../server'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'

const page = () => {
    const [loading, setLoading] = React.useState(false)
    const [progress, setProgress] = React.useState(0)

    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')

    const login = async (e) => {
        e.preventDefault()
        setProgress(10)
        setLoading(true)
        try {
            setProgress(50)
            const res = await axios.post(`${server}login/`, {
                username,
                password
            })
            console.log(res);
            localStorage.setItem('token', res.data.token)
            if (res.data.user) {
                window.location.href = '/'
            }
            toast.success("Login successful")
        } catch (error) {
            console.error(error)
            toast.error("Check your credentials")
        } finally {
            setProgress(100)
            setLoading(false)
        }
    }
    return (
        <div className='h-screen relative flex flex-col justify-center items-center p-5'>
            {loading && (
                <div className='fixed w-full h-full top-0 left-0 z-10 bg-zinc-800/20'>
                    <Progress value={progress} />
                </div>
            )}

            <form onSubmit={login} className='flex flex-col gap-5 w-full max-w-[400px] mx-auto'>
                <div className='flex flex-col text-center gap-1'>
                    <h3 className='text-zinc-800 text-3xl font-bold'>LOGO</h3>
                    <p className='text-gray-500'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc fermentum
                    </p>
                </div>
                <div className='flex flex-col gap-5 w-full mt-10'>
                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        placeholder='username'
                        type="text"
                        className='p-1.5 px-2 bg-gray-100 w-full rounded-md'
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder='password'
                        type="password"
                        className='p-1.5 px-2 bg-gray-100 w-full rounded-md'
                    />
                    <button className='p-1.5 px-7 bg-blue-500 text-white w-fit rounded-md'>Login</button>
                </div>
            </form>
        </div>
    )
}

export default page
