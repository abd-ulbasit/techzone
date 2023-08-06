import React, { useRef } from 'react'
import { trpc } from '../utils/trpc';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import type { Cart } from '@prisma/client';

const CheckOut = () => {
    const [updateDetails, setUpdateDetails] = React.useState(false)
    const addressRef = useRef<HTMLInputElement>(null);
    const cityRef = useRef<HTMLInputElement>(null);
    const provinceRef = useRef<HTMLInputElement>(null);
    const phoneNoRef = useRef<HTMLInputElement>(null);

    const { data: userSession } = useSession();
    if (!userSession) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl font-bold">Please Login to place an order</h1>
            </div>
        )
    }
    const user_id = userSession?.user?.id as string;
    //this cart will have all the products fethced with in it
    const { data: cartWithProducts } = trpc.cart.getCartWithProducts.useQuery(undefined, { enabled: !!user_id })
    //extracting the cart from the cartWithProducts
    const cart: Cart[] | undefined = cartWithProducts?.map((item) => {
        return {
            product_id: item.product_id,
            product_quantity: item.product_quantity,
            user_id: item.user_id
        }
    })
    const addOrderMutation = trpc.orders.addOrder.useMutation({
        onSuccess() {
            emptyCartM.mutate()
            toast.success("Your Order has been placed")
            setTimeout(() => {
                window.location.href = "/"
            }
                , 2000)
        }
    });
    const { data: UserDetailsIndb } = trpc.userdetail.getUserDetail.useQuery({ user_id: user_id })
    const adduserDetailMutation = trpc.userdetail.addUserDetail.useMutation()
    const updateUserDetailsMutation = trpc.userdetail.updateUserDetail.useMutation()
    const emptyCartM = trpc.cart.emptyCart.useMutation()



    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!UserDetailsIndb) {
            //WE need to add user to the database
            adduserDetailMutation.mutate({
                user_id: user_id,
                address: addressRef.current?.value as string,
                city: cityRef.current?.value as string,
                province: provinceRef.current?.value as string,
                phoneNo: phoneNoRef.current?.value as string,
            })
        }
        else if (updateDetails) {
            updateUserDetailsMutation.mutate({
                user_id: user_id,
                address: addressRef.current?.value as string,
                city: cityRef.current?.value as string,
                province: provinceRef.current?.value as string,
                phoneNo: phoneNoRef.current?.value as string,
            })
        }
        //User details sorted now
        //now we have to add order  with orderdetails to the database
        if (!cart) {
            toast.error("Cart is empty")
        } else {

            addOrderMutation.mutate(cart)
        }
        // addOrderMutation.mutate({
        //     user_id: user_id,
        // })
        // if (cart) {

        //     for (const item of cart) {
        //         orderdetailMutation.mutate({
        //             order_id: addOrderMutation.data?.order_id as number,
        //             product_id: item.product_id,
        //             quantity: item.product_quantity
        //         })
        //     }
        // }
        // if (cart) {

        //     for (const item of cart) {

        //         addOrderDetailMutation.mutate({
        //             order_id: order?.order_id as number,
        //             product_id: item.product_id,
        //             quantity: item.product_quantity

        //         })
        //     }
        // }
        // emptyCartM.mutate({ user_id: user_id })
        // console.log(addressRef.current?.value);
        //? This should run on successful order placement

    }
    const totalpersamething = cartWithProducts?.map((item) => {
        return item.product_quantity * item.product.Price
    })
    const grandtotal = totalpersamething?.reduce((a, b) => {
        return a + b
    }, 0)
    const formatPhoneNumber = (input: string): string => {
        const cleanedInput = input.replace(/\D/g, '').slice(0, 11); // Keep only digits and limit to 11 characters
        const firstPart = cleanedInput.slice(0, 4);
        const secondPart = cleanedInput.slice(4);

        if (cleanedInput.length > 4) {
            return `${firstPart}-${secondPart}`;
        }

        return firstPart;
    };

    const handleChange = (): void => {
        if (phoneNoRef.current) {
            const input: string = phoneNoRef.current.value;
            const formattedNumber: string = formatPhoneNumber(input);
            phoneNoRef.current.value = formattedNumber;
        }
    };
    return (
        <div className='w-9/12 mx-auto my-4' >
            <h1 className='font-extrabold text-4xl ' >CheckOut</h1>

            <form onSubmit={handlePlaceOrder} className={"flex flex-col w-full"} >
                {!UserDetailsIndb ?
                    <div>

                        <div className='flex my-2 gap-3 align-middle items-center ' >
                            <label htmlFor="address" className='' >Shipping Address</label>
                            <input type="text" name="address" id="address" ref={addressRef} className="input flex-grow p-3 bg-base-200" minLength={15} />
                        </div>
                        <div className='flex flex-wrap gap-2 flex-col' >
                            <div className='flex items-center  w-full justify-between ' >
                                <label htmlFor="city" >City:</label>
                                <input type="text" name="city" id="city" minLength={4} ref={cityRef} className="input bg-base-200" />
                            </div>
                            <div className='flex items-center w-full  justify-between ' >
                                <label htmlFor="city" >Province:</label>
                                <input type="text" name="city" id="city" minLength={4} ref={provinceRef} className="input bg-base-200" />
                            </div>
                            <div className='flex items-center w-full  justify-between ' >
                                <label htmlFor="city" >Cell:</label>
                                <input type="text" name="city" id="city" minLength={10} ref={phoneNoRef} className="input bg-base-200" />
                            </div>
                        </div>
                    </div> :
                    <div>

                        <div className='flex my-2 gap-3 align-middle items-center ' >
                            <label htmlFor="address" className='' >Shipping Address</label>
                            <input type="text" defaultValue={UserDetailsIndb.address} name="address" id="address" ref={addressRef} className="input flex-grow p-3 bg-base-200" disabled={!updateDetails} />
                        </div>
                        <div className='flex flex-wrap gap-2 flex-col' >
                            <div className='flex items-center  w-full justify-between ' >
                                <label htmlFor="city" >City:</label>
                                <input type="text" name="city" defaultValue={UserDetailsIndb.city} id="city" minLength={4} ref={cityRef} className="input bg-base-200" disabled={!updateDetails} />
                            </div>
                            <div className='flex items-center w-full  justify-between ' >
                                <label htmlFor="city" >Province:</label>
                                <input type="text" name="province" defaultValue={UserDetailsIndb.province} id="province" minLength={4} ref={provinceRef} className="input bg-base-200" disabled={!updateDetails} />
                            </div>
                            <div className='flex items-center w-full  justify-between ' >
                                <label htmlFor="city" >Cell:</label>
                                <input disabled={!updateDetails} type="text" defaultValue={UserDetailsIndb.phoneNo} name="cell" id="cell" minLength={7} ref={phoneNoRef} className="input bg-base-200" onChange={handleChange} />
                            </div>
                            {/*//! Fix this
                            When this button is clicked, automatically the order is getting placed */}
                            {!updateDetails ?
                                <div className='flex' ><button className='btn flex-grow' onClick={(e) => { e.preventDefault(); setUpdateDetails(true) }} >Edit Details</button></div>
                                : ""}
                        </div>

                    </div>
                }
                <div className='w-full mt-2' >
                    <h2 className='text-3xl font-semibold' >Order Detail</h2>
                    {
                        cartWithProducts ? cartWithProducts.map((item) => {
                            return <div key={item.product_id} className="flex flex-col" >
                                <div  >
                                    <p className='font-medium italic' >{item.product.ProductName}</p>
                                    <div className='float-right m-2' >{item.product.Price} x {item.product_quantity} = {item.product.Price * item.product_quantity}</div>
                                </div>

                            </div>
                        }) : ""}
                    <div className='font-semibold italic text-red-700 float-right pr-3' >{grandtotal ? `GrandTotal: ${grandtotal} PKRs` : ""}</div>
                </div>
                <button className='btn mt-2' >PlaceOrder </button>
            </form>
        </div>
    )
}

export default CheckOut