import React, { useContext, useEffect } from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { BagContextProvider } from '@/context/BagContext'
import { ShippingCompaniesContextProvider } from '@/context/ShippingCompaniesContext'
import SearchDropdown from '../SearchDropdown'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import OrderDetailsComponent from './OrderDetailsComponent'


const CreateOrUpdateBag = ({ open, setOpen }) => {
    const {
        bagDetails,
        ordersDetails,
        addNewOrderDetails,
        updateBagDetails,
        createOrUpdateBag,

        // delete
        deleteBag,

        // update
        bag,
        setBagDetails,
        setOrdersDetails,
    } = useContext(BagContextProvider)


    const { shipping_companies } = useContext(ShippingCompaniesContextProvider)
    const [shippingCompaniesNames, setShippingCompaniesNames] = React.useState([])
    useEffect(() => {
        if (shipping_companies) {
            setShippingCompaniesNames(shipping_companies?.map((shipping_company) => shipping_company?.name || shipping_company?.shipping_company_name))
        }
    }, [shipping_companies])


    useEffect(() => {
        if (bag) {
            setBagDetails({ ...bag, shipping_company: bag?.shipping_company_name })
            setOrdersDetails(bag?.orders_details)
        }
    }, [bag])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex flex-col w-full max-w-[97%] h-full max-h-[94%] overflow-y-scroll">
                <DialogHeader className="hidden">
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>

                {/* Your content */}
                <div className='flex flex-col gap-5'>
                    {/* bag details */}
                    <div className='flex flex-col gap-2'>
                        <p className='font-semibold text-lg'>Bag Details</p>

                        <div className='flex flex-col mt-4'>
                            <p className='font-bold text-blue-500 text-xl'>Basic Info</p>
                            <div className='grid grid-cols-2 mt-1 gap-5'>
                                <div className='col-span-1 flex flex-col gap-1'>
                                    <p>Name</p>
                                    <input
                                        value={bagDetails?.name}
                                        onChange={(e) => updateBagDetails('name', e.target.value)}
                                        type="text" className='input-primary'
                                    />
                                </div>
                                <div className='col-span-1 flex flex-col gap-1'>
                                    <p>Date</p>
                                    <input
                                        value={bagDetails?.date}
                                        onChange={(e) => updateBagDetails('date', e.target.value)}
                                        type="date" className='input-primary' />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col mt-4'>
                            <p className='font-bold text-blue-500 text-xl'>Shipping Details</p>
                            <div className='grid grid-cols-3 mt-1 gap-5'>
                                <div className='col-span-1 flex flex-col gap-1'>
                                    <p>Weight</p>
                                    <input
                                        value={bagDetails?.weight}
                                        onChange={(e) => updateBagDetails('weight', e.target.value)}
                                        type="text" className='input-primary' />
                                </div>
                                <div className='relative col-span-1 flex flex-col gap-1'>
                                    <p>Shipping Company</p>
                                    <SearchDropdown
                                        items={shippingCompaniesNames}
                                        placeholder="Select a Shipping Company..."
                                        defaultValue={bag?.shipping_company_name || ""}
                                        onSelect={(selectedValue) => updateBagDetails('shipping_company', selectedValue)}
                                    />
                                </div>
                                <div className='col-span-1 flex flex-col gap-1'>
                                    <p>Shipping Cost</p>
                                    <div className='relative'>
                                        <input
                                            value={bagDetails?.shipping_cost_in_egp}
                                            onChange={(e) => updateBagDetails('shipping_cost_in_egp', e.target.value)}
                                            type="number" className='input-primary w-full'
                                        />
                                        <span className='absolute right-3 top-1.5 font-bold'>EGP</span>
                                    </div>
                                    <div className='relative'>
                                        <input
                                            value={bagDetails?.shipping_cost_in_sar}
                                            onChange={(e) => updateBagDetails('shipping_cost_in_sar', e.target.value)}
                                            type="number" className='input-primary w-full'
                                        />
                                        <span className='absolute right-3 top-1.5 font-bold'>SAR</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col mt-4'>
                            <p className='font-bold text-blue-500 text-xl'>Financial Details</p>
                            <div className='grid grid-cols-3 mt-1 gap-5'>
                                <div className='col-span-1 flex flex-col gap-3'>
                                    <p>Price</p>
                                    <div className='relative flex flex-col gap-2'>
                                        <input
                                            value={bagDetails?.price_in_egp}
                                            onChange={(e) => updateBagDetails('price_in_egp', e.target.value)}
                                            type="text" className='input-primary w-full'
                                        />
                                        <span className='absolute right-3 top-1.5 font-bold'>EGP</span>
                                    </div>
                                    <div className='relative flex flex-col gap-2'>
                                        <input
                                            value={bagDetails?.price_in_sar}
                                            onChange={(e) => updateBagDetails('price_in_sar', e.target.value)}
                                            type="text" className='input-primary w-full'
                                        />
                                        <span className='absolute right-3 top-1.5 font-bold'>SAR</span>
                                    </div>
                                </div>
                                <div className='flex col-span-1 flex-col gap-3'>
                                    <p>Price After Discount</p>
                                    <div className='relative flex flex-col gap-2'>
                                        <input
                                            value={bagDetails?.discount_in_egp}
                                            onChange={(e) => updateBagDetails('discount_in_egp', e.target.value)}
                                            type="text" className='input-primary white'
                                        />
                                        <span className='absolute right-3 top-1.5 font-bold'>EGP</span>
                                    </div>
                                    <div className='relative flex flex-col gap-2'>
                                        <input
                                            value={bagDetails?.discount_in_sar}
                                            onChange={(e) => updateBagDetails('discount_in_sar', e.target.value)}
                                            type="text" className='input-primary white'
                                        />
                                        <span className='absolute right-3 top-1.5 font-bold'>SAR</span>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <p>Profit</p>
                                    <div className='relative w-full'>
                                        <input
                                            value={bagDetails?.profit_in_egp}
                                            onChange={(e) => updateBagDetails('profit_in_egp', e.target.value)}
                                            type="text" className='input-primary w-full'
                                        />
                                        <span className='absolute right-3 top-1.5 font-bold'>EGP</span>
                                    </div>
                                    <div className='relative w-full'>
                                        <input
                                            value={bagDetails?.profit_in_sar}
                                            onChange={(e) => updateBagDetails('profit_in_sar', e.target.value)}
                                            type="text" className='input-primary w-full'
                                        />
                                        <span className='absolute right-3 top-1.5 font-bold'>SAR</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-1 flex flex-col gap-3 mt-4'>
                                <p>XG</p>
                                <input
                                    value={bagDetails?.xg}
                                    onChange={(e) => updateBagDetails('xg', e.target.value)}
                                    type="number" className='input-primary' />
                            </div>

                        </div>
                    </div>
                    <hr className='my-5' />
                    {/* orders details */}
                    <div className='flex flex-col gap-2'>
                        <p className='font-semibold text-lg'>Orders Details</p>
                        <button onClick={() => addNewOrderDetails()} className='flex pe-5 w-fit px-3 flex-row items-center gap-2 cursor-pointer hover:bg-green-400 transition-all duration-300 p-1.5 rounded-full justify-center text-white bg-green-500'>
                            <Plus size={20} />
                            <p>Add Another Client</p>
                        </button>
                        {ordersDetails?.length > 0 ? ordersDetails?.map((order, index) => (
                            <OrderDetailsComponent key={index} order={order} index={index} />
                        )) : (
                            <div className='w-full flex justify-center py-4 items-center rounded-xl p-2 bg-yellow-100 text-yellow-500 text-lg'>
                                <p>No orders found, Click on Plus icon to add orders</p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className={'w-fit me-auto mt-auto'}>
                    <Button onClick={() => createOrUpdateBag()} type="submit">Done</Button>
                    <Button onClick={() => deleteBag(bag?.id)} type="submit" variant={'destructive'}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateOrUpdateBag
