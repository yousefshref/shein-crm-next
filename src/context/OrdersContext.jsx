'use client'
import { server } from '@/app/server'
import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

const OrdersContext = ({ children }) => {
    // create or update drawer
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


    const [orders, setOrders] = React.useState([])

    const [ordersParams, setOrdersParams] = useState({
        sales_id: '',
        customer_name: '',
        customer_number: '',
        is_delivered: '',
        is_collected: '',
        date_from: getLast7Days(),
        date_to: getToday(),
    })

    const updateOrdersParams = (key, value) => {
        setOrdersParams({ ...ordersParams, [key]: value })
    }

    const getOrders = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${server}orders/`, {
                params: ordersParams,
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            })
            setOrders(res.data)
        } catch (error) {
            alert(error.response.status)
            console.error(error)
            if (error.response.status == 401) {
                localStorage.removeItem('token')
                window.location.href = '/login'
            }
        } finally {
            setLoading(false)
        }
    }


    // data
    const [customer_name, setCustomerName] = React.useState('')
    const [customer_phone, setCustomerPhone] = React.useState('')
    const [customer_wp, setCustomerWp] = React.useState('')
    const [is_delivered, setIsDelivered] = React.useState('')
    const [shipping_courier, setShippingCourier] = React.useState('')
    const [sales, setSales] = React.useState(0)
    const [total_order_in_sar, setTotalOrderInSar] = React.useState(0)
    const [total_order_in_eg, setTotalOrderInEg] = React.useState(0)
    const [total_order_profit_in_sar, setTotalOrderProfitInSar] = React.useState(0)
    const [total_order_profit_in_eg, setTotalOrderProfitInEg] = React.useState(0)
    const [paid, setPaid] = React.useState(0)
    const [remain, setRemain] = React.useState(0)
    const [is_collected, setIsCollected] = React.useState(false)
    const [address, setAddress] = React.useState('')
    const [shipping_cost_in_egp, setShippingCostInEGP] = React.useState(0)

    const createOrder = async () => {
        setProgress(10)
        try {
            setProgress(30)
            const res = await axios.post(`${server}orders/`, {
                customer_name,
                customer_phone,
                customer_wp,
                order_status,
                shipping_courier,
                sales,
                total_order_in_sar,
                total_order_in_eg,
                total_order_profit_in_sar,
                total_order_profit_in_eg,
                paid,
                remain,
                is_collected,
                address,
                shipping_cost_in_egp,
            }, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            })
            setOrders([res.data, ...orders])
            setProgress(70)
            toast.success("Order created successfully")
            setOpen(false)

            setCustomerName('');
            setCustomerPhone('');
            setCustomerWp('');
            setIsDelivered('');
            setShippingCourier('');
            setSales(0);
            setTotalOrderInSar(0);
            setTotalOrderInEg(0);
            setTotalOrderProfitInSar(0);
            setTotalOrderProfitInEg(0);
            setPaid(0);
            setRemain(0);
            setIsCollected(false);
            setAddress('');
            setShippingCostInEGP(0);

        } catch (error) {
            console.error(error)
            toast.error("Error creating order")
        } finally {
            setLoading(false)
            setProgress(100)
        }
    }




    const [order, setOrder] = React.useState({})

    useEffect(() => {
        if (order && open) {
            setSales(order?.sales || '');
            setCustomerName(order?.customer_name || '');
            setCustomerPhone(order?.customer_phone || '');
            setCustomerWp(order?.customer_wp || '');
            setShippingCourier(order?.shipping_courier || '');
            setShippingCostInEGP(order?.shipping_cost_in_egp || 0);
            setIsDelivered(order?.order_status || '');
            setAddress(order?.address || '');
            setTotalOrderInSar(order?.total_order_in_sar || 0);
            setTotalOrderInEg(order?.total_order_in_eg || 0);
            setTotalOrderProfitInSar(order?.total_order_profit_in_sar || 0);
            setTotalOrderProfitInEg(order?.total_order_profit_in_eg || 0);
            setPaid(order?.paid || 0);
            setRemain(order?.remain || 0);
            setIsCollected(order?.is_collected || false);
        }
    }, [order, open]);



    const updateOrder = async (id) => {
        setProgress(10)
        try {

            setProgress(30)

            const res = await axios.put(`${server}orders/${id || order?.id}/`, {
                customer_name,
                customer_phone,
                is_delivered,
                shipping_courier,
                sales,
                total_order_in_sar,
                total_order_in_eg,
                total_order_profit_in_sar,
                total_order_profit_in_eg,
                paid,
                remain,
                is_collected,
                address,
                shipping_cost_in_egp,
            }, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            })
            setOrders(orders?.map(o => o.id === order.id ? res.data : o))
            setProgress(70)
            toast.success("Order updated successfully")
            setOpen(false)

            setCustomerName('');
            setCustomerPhone('');
            setCustomerWp('');
            setIsDelivered('');
            setShippingCourier('');
            setSales(0);
            setTotalOrderInSar(0);
            setTotalOrderInEg(0);
            setTotalOrderProfitInSar(0);
            setTotalOrderProfitInEg(0);
            setPaid(0);
            setRemain(0);
            setIsCollected(false);
            setAddress('');
            setShippingCostInEGP(0);

        } catch (error) {
            console.error(error)
            toast.error("Error updating order")
        } finally {
            setLoading(false)
            setProgress(100)
        }
    }


    const fastUpdateOrder = async (id, data) => {
        setProgress(10)
        try {
            setProgress(30)
            const res = await axios.put(`${server}orders/${id}/`, data, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            })
            console.log(res);
            // setOrders([])
            // setOrders(orders?.map(o => o?.id == order?.id ? res?.data : o))
            getOrders()
            setProgress(70)
            toast.success("Order updated successfully")
        } catch (error) {
            console.error(error)
            toast.error("Error updating order")
        } finally {
            setLoading(false)
            setProgress(100)
        }
    }


    const deleteOrder = async () => {
        setProgress(10)
        try {
            setProgress(30)
            const res = await axios.delete(`${server}orders/${order?.id}/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            })
            setOrders(orders.filter(o => o.id !== order.id))
            setProgress(70)
            toast.success("Order deleted successfully")
            setOpen(false)
        } catch (error) {
            console.error(error)
            toast.error("Error deleting order")
        } finally {
            setLoading(false)
            setProgress(100)
        }
    }


    return (
        <OrdersContextProvider.Provider value={{
            open, setOpen,

            // basic info
            sales, setSales,
            customer_name, setCustomerName,
            customer_phone, setCustomerPhone,
            customer_wp, setCustomerWp,
            // shipping details
            shipping_courier, setShippingCourier,
            shipping_cost_in_egp, setShippingCostInEGP,
            is_delivered, setIsDelivered,
            address, setAddress,
            // money details
            total_order_in_sar, setTotalOrderInSar,
            total_order_in_eg, setTotalOrderInEg,
            total_order_profit_in_sar, setTotalOrderProfitInSar,
            total_order_profit_in_eg, setTotalOrderProfitInEg,
            paid, setPaid,
            remain, setRemain,
            is_collected, setIsCollected,

            loading,
            progress,


            orders,
            ordersParams, setOrdersParams,
            updateOrdersParams,
            getOrders,

            createOrder,

            order, setOrder,
            setOrders,

            updateOrder,
            fastUpdateOrder,
            deleteOrder,
        }}>
            {children}
        </OrdersContextProvider.Provider>
    )
}

export default OrdersContext
export const OrdersContextProvider = createContext()
