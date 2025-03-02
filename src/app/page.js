"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { useContext, useEffect, useState } from "react";
import { UserContextProvider } from "./context/UserContext";
import { toast } from "sonner";
import BagsSection from "@/components/Bag/BagsSection";
import OrdersSection from "@/components/Order/OrdersSection";

export default function Home() {
  const { user } = useContext(UserContextProvider);

  useEffect(() => {
    if (!user) {
      toast.error("You are not logged in");
      window.location.href = "/login";
    }
  }, [user]);

  const [page, setPage] = useState("bags");

  useEffect(() => {
    setPage(localStorage.getItem("page") || "bags");
  }, [page]);

  // dashboard
  return (
    <DashboardLayout>
      {page == "bags" ? (
        <BagsSection page={page} setPage={setPage} />
      ) : (
        <OrdersSection page={page} setPage={setPage} />
      )}
    </DashboardLayout>
  );
}
