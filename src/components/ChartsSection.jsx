import { UserContextProvider } from '@/app/context/UserContext';
import React, { useContext } from 'react'
import { toast } from 'sonner';
import ChartsComponent from './ChartsComponent';

const ChartsSection = () => {
    const { is_seller } = useContext(UserContextProvider);
    const [openCharts, setOpenCharts] = React.useState(false)
    return (
        <div>
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
                <p className="text-xl font-medium">Chart Details</p>
            </div>
            <ChartsComponent open={openCharts} setOpen={setOpenCharts} />
        </div>
    )
}

export default ChartsSection
