import { BagContextProvider } from '@/context/BagContext'
import React, { useContext, useEffect } from 'react'
import SearchDropdown from '../SearchDropdown'
import { SellersContextProvider } from '@/context/SellersContext'
import { Plus, Trash } from 'lucide-react'

const OrderDetailsComponent = ({ index, order }) => {
    const { updateOrderDetails, addNewOrderPiece, updateOrderPiece, deleteOrderPiece, deleteOrderDetails } = useContext(BagContextProvider)

    const { sellers } = useContext(SellersContextProvider)
    const [sellersNames, setSellersNames] = React.useState([])
    useEffect(() => {
        if (sellers.length > 0) {
            const names = sellers.map(seller => seller?.user_username)
            setSellersNames(names)
        }
    }, [sellers])

    return (
        <div className='relative flex flex-col gap-5 p-3 bg-gray-100 rounded-xl my-1'>
            <button onClick={() => deleteOrderDetails(index)} className='absolute right-3 top-2 flex w-fit flex-row items-center gap-2 cursor-pointer hover:bg-red-400 transition-all duration-300 p-1 rounded-full justify-center text-white bg-red-500'>
                <Trash size={20} />
            </button>
            <div className='flex flex-col gap-2'>
                <p className='font-medium text-blue-500'>Customer Details</p>
                <div className='grid grid-cols-3 gap-5'>
                    <div className='flex flex-col gap-1'>
                        <p>Customer Name</p>
                        <input className='input-white' type="text" value={order?.customer_name} onChange={(e) => updateOrderDetails(index, 'customer_name', e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p>Customer Number</p>
                        <input className='input-white' type="text" value={order?.customer_number} onChange={(e) => updateOrderDetails(index, 'customer_number', e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p>Notes</p>
                        <input className='input-white' type="text" value={order?.customer_note} onChange={(e) => updateOrderDetails(index, 'customer_note', e.target.value)} />
                    </div>
                </div>
                <div>
                    <div className='flex flex-col gap-1'>
                        <p>Address</p>
                        <textarea
                            className='input-white'
                            type="text"
                            value={order?.address}
                            onChange={(e) => updateOrderDetails(index, 'address', e.target.value)}
                        />
                    </div>
                </div>
                <hr className='mt-7' />
                <div className='flex flex-col gap-1 my-3'>
                    <p>Pieces</p>
                    {/* json field also */}
                    {
                        order?.pieces?.length > 0 ?
                            order?.pieces?.map((piece, i) => (
                                <div onDoubleClick={() => deleteOrderPiece(index, i)} key={i} className='p-2 grid grid-cols-3 gap-10'>
                                    <div className='flex flex-col gap-1 col-span-1'>
                                        <p>Product Name</p>
                                        <input
                                            type="text"
                                            className='input-white'
                                            value={piece?.name}
                                            onChange={(e) => updateOrderPiece(index, i, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-1 col-span-1'>
                                        <p>Product Code</p>
                                        <input
                                            type="text"
                                            className='input-white'
                                            value={piece?.code}
                                            onChange={(e) => updateOrderPiece(index, i, 'code', e.target.value)}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-1 col-span-1'>
                                        <p>Product Price</p>
                                        <div className='relative'>
                                            <input
                                                type="text"
                                                className='input-white w-full'
                                                value={piece?.price_in_egp}
                                                onChange={(e) => updateOrderPiece(index, i, 'price_in_egp', e.target.value)}
                                            />
                                            <span className='absolute right-2 top-1 text-gray-800'>EGP</span>
                                        </div>
                                        <div className='relative'>
                                            <input
                                                type="text"
                                                className='input-white w-full'
                                                value={piece?.price_in_sar}
                                                onChange={(e) => updateOrderPiece(index, i, 'price_in_sar', e.target.value)}
                                            />
                                            <span className='absolute right-2 top-1 text-gray-800'>SAR</span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className='p-2 py-3 rounded-xl bg-yellow-100 text-yellow-500 text-lg'>
                                    No pieces, Add pieces with the plus icon
                                </div>
                            )
                    }
                    <button onClick={() => addNewOrderPiece(index)} className='mt-2 flex pe-5 w-fit px-3 flex-row items-center gap-2 cursor-pointer hover:bg-green-400 transition-all duration-300 p-1.5 rounded-full justify-center text-white bg-green-500'>
                        <Plus size={20} />
                        <p>Add Piece</p>
                    </button>
                </div>
                <hr />
            </div>

            {/*  */}
            <div className='flex flex-col gap-2 mt-3'>
                <p className='font-medium text-blue-500'>Order Status</p>
                <div className='flex flex-col gap-1'>
                    <p>Seller</p>
                    <SearchDropdown items={sellersNames} placeholder='Select Seller...' onSelect={(e) => updateOrderDetails(index, 'seller', e)} />
                </div>
                <div className='grid grid-cols-2 gap-5'>
                    <div className='flex flex-col gap-2'>
                        <p>Paid</p>
                        <div className='relative flex flex-col gap-1'>
                            <input
                                value={order?.paid_in_egp}
                                onChange={(e) => updateOrderDetails(index, 'paid_in_egp', +e.target.value)}
                                type="number" className='input-white'
                            />
                            <span className='absolute right-2 top-1.5 font-bold'>EGP</span>
                        </div>
                        <div className='relative flex flex-col gap-1'>
                            <input
                                value={order?.paid_in_sar}
                                onChange={(e) => updateOrderDetails(index, 'paid_in_sar', +e.target.value)}
                                type="number" className='input-white'
                            />
                            <span className='absolute right-2 top-1.5 font-bold'>SAR</span>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p>Remaining</p>
                        <div className='relative'>
                            <input
                                value={order?.remaining_in_egp}
                                onChange={(e) => updateOrderDetails(index, 'remaining_in_egp', e.target.value)}
                                type="number" className='input-white w-full'
                            />
                            <span className='absolute right-2 top-1.5 font-bold'>EGP</span>
                        </div>
                        <div className='relative'>
                            <input
                                value={order?.remaining_in_sar}
                                onChange={(e) => updateOrderDetails(index, 'remaining_in_sar', e.target.value)}
                                type="number" className='input-white w-full'
                            />
                            <span className='absolute right-2 top-1.5 font-bold'>SAR</span>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-5 mt-5'>
                    <div className='flex flex-row items-center gap-2'>
                        <input
                            checked={order?.is_delivered}
                            onChange={(e) => updateOrderDetails(index, 'is_delivered', e.target.checked)}
                            type="checkbox"
                            className='input-white'
                        />
                        <p>Is Deliverd</p>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                        <input
                            checked={order?.is_collected}
                            onChange={(e) => updateOrderDetails(index, 'is_collected', e.target.checked)}
                            type="checkbox"
                            className='input-white'
                        />
                        <p>Is Collected</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailsComponent
