'use client'
import { server } from '@/app/server'
import axios from 'axios'
import React, { createContext, useEffect } from 'react'
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


    const [orders, setOrders] = React.useState([])

    // search params
    const today = new Date();
    const date_from = new Date();
    date_from.setDate(today.getDate() - 7);

    const date_to = today;

    const formatDate = (date) =>
        `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    const [date_from_str, setDateFrom] = React.useState(formatDate(date_from));
    const [date_to_str, setDateTo] = React.useState(formatDate(date_to));

    const [sales_id, setSalesId] = React.useState('')
    const [customer_name_param, setCustomerName_param] = React.useState('')
    const [customer_phone_param, setCustomerPhone_param] = React.useState('')
    const [customer_wp_param, setCustomerWp_param] = React.useState('')

    const [order_status_param, setOrderStatus_param] = React.useState('')
    const [shipping_courier_param, setShippingCourier_param] = React.useState('')
    const [is_collected_param, setIsCollected_param] = React.useState('')

    const getOrders = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${server}orders/`, {
                params: {
                    date_from: date_from_str,
                    date_to: date_to_str,

                    sales_id: sales_id,
                    customer_name: customer_name_param,
                    customer_phone: customer_phone_param,
                    customer_wp: customer_wp_param,

                    order_status: order_status_param,
                    shipping_courier: shipping_courier_param,
                    is_collected: is_collected_param,
                },
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

    const allowedPathes = ['/']
    useEffect(() => {
        if (allowedPathes.includes(window.location.pathname)) getOrders()
    }, [date_from_str, date_to_str])


    // data
    const [customer_name, setCustomerName] = React.useState('')
    const [customer_phone, setCustomerPhone] = React.useState('')
    const [customer_wp, setCustomerWp] = React.useState('')
    const [order_status, setOrderStatus] = React.useState('')
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
    const [shipping_cost, setShippingCost] = React.useState(0)

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
                shipping_cost,
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
            setOrderStatus('');
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
            setShippingCost(0);

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
            setShippingCost(order?.shipping_cost || 0);
            setOrderStatus(order?.order_status || '');
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



    const updateOrder = async () => {
        setProgress(10)
        try {
            setProgress(30)
            const res = await axios.put(`${server}orders/${order?.id}/`, {
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
                shipping_cost,
            }, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            })
            setOrders(orders.map(o => o.id === order.id ? res.data : o))
            setProgress(70)
            toast.success("Order updated successfully")
            setOpen(false)

            setCustomerName('');
            setCustomerPhone('');
            setCustomerWp('');
            setOrderStatus('');
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
            setShippingCost(0);

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
            shipping_cost, setShippingCost,
            order_status, setOrderStatus,
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

            // search date
            date_from_str, setDateFrom,
            date_to_str, setDateTo,
            // search basic info
            sales_id, setSalesId,
            customer_name_param, setCustomerName_param,
            customer_phone_param, setCustomerPhone_param,
            customer_wp_param, setCustomerWp_param,
            // search shipping details
            order_status_param, setOrderStatus_param,
            shipping_courier_param, setShippingCourier_param,
            is_collected_param, setIsCollected_param,

            orders,

            getOrders,

            createOrder,

            order, setOrder,

            updateOrder,
            deleteOrder,
        }}>
            {children}
        </OrdersContextProvider.Provider>
    )
}

export default OrdersContext
export const OrdersContextProvider = createContext()
