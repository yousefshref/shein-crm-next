'use client'
import { server } from '@/app/server'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const BagContext = ({ children }) => {

    const [open, setOpen] = React.useState(false)


    const [loading, setLoading] = React.useState(true)
    const [progress, setProgress] = React.useState(0)

    useEffect(() => {
        setProgress(30)
        setLoading(false)
        setProgress(100)
    }, [])

    const getLast7Days = () => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split('T')[0];
    };

    const getToday = () => {
        return new Date().toISOString().split('T')[0];
    };

    const [bags, setBags] = React.useState([])

    const [bagParams, setBagParams] = React.useState({
        date_from: getLast7Days(),
        date_to: getToday(),

        shipping_company: '',
    })


    const updateBagParams = (key, value) => {
        setBagParams({ ...bagParams, [key]: value })
    }

    const getBags = async () => {
        if (localStorage.getItem('token')) {
            setLoading(true)
            setProgress(30)
            try {
                const res = await axios.get(`${server}bags/`, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`
                    },
                    params: bagParams
                })
                setProgress(50)
                setBags(res.data)
            } catch (error) {
                console.error(error)
                if (error.response.status === 401) {
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                    toast.error("You're not logged in")
                }
            } finally {
                setLoading(false)
                setProgress(100)
            }
        }
    }

    useEffect(() => {
        getBags()
    }, [bagParams])




    const [bagDetails, setBagDetails] = React.useState({
        name: '',
        date: '',
        weight: 0,
        shipping_company: '',
        shipping_cost_in_egp: 0,
        shipping_cost_in_sar: 0,
        price_in_egp: 0,
        price_in_sar: 0,
        profit_in_egp: 0,
        profit_in_sar: 0,
        xg: '',
        discount_in_egp: 0,
        discount_in_sar: 0,
    })
    const [ordersDetails, setOrdersDetails] = React.useState([])

    const updateBagDetails = (key, value) => {
        setBagDetails({ ...bagDetails, [key]: value })
    }

    const updateOrderDetails = (index, key, value) => {
        const newOrdersDetails = [...ordersDetails]
        newOrdersDetails[index][key] = value

        if (key === 'paid_in_egp' || key === 'paid_in_sar') {
            const order_products_price_in_egp = newOrdersDetails[index]?.pieces?.reduce((acc, piece) => acc + piece.price_in_egp, 0)
            const order_products_price_in_sar = newOrdersDetails[index]?.pieces?.reduce((acc, piece) => acc + piece.price_in_sar, 0)

            newOrdersDetails[index].remaining_in_egp = order_products_price_in_egp - value
            newOrdersDetails[index].remaining_in_sar = order_products_price_in_sar - value
        }


        setOrdersDetails(newOrdersDetails)
    }

    const deleteOrderDetails = (index) => {
        const newOrdersDetails = [...ordersDetails]
        newOrdersDetails.splice(index, 1)
        setOrdersDetails(newOrdersDetails)
    }

    const addNewOrderDetails = () => {
        setOrdersDetails([{
            customer_name: '',
            customer_number: '',
            how_many_pices: 0,
            pieces: [],
            paid_in_egp: 0,
            paid_in_sar: 0,
            remaining_in_egp: 0,
            remaining_in_sar: 0,
            seller: '',
            is_delivered: false,
            is_collected: false,
            customer_note: '',
            address: '',
        }, ...ordersDetails])
    }

    const addNewOrderPiece = (index) => {
        const newOrdersDetails = [...ordersDetails]
        newOrdersDetails[index].pieces.push({ images: [], name: '', code: "", price_in_egp: 0, price_in_sar: 0 })
        setOrdersDetails(newOrdersDetails)
    }

    const deleteOrderPiece = (orderIndex, pieceIndex) => {
        const newOrdersDetails = [...ordersDetails]
        newOrdersDetails[orderIndex].pieces.splice(pieceIndex, 1)
        setOrdersDetails(newOrdersDetails)
    }

    const updateOrderPiece = (orderIndex, pieceIndex, key, value) => {
        const newOrdersDetails = [...ordersDetails]
        newOrdersDetails[orderIndex].pieces[pieceIndex][key] = value
        setOrdersDetails(newOrdersDetails)
    }

    const deleteOrderPieceImage = (orderIndex, pieceIndex, imageIndex) => {
        const newOrdersDetails = [...ordersDetails]
        newOrdersDetails[orderIndex].pieces[pieceIndex].images.splice(imageIndex, 1)
        setOrdersDetails(newOrdersDetails)
    }

    const createOrUpdateBag = async () => {
        setLoading(true)
        try {
            const res = await axios.post(`${server}bags/create-update/`, {
                "bag": bagDetails,
                "orders": ordersDetails
            }, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            })
            setOpen(false)
            if (bagDetails?.id) {
                setBags(bags.map(b => b.id === bagDetails.id ? res.data : b))
                toast.success("Order updated successfully")
            } else {
                toast.success("Order created successfully")
                setBags([res.data, ...bags])
            }
            setBagDetails({
                name: '',
                date: '',
                weight: 0,
                shipping_company: '',
                shipping_cost_in_egp: 0,
                shipping_cost_in_sar: 0,
                price_in_egp: 0,
                price_in_sar: 0,
                profit_in_egp: 0,
                profit_in_sar: 0,
                xg: '',
                discount_in_egp: 0,
                discount_in_sar: 0,
            })
            setOrdersDetails([])
        } catch (error) {
            console.error(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                window.location.href = '/login'
                toast.error("You're not logged in")
                return
            }
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }


    // update profit fields
    useEffect(() => {
        if (ordersDetails) {
            // Calculate the total orders amount, ensuring prices are numbers
            const totalOrdersAmountEGP = ordersDetails?.reduce((orderSum, order) => {
                const piecesSum = order.pieces.reduce((sum, piece) => sum + Number(piece.price_in_egp), 0);
                return orderSum + piecesSum;
            }, 0);

            // Convert shipping and discount to numbers as well
            const shipping_in_egp = Number(bagDetails.shipping_cost_in_egp);
            const discount_in_egp = Number(bagDetails.discount_in_egp || 0);


            // Calculate profit
            const calculatedProfit = totalOrdersAmountEGP - (discount_in_egp + shipping_in_egp)

            // Update bagDetails only if the profit has changed
            if (calculatedProfit !== bagDetails.profit_in_egp) {
                setBagDetails(prev => ({
                    ...prev,
                    profit_in_egp: discount_in_egp == 0 ? 0 : calculatedProfit,
                    price_in_egp: totalOrdersAmountEGP + shipping_in_egp,
                }));
            }
            setBagDetails(prev => ({
                ...prev,
                price_in_egp: totalOrdersAmountEGP + shipping_in_egp,
            }));


            // Calculate the total orders amount, ensuring prices are numbers
            const totalOrdersAmountSAR = ordersDetails?.reduce((orderSum, order) => {
                const piecesSum = order.pieces.reduce((sum, piece) => sum + Number(piece.price_in_sar), 0);
                return orderSum + piecesSum;
            }, 0);

            // Convert shipping and discount to numbers as well
            const shipping_in_sar = Number(bagDetails.shipping_cost_in_sar);
            const discount_in_sar = Number(bagDetails.discount_in_sar || 0);


            // Calculate profit
            const calculatedProfitInSAR = totalOrdersAmountSAR - (discount_in_sar + shipping_in_sar)

            // Update bagDetails only if the profit has changed
            if (calculatedProfitInSAR !== bagDetails.profit_in_sar) {
                setBagDetails(prev => ({
                    ...prev,
                    profit_in_sar: discount_in_sar == 0 ? 0 : calculatedProfitInSAR,
                    price_in_sar: totalOrdersAmountSAR + shipping_in_sar,
                }));
            }
            setBagDetails(prev => ({
                ...prev,
                price_in_sar: totalOrdersAmountSAR + shipping_in_sar,
            }));
        }
    }, [ordersDetails, bagDetails.discount_in_sar, bagDetails.shipping_cost_in_sar, bagDetails.discount_in_egp, bagDetails.shipping_cost_in_egp]);



    const [bag, setBag] = useState(null)
    const getBag = async (id) => {
        try {
            const res = await axios.get(`${server}bags/${id}/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            })
            setBag(res.data)
            console.log(res);
        } catch (error) {
            console.error(error)
        }
    }



    const deleteBag = async (id) => {
        try {
            const res = await axios.delete(`${server}bags/${id}/delete/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            })
            setBags(bags.filter(bag => bag.id !== id))
            toast.success('Bag deleted successfully')
            setOpen(false)
        } catch (error) {
            console.error(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                window.location.href = '/login'
                toast.error("You're not logged in")
                return
            }
            toast.error("Something went wrong")
        }
    }

    return (
        <BagContextProvider.Provider value={{
            open, setOpen,

            loading, progress,

            bags, setBags,
            bagParams, setBagParams, updateBagParams,
            getBags,


            bagDetails, setBagDetails,
            ordersDetails, setOrdersDetails, addNewOrderDetails,
            updateBagDetails,
            updateOrderDetails,
            deleteOrderDetails,
            addNewOrderPiece,
            updateOrderPiece,
            deleteOrderPiece,
            deleteOrderPieceImage,

            createOrUpdateBag,

            bag, setBag,
            getBag,

            deleteBag,
        }}>
            {children}
        </BagContextProvider.Provider>
    )
}

export default BagContext
export const BagContextProvider = React.createContext()
