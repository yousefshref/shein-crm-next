"use client";
import DashboardLayout from "@/components/DashboardLayout";
import CalendarDialog from "@/components/Order/CalendarDialog";
import CreateOrUpdateOrder from "@/components/Order/CreateOrUpdateOrder";
import OrdersSearchDialog from "@/components/Order/OrdersSearchDialog";
import OrdersTruckDialog from "@/components/Order/OrdersTruckDialog";
import { Progress } from "@/components/ui/progress";
import { OrdersContextProvider } from "@/context/OrdersContext";
import { Calendar, Plus, Search, Truck } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { UserContextProvider } from "./context/UserContext";
import ChartsComponent from "@/components/ChartsComponent";
import { toast } from "sonner";
import { formatNumber } from "@/lib/utils";

export default function Home() {
  const { is_seller, user } = useContext(UserContextProvider);

  useEffect(() => {
    if (!user) {
      toast.error("You are not logged in");
      window.location.href = "/login";
    }
  }, [user]);

  const { open, setOpen, loading, progress, orders, setOrder } = useContext(
    OrdersContextProvider
  );

  const [openCalendar, setOpenCalendar] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openTruck, setOpenTruck] = useState(false);

  const [openCharts, setOpenCharts] = useState(false);

  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [totalOrdersSAR, setTotalOrdersSAR] = useState(0);
  const [totalOrdersEGP, setTotalOrdersEGP] = useState(0);
  const [totalOrdersProfitSAR, setTotalOrdersProfitSAR] = useState(0);
  const [totalOrdersProfitEGP, setTotalOrdersProfitEGP] = useState(0);

  useEffect(() => {
    if (orders?.length > 0) {
      setTotalOrdersCount(orders.length);
      setTotalOrdersSAR(
        orders.reduce((acc, order) => acc + order.total_order_in_sar, 0)
      );
      setTotalOrdersEGP(
        orders.reduce((acc, order) => acc + order.total_order_in_eg, 0)
      );
      setTotalOrdersProfitSAR(
        orders.reduce((acc, order) => acc + order.total_order_profit_in_sar, 0)
      );
      setTotalOrdersProfitEGP(
        orders.reduce((acc, order) => acc + order.total_order_profit_in_eg, 0)
      );
    }
  }, [orders]);

  // dashboard
  return (
    <DashboardLayout>
      <div
        className={`relative flex flex-col transition-all duration-500 ${
          open || openCalendar || openSearch || openTruck || openCharts
            ? "scale-95"
            : ""
        }`}
      >
        {/* loading */}
        {loading ? (
          <div className="fixed w-full h-full left-0 top-0 transition-all duration-200 bg-black/30 z-50">
            <Progress value={progress} />
          </div>
        ) : null}

        {/* charts */}
        <div
          onClick={() => {
            if (is_seller) {
              toast.error("لا يمكنك الوصول لهذه الصفحة");
            } else {
              setOpenCharts(true);
            }
          }}
          className="p-10 cursor-pointer bg-[#D9D9D9] rounded-xl flex flex-col items-center justify-center"
        >
          <p className="text-xl font-medium">التفاصيل بالرسم البياني</p>
        </div>
        <ChartsComponent open={openCharts} setOpen={setOpenCharts} />
        {/* search */}
        <div className="mt-14 flex gap-10 items-center">
          <p className="text-[#6C85FF]">أبحث ب</p>
          <div
            onClick={() => setOpenCalendar(true)}
            className="p-2 bg-[#6C85FF] cursor-pointer transition-all duration-300 hover:bg-[#788fff] w-[40px] h-[40px] rounded-full text-white flex flex-col justify-center items-center"
          >
            <Calendar className="w-full" />
          </div>
          <CalendarDialog open={openCalendar} setOpen={setOpenCalendar} />
          <div
            onClick={() => setOpenSearch(true)}
            className="p-2 bg-[#6C85FF] cursor-pointer transition-all duration-300 hover:bg-[#788fff] w-[40px] h-[40px] rounded-full text-white flex flex-col justify-center items-center"
          >
            <Search className="w-full" />
          </div>
          <OrdersSearchDialog open={openSearch} setOpen={setOpenSearch} />
          <div
            onClick={() => setOpenTruck(true)}
            className="p-2 bg-[#6C85FF] cursor-pointer transition-all duration-300 hover:bg-[#788fff] w-[40px] h-[40px] rounded-full text-white flex flex-col justify-center items-center"
          >
            <Truck className="w-full" />
          </div>
          <OrdersTruckDialog open={openTruck} setOpen={setOpenTruck} />
        </div>
        {/* order details */}
        <div className="mt-14 items-start gap-10 grid grid-cols-3">
          <div className="col-span-1 flex flex-col">
            <p className="text-[#6C85FF]">عدد الطلبات</p>
            <p className="text-zinc-500 text-sm mt-1">
              {formatNumber(totalOrdersCount)}
            </p>
          </div>
          {is_seller ? null : (
            <>
              <div className="col-span-1 flex flex-col">
                <p className="text-[#6C85FF]">مجموع الطلبات</p>
                <p className="text-zinc-500 text-sm mt-1">
                  {formatNumber(totalOrdersEGP)} جنية
                </p>
                <p className="text-zinc-500 text-sm">
                  {formatNumber(totalOrdersSAR)} ريال
                </p>
              </div>
              <div className="col-span-1 flex flex-col">
                <p className="text-[#6C85FF]">مجموع الارباح</p>
                <p className="text-zinc-500 text-sm">
                  {formatNumber(totalOrdersProfitEGP)} جنية
                </p>
                <p className="text-zinc-500 text-sm mt-1">
                  {formatNumber(totalOrdersProfitSAR)} ريال
                </p>
              </div>
            </>
          )}
        </div>
        {/* order create order */}
        <div
          onClick={() => setOpen(true)}
          className="mt-14 bg-[#71ff6c] cursor-pointer transition-all duration-300 hover:bg-[#57ff51] w-[40px] h-[40px] rounded-full text-white flex flex-col justify-center items-center"
        >
          <Plus className="w-full" />
        </div>
        <CreateOrUpdateOrder />
        {/* orders list */}
        <div className="mt-5 flex flex-col gap-5">
          <div
            className={`${
              is_seller ? "grid grid-cols-4" : "grid grid-cols-6"
            } gap-10 md:text-sm text-xs font-bold`}
          >
            <p className="col-span-1">اسم العميل</p>
            <p className="col-span-1">حالة الطلب</p>
            {is_seller ? null : (
              <>
                <p className="col-span-1">إجمالي المبيعات</p>
                <p className="col-span-1">إجمالي الربح</p>
              </>
            )}
            <p className="col-span-1">ثمن الشحن</p>
            <p className="col-span-1">التاريخ</p>
          </div>
          {orders?.map((order) => (
            <div
              key={order?.id}
              className={`${
                is_seller ? "grid grid-cols-4" : "grid grid-cols-6"
              } gap-10 md:text-sm text-xs transition-all duration-300 border-b py-3 border-black/30 hover:bg-blue-50 cursor-pointer px-1`}
              onClick={() => {
                setOpen(true);
                setOrder(order);
              }}
            >
              <p className="col-span-1">{order?.customer_name}</p>
              <p className="col-span-1">{order?.order_status_name}</p>
              {is_seller ? null : (
                <>
                  <p className="col-span-1 flex flex-col">
                    <span className="grid grid-cols-2">
                      <span>{formatNumber(order?.total_order_in_eg)}</span>
                      <span>EGP</span>
                    </span>
                    <span className="grid grid-cols-2">
                      <span>{formatNumber(order?.total_order_in_sar)}</span>
                      <span>SAR</span>
                    </span>
                  </p>
                  <p className="col-span-1 flex flex-col">
                    <span className="grid grid-cols-2">
                      <span>
                        {formatNumber(order?.total_order_profit_in_eg)}
                      </span>
                      <span>EGP</span>
                    </span>
                    <span className="grid grid-cols-2">
                      <span>
                        {formatNumber(order?.total_order_profit_in_sar)}
                      </span>
                      <span>SAR</span>
                    </span>
                  </p>
                </>
              )}
              <p className="col-span-1 flex flex-col">
                <span className="grid grid-cols-2">
                  <span>{formatNumber(order?.shipping_cost)}</span>
                  <span>SAR</span>
                </span>
              </p>
              <p className="col-span-1">{order?.date}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
