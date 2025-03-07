import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import OrdersContext from "@/context/OrdersContext";
import UserContext from "./context/UserContext";
import BagContext from "@/context/BagContext";
import ShippingCompaniesContext from "@/context/ShippingCompaniesContext";
import SellersContext from "@/context/SellersContext";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const cairo = Cairo({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html dir="ltr" lang="en">
      <body className={`antialiased ${cairo.className}`}>
        <OrdersContext>
          <UserContext>
            <BagContext>
              <ShippingCompaniesContext>
                <SellersContext>
                  {children}
                  <Toaster />
                </SellersContext>
              </ShippingCompaniesContext>
            </BagContext>
          </UserContext>
        </OrdersContext>
      </body>
    </html>
  );
}
