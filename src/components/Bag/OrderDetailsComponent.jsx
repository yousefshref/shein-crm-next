import { BagContextProvider } from '@/context/BagContext'
import React, { useContext, useEffect } from 'react'
import SearchDropdown from '../SearchDropdown'
import { SellersContextProvider } from '@/context/SellersContext'
import { DeleteIcon, ImageIcon, Plus, Trash, Trash2Icon } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { formatNumber } from '@/lib/utils'

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

const OrderDetailsComponent = ({ index, order, disabled, clickedOrder=null }) => {
    const { updateOrderDetails, addNewOrderPiece, updateOrderPiece, deleteOrderPiece, deleteOrderDetails, deleteOrderPieceImage } = useContext(BagContextProvider)

    const { sellers } = useContext(SellersContextProvider)
    const [sellersNames, setSellersNames] = React.useState([])
    useEffect(() => {
        if (sellers.length > 0) {
            const names = sellers.map(seller => seller?.user_username)
            setSellersNames(names)
            console.log(names);
        }
    }, [sellers])

    useEffect(() => {
        if (clickedOrder && clickedOrder !== null) {
            const element = document.querySelector(`#orderDetails-${clickedOrder?.id}`)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
                console.log('exist element');   
            }else{
                console.log('not exist element');   
            }
        }
    }, [clickedOrder])

    return (
        <Collapsible id={`orderDetails-${order?.id}`}>
            <CollapsibleTrigger className={`p-3 text-start bg-blue-100 rounded-xl w-full grid grid-cols-3 ${clickedOrder?.id == order?.id ? "bg-blue-500 text-white" : ""}`}>
                <div className='flex flex-col -space-y-1'>
                    <p className={`text-sm ${clickedOrder?.id == order?.id ? "text-gray-300" : "text-gray-500"}`}>Pieces No.</p>
                    <p>{order?.how_many_pices || order?.pieces?.length}</p>
                </div>
                <div className='flex flex-col -space-y-1'>
                    <p className={`text-sm ${clickedOrder?.id == order?.id ? "text-gray-300" : "text-gray-500"}`}>Number</p>
                    <p>{order?.customer_number}</p>
                </div>
                <div className='flex flex-col -space-y-1'>
                    <p className={`text-sm ${clickedOrder?.id == order?.id ? "text-gray-300" : "text-gray-500"}`}>Total</p>
                    <p>{formatNumber(order?.pieces?.reduce((total, orderPiece) => total + Number(orderPiece?.price_in_egp), 0) || 0)} EGP</p>
                    {/* <p>{formatNumber(order?.pieces?.reduce((total, orderPiece) => total + Number(orderPiece?.price_in_sar), 0) || 0)} SAR</p> */}
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className='relative flex flex-col gap-5 p-3 bg-gray-100 rounded-xl my-1'>
                    {disabled ? null : <button onClick={() => deleteOrderDetails(index)} className='absolute right-3 top-2 flex w-fit flex-row items-center gap-2 cursor-pointer hover:bg-red-400 transition-all duration-300 p-1 rounded-full justify-center text-white bg-red-500'>
                        <Trash size={20} />
                    </button>}
                    <div className='flex flex-col gap-2'>
                        <p className='font-medium text-blue-500'>Customer Details</p>
                        <div className='grid grid-cols-3 gap-5'>
                            {/* <div className='flex flex-col gap-1'>
                                <p>Customer Name</p>
                                <input className={`input-white ${disabled ? "cursor-not-allowed" : ""}`} disabled={disabled} type="text" value={order?.customer_name} onChange={(e) => updateOrderDetails(index, 'customer_name', e.target.value)} />
                            </div> */}
                            <div className='flex flex-col gap-1'>
                                <p>Customer Number</p>
                                <input className={`input-white ${disabled ? "cursor-not-allowed" : ""}`} disabled={disabled} type="text" value={order?.customer_number} onChange={(e) => updateOrderDetails(index, 'customer_number', e.target.value)} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <p>Notes</p>
                                <input className={`input-white ${disabled ? "cursor-not-allowed" : ""}`} disabled={disabled} type="text" value={order?.customer_note} onChange={(e) => updateOrderDetails(index, 'customer_note', e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <div className='flex flex-col gap-1'>
                                <p>Address</p>
                                <textarea
                                    className={`input-white ${disabled ? "cursor-not-allowed" : ""}`} disabled={disabled}
                                    type="text"
                                    value={order?.address}
                                    onChange={(e) => updateOrderDetails(index, 'address', e.target.value)}
                                />
                            </div>
                        </div>
                        <hr className='mt-7' />
                        <div className='flex flex-col gap-1 my-3'>
                            <p className='font-medium text-blue-500'>Pieces</p>
                            <div className='flex flex-col'>
                                <p className='text-sm'>
                                    How Many Pieces
                                </p>
                                <input
                                    className={`input-white ${disabled ? "cursor-not-allowed" : ""}`} disabled={disabled}
                                    type="number"
                                    value={order?.how_many_pices || 0}
                                    onChange={(e) => updateOrderDetails(index, 'how_many_pices', e.target.value)}
                                />
                            </div>
                            {/* json field also */}
                            {
                                order?.pieces?.length > 0 ?
                                    order?.pieces?.map((piece, pieceIndex) => (
                                        <div key={pieceIndex} className='relative mt-1 p-3 bg-blue-100 rounded-xl'>
                                            <Trash2Icon className='absolute top-2 right-2 text-red-500 cursor-pointer' size={15} onClick={() => deleteOrderPiece(index, pieceIndex)} />
                                            {/* images */}
                                            <Swiper
                                                slidesPerView={'auto'}
                                                spaceBetween={20}
                                                pagination={{ clickable: true }}
                                                className="mySwiper"
                                            >
                                                <SwiperSlide
                                                    className='cursor-pointer relative flex flex-col justify-center items-center w-full max-w-[100px] min-h-[100px] max-h-[100px] bg-gray-300 rounded-xl'
                                                    onClick={() => {
                                                        if (!disabled) {
                                                            const input = document.createElement('input');
                                                            input.type = 'file';
                                                            input.accept = 'image/*';
                                                            input.multiple = true; // Allow multiple file selection
                                                            input.onchange = async (e) => {
                                                                const files = e.target.files;
                                                                if (files.length) {
                                                                    const uploadedImages = [];
                                                                    for (const file of files) {
                                                                        const formData = new FormData();
                                                                        formData.append('image', file);
                                                                        try {
                                                                            const response = await fetch('https://api.imgbb.com/1/upload?key=e4b8ad3db37cc93ecaf2897f75edc685', {
                                                                                method: 'POST',
                                                                                body: formData
                                                                            });
                                                                            const result = await response.json();
                                                                            if (result.success) {
                                                                                uploadedImages.push(result.data.url);
                                                                            }
                                                                        } catch (error) {
                                                                            console.error('Error uploading image:', error);
                                                                        }
                                                                    }
                                                                    if (uploadedImages.length) {
                                                                        updateOrderPiece(index, pieceIndex, 'images', [...uploadedImages, ...piece?.images]);
                                                                    }
                                                                }
                                                            };
                                                            input.click();
                                                        }
                                                    }}
                                                    onDragOver={(e) => e.preventDefault()} // Allow drag-over effect
                                                    onDrop={async (e) => {
                                                        e.preventDefault();
                                                        if (!disabled) {
                                                            const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
                                                            if (files.length) {
                                                                const uploadedImages = [];
                                                                for (const file of files) {
                                                                    const formData = new FormData();
                                                                    formData.append('image', file);
                                                                    try {
                                                                        const response = await fetch('https://api.imgbb.com/1/upload?key=e4b8ad3db37cc93ecaf2897f75edc685', {
                                                                            method: 'POST',
                                                                            body: formData
                                                                        });
                                                                        const result = await response.json();
                                                                        if (result.success) {
                                                                            uploadedImages.push(result.data.url);
                                                                        }
                                                                    } catch (error) {
                                                                        console.error('Error uploading image:', error);
                                                                    }
                                                                }
                                                                if (uploadedImages.length) {
                                                                    updateOrderPiece(index, pieceIndex, 'images', [...uploadedImages, ...piece?.images]);
                                                                }
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <ImageIcon size={40} className='text-white absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2' />
                                                </SwiperSlide>

                                                {piece?.images?.map((image, i) => (
                                                    <SwiperSlide key={i} className='relative cursor-pointer w-full max-w-[100px]'>
                                                        <img src={image || ""} alt="" />
                                                        <DeleteIcon size={20} className='text-white absolute top-1 right-1 cursor-pointer' onClick={() => deleteOrderPieceImage(index, pieceIndex, i)} />
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                            {/* content */}
                                            <div className='grid grid-cols-2 gap-5 mt-3'>
                                                <div className='flex flex-col gap-1 col-span-1'>
                                                    <p>Product Code</p>
                                                    <input
                                                        type="text"
                                                        className={`input-white ${disabled ? "cursor-not-allowed" : ""}`} disabled={disabled}
                                                        value={piece?.code}
                                                        onChange={(e) => updateOrderPiece(index, pieceIndex, 'code', e.target.value)}
                                                    />
                                                </div>
                                                <div className='flex flex-col gap-1 col-span-1'>
                                                    <p>Product Price</p>
                                                    <div className='relative'>
                                                        <input
                                                            type="text"
                                                            className={`input-white w-full ${disabled ? "cursor-not-allowed" : ""}`}
                                                            value={piece?.price_in_egp}
                                                            onChange={(e) => updateOrderPiece(index, pieceIndex, 'price_in_egp', e.target.value)}
                                                        />
                                                        <span className='absolute right-2 top-1 text-gray-800'>EGP</span>
                                                    </div>
                                                    {/* <div className='relative'>
                                                        <input
                                                            type="text"
                                                            className={`input-white w-full ${disabled ? "cursor-not-allowed" : ""}`}
                                                            value={piece?.price_in_sar}
                                                            onChange={(e) => updateOrderPiece(index, pieceIndex, 'price_in_sar', e.target.value)}
                                                        />
                                                        <span className='absolute right-2 top-1 text-gray-800'>SAR</span>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className='p-2 py-3 rounded-xl bg-yellow-100 text-yellow-500 text-lg'>
                                            No pieces, Add pieces with the plus icon
                                        </div>
                                    )
                            }
                            {!disabled && <button onClick={() => addNewOrderPiece(index)} className='flex pe-5 w-fit px-3 flex-row items-center gap-2 cursor-pointer hover:bg-green-400 transition-all duration-300 p-1.5 rounded-full justify-center text-white bg-green-500'>
                                <Plus size={20} />
                                <p>Add Piece</p>
                            </button>}
                        </div>
                        <hr />
                    </div>

                    {/*  */}
                    <div className='flex flex-col gap-2 mt-3'>
                        <p className='font-medium text-blue-500'>Order Status</p>
                        <div className='flex flex-col gap-1'>
                            <p>Seller</p>
                            {/* <SearchDropdown defaultValue={sellers.find(seller => seller.id == order?.seller)?.user_username || ""} disabled={disabled} items={sellersNames} placeholder='Select Seller...' onSelect={(e) => updateOrderDetails(index, 'seller', e)} /> */}
                            <select disabled={disabled} value={order?.seller_name} onChange={(e) => updateOrderDetails(index, 'seller', e.target.value)} className='input-white'>
                                <option value={""}>{"Select Seller..."}</option>
                                {sellers?.map((seller) => (
                                    <option key={seller?.id} value={seller?.user_username}>{seller?.user_username}</option>
                                ))}
                            </select>
                        </div>
                        <div className='grid grid-cols-2 gap-5'>
                            <div className='flex flex-col gap-2'>
                                <p>Paid</p>
                                <div className='relative flex flex-col gap-1'>
                                    <input
                                        value={order?.paid_in_egp}
                                        onChange={(e) => updateOrderDetails(index, 'paid_in_egp', Number(e.target.value))}
                                        type="number" className={`input-white w-full ${disabled ? "cursor-not-allowed" : ""}`} disabled={disabled}
                                    />
                                    <span className='absolute right-2 top-1.5 font-bold'>EGP</span>
                                </div>
                                {/* <div className='relative flex flex-col gap-1'>
                            <input
                                value={order?.paid_in_sar}
                                onChange={(e) => updateOrderDetails(index, 'paid_in_sar', +e.target.value)}
                                type="number" className={`input-white ${disabled ? "cursor-not-allowed" : ""}`} disabled={disabled}
                            />
                            <span className='absolute right-2 top-1.5 font-bold'>SAR</span>
                        </div> */}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p>Remaining</p>
                                <div className='relative'>
                                    <input
                                        disabled={disabled}
                                        value={order?.remaining_in_egp}
                                        onChange={(e) => updateOrderDetails(index, 'remaining_in_egp', Number(e.target.value))}
                                        type="number" className={`input-white w-full ${disabled ? "cursor-not-allowed" : ""}`}
                                    />
                                    <span className='absolute right-2 top-1.5 font-bold'>EGP</span>
                                </div>
                                {/* <div className='relative'>
                            <input
                                value={order?.remaining_in_sar}
                                onChange={(e) => updateOrderDetails(index, 'remaining_in_sar', e.target.value)}
                                type="number" className={`input-white w-full ${disabled ? "cursor-not-allowed" : ""}`}
                            />
                            <span className='absolute right-2 top-1.5 font-bold'>SAR</span>
                        </div> */}
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-5 mt-5'>
                            <div className='flex flex-row items-center gap-2'>
                                <input
                                    checked={order?.is_delivered}
                                    onChange={(e) => updateOrderDetails(index, 'is_delivered', e.target.checked)}
                                    type="checkbox"
                                    className={`input-white ${disabled ? "cursor-not-allowed" : ""}`} disabled={disabled}
                                />
                                <p>Is Deliverd</p>
                            </div>
                            <div className='flex flex-row items-center gap-2'>
                                <input
                                    checked={order?.is_collected}
                                    onChange={(e) => updateOrderDetails(index, 'is_collected', e.target.checked)}
                                    type="checkbox"
                                    className={`input-white ${disabled ? "cursor-not-allowed" : ""}`} disabled={disabled}
                                />
                                <p>Is Collected</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}

export default OrderDetailsComponent
