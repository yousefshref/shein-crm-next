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
        date.setDate(date.getDate() - 30);
        return date.toISOString().split('T')[0];
    };

    const getToday = () => {
        return new Date().toISOString().split('T')[0];
    };

    const [bags, setBags] = React.useState([])

    const [bagParams, setBagParams] = React.useState({
        date_from: getLast7Days(),
        date_to: getToday(),

        is_closed: 'false',

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
                console.log(res.data);

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
        is_closed: false
    })


    const [ordersDetails, setOrdersDetails] = React.useState([])

    const updateBagDetails = (key, value) => {
        setBagDetails({ ...bagDetails, [key]: value })
    }

    const updateOrderDetails = (index, key, value) => {
        const newOrdersDetails = [...ordersDetails]
        newOrdersDetails[index][key] = value
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
    // Function to calculate the total pieces price for all orders
    const calculateTotalPiecesPrice = () => {
        let totalEgp = 0;
        let totalSar = 0;
        ordersDetails.forEach(order => {
            order.pieces.forEach(piece => {
                totalEgp += Number(piece.price_in_egp);
                totalSar += Number(piece.price_in_sar);
            });
        });
        return { totalEgp, totalSar };
    };

    const calculateAndUpdateValues = () => {
        // 1. Calculate overall pieces price
        const { totalEgp, totalSar } = calculateTotalPiecesPrice();

        // 2. Calculate price after discount for each currency using total pieces price
        const priceAfterDiscountEgp = totalEgp - Number(bagDetails.discount_in_egp);
        const priceAfterDiscountSar = totalSar - Number(bagDetails.discount_in_sar);

        // 3. Calculate profit: total pieces price minus (price after discount + shipping cost)
        const profitEgp = totalEgp - Number(bagDetails.discount_in_egp) - Number(bagDetails.shipping_cost_in_egp);
        const profitSar = totalSar - Number(bagDetails.discount_in_sar) - Number(bagDetails.shipping_cost_in_sar);

        // 4. Calculate xg using the formula: profit_in_egp / (price_after_discount in SAR)
        // Avoid division by zero by checking priceAfterDiscountSar
        const xg = priceAfterDiscountSar !== 0 ? totalSar / profitEgp : 0;

        // 5. Update bagDetails with new values
        setBagDetails(prev => {
            const updated = { ...prev };
            let shouldUpdate = false;

            // Update price_in_egp and price_in_sar to total pieces prices
            if (prev.price_in_egp !== totalEgp) {
                updated.price_in_egp = totalEgp;
                shouldUpdate = true;
            }
            if (prev.price_in_sar !== totalSar) {
                updated.price_in_sar = totalSar;
                shouldUpdate = true;
            }

            // Update profit values
            if (prev.profit_in_egp !== profitEgp || prev.profit_in_sar !== profitSar) {
                updated.profit_in_egp = profitEgp;
                updated.profit_in_sar = profitSar;
                shouldUpdate = true;
            }

            // Update xg field
            if (prev.xg !== xg) {
                updated.xg = xg;
                shouldUpdate = true;
            }
            return shouldUpdate ? updated : prev;
        });

        // 6. Update each order's remaining amount (total pieces price - paid)
        const updatedOrders = ordersDetails.map(order => {
            let orderTotalEgp = 0;
            let orderTotalSar = 0;
            order.pieces.forEach(piece => {
                orderTotalEgp += Number(piece.price_in_egp);
                orderTotalSar += Number(piece.price_in_sar);
            });
            const newRemainingEgp = orderTotalEgp - Number(order.paid_in_egp);
            const newRemainingSar = orderTotalSar - Number(order.paid_in_sar);

            if (order.remaining_in_egp !== newRemainingEgp || order.remaining_in_sar !== newRemainingSar) {
                return {
                    ...order,
                    remaining_in_egp: newRemainingEgp,
                    remaining_in_sar: newRemainingSar
                };
            }
            return order;
        });

        // Only update orders state if there is any change
        if (JSON.stringify(updatedOrders) !== JSON.stringify(ordersDetails)) {
            setOrdersDetails(updatedOrders);
        }
    };

    React.useEffect(() => {
        calculateAndUpdateValues();
    }, [
        ordersDetails,
        bagDetails.discount_in_egp,
        bagDetails.shipping_cost_in_egp,
        bagDetails.discount_in_sar,
        bagDetails.shipping_cost_in_sar,
    ]);


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
