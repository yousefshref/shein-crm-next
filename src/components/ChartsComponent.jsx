import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { server } from "@/app/server";

import { Bar } from "react-chartjs-2";


import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const ChartsComponent = ({ open, setOpen }) => {
    // fetch the orders data
    const [loading, setLoading] = useState(false);
    const [ordersData, setOrdersData] = useState(null);
    const [months, setMonths] = useState([]);
    const [year, setYear] = useState(2025);

    const [date_from, setDateFrom] = useState('');
    const [date_to, setDateTo] = useState('');

    const [sales_id, setSalesId] = useState('');
    const [customer_number, setCustomerNumber] = useState('');

    const [order_status, setOrderStatus] = useState('');
    const [is_collected, setIsCollected] = useState('');

    const getData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${server}orders-data/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                },
                params: {
                    year,
                    date_from,
                    date_to,
                    sales_id,
                    customer_number,
                    order_status,
                    is_collected
                }
            })
            console.log(res?.data);
            setMonths(res?.data?.months?.map((m) => m?.month_name));
            setOrdersData(res?.data?.months);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (open) {
            getData()
        }
    }, [date_from, date_to, sales_id, customer_number, order_status, is_collected, year, open])



    const [isMobile, setIsMobile] = useState(0); // Detect screen width

    // Update state when window resizes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => setIsMobile(window.innerWidth < 600);
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);


    const data = {
        // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        labels: months,
        datasets: [
            {
                label: `عدد الطلبات`,
                data: ordersData?.map((o) => o?.total_orders_count), // Values for bars
                backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue bars
            },
            // {
            //     label: "مجموع الطلبات بالسعودي",
            //     data: ordersData?.map((o) => o?.total_orders_sar), // Values for bars
            //     backgroundColor: "#38ff6a", // Green bars
            //     
            // },
            {
                label: "مجموع الطلبات بالمصري",
                data: ordersData?.map((o) => o?.total_price), // Values for bars
                backgroundColor: "#ff3838", // Red bars
            },
            // {
            //     label: "مجموع الارباح بالسعودي",
            //     data: ordersData?.map((o) => o?.total_profit_sar), // Values for bars
            //     backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue bars
            //     
            // },
            {
                label: "مجموع الارباح بالمصري",
                data: ordersData?.map((o) => o?.total_profit), // Values for bars
                backgroundColor: "#38ff6a", // Blue bars
            },
            {
                label: "XG",
                data: ordersData?.map((o) => o?.total_xg), // Values for bars
                backgroundColor: "#ffe438", // Blue bars
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { text: "Monthly Sales" },
        },
        responsive: true,
        indexAxis: isMobile ? "y" : "x",
        scales: {
            y: { beginAtZero: true }, // Ensures y-axis starts at zero
        },
    };

    // utlies
    const [sellers, setSellers] = useState([]);
    useEffect(() => {
        const getSellers = async () => {
            try {
                const res = await axios.get(`${server}sales/`, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`
                    }
                })
                setSellers(res.data)
            } catch (error) {
                console.error(error)
            }
        }
        getSellers()
    }, [])

    const [order_statuses, setOrderStatuses] = useState([]);
    useEffect(() => {
        const getStatuses = async () => {
            try {
                const res = await axios.get(`${server}order-statuses/`, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`
                    }
                })
                setOrderStatuses(res.data)
            } catch (error) {
                console.error(error)
            }
        }
        getStatuses()
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex flex-col w-full max-w-[97%] h-full max-h-[94%] overflow-y-scroll">
                <DialogHeader className={'h-0 overflow-hidden'}>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                {/* search */}
                <div className="grid md:grid-cols-3 grid-cols-1 gap-5 mt-5">
                    <div className="flex flex-col gap-1">
                        <p className="text-[#6C85FF]">التاريخ</p>
                        <div className="flex flex-col gap-1 mt-2">
                            <input
                                type="number"
                                value={year}
                                className="input-primary"
                                onChange={(e) => setYear(e.target.value)}
                                style={{ marginLeft: "10px" }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[#6C85FF]">معلومات الطلبات</p>
                        <div className="flex flex-col gap-1 mt-2">
                            <select onChange={(e) => setSalesId(e.target.value)} value={sales_id} className="input-primary">
                                <option value="">اختر سيلز معين</option>
                                {sellers?.map((item, index) => (
                                    <option key={index} value={item.id}>{item.user_username}</option>
                                ))}
                            </select>
                            <input value={customer_number} onChange={(e) => {
                                setCustomerNumber(
                                    e.target.value
                                )
                            }} placeholder="رقم هاتف عميل" type="number" className="input-primary" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[#6C85FF]">حالات الطلبات</p>
                        <div className="flex flex-col gap-1 mt-2">
                            <select onChange={(e) => setOrderStatus(e.target.value)} value={order_status} className="input-primary">
                                <option value="">حاله الطلب</option>
                                {order_statuses?.map((item, index) => (
                                    <option key={index} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                            <select onChange={(e) => setIsCollected(e.target.value)} value={is_collected} className="input-primary">
                                <option value="">هل تم التحصيل ؟</option>
                                <option value="true">نعم</option>
                                <option value="false">لا</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* charts */}

                <Bar height={isMobile ? 200 : 50} width={'100%'} data={data} options={options} />
            </DialogContent>
        </Dialog>
    );
};

export default ChartsComponent;
