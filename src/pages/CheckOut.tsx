import React, { useRef } from 'react'
import { trpc } from '../utils/trpc';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import type { Cart } from '@prisma/client';

const CheckOut = () => {
    const [updateDetails, setUpdateDetails] = React.useState(false)
    //first we have to find if the user details are already present in the database or not
    //if they are present then we have to fetch them 
    //if they want to update the details first update thier details.
    //if they are not present then we have to show the form and then add them to the database
    //after that we have to add the order details to the database
    //after that we have to empty the cart

    const { data: userSession } = useSession();
    const user_id = userSession?.user?.id as string;
    //this cart will have all the products fethced with in it
    const { data: cartWithProducts } = trpc.cart.getCartWithProducts.useQuery({ user_id: user_id })
    console.log({ cartWithProducts });
    //extracting the cart from the cartWithProducts
    const cart: Cart[] | undefined = cartWithProducts?.map((item) => {
        return {
            product_id: item.product_id,
            product_quantity: item.product_quantity,
            user_id: item.user_id
        }
    })
    const { data: UserDetailsIndb } = trpc.userdetail.getUserDetail.useQuery({ user_id: user_id })
    const addOrderDetailMutation = trpc.orderdetail.addOrderDetails.useMutation()
    const adduserDetailMutation = trpc.userdetail.addUserDetail.useMutation()
    const updateUserDetailsMutation = trpc.userdetail.updateUserDetail.useMutation()
    const addOrderMutation = trpc.orders.addNewOrder.useMutation();
    // const orderdetailMutation = trpc.orderdetail.addOrderDetails.useMutation()
    const { data: order } = trpc.orders.getorderDetails.useQuery({ user_id: user_id })
    console.log(order);
    const emptyCartM = trpc.cart.emptyCart.useMutation()

    const addressRef = useRef<HTMLInputElement>(null);
    const cityRef = useRef<HTMLInputElement>(null);
    const provinceRef = useRef<HTMLInputElement>(null);
    const phoneNoRef = useRef<HTMLInputElement>(null);

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
        console.log({
            user_id: user_id,
            address: addressRef.current?.value as string,
            city: cityRef.current?.value as string,
            province: provinceRef.current?.value as string,
            phoneNo: phoneNoRef.current?.value as string
        });

        addOrderMutation.mutate({
            user_id: user_id,
        })
        // if (cart) {

        //     for (const item of cart) {
        //         orderdetailMutation.mutate({
        //             order_id: addOrderMutation.data?.order_id as number,
        //             product_id: item.product_id,
        //             quantity: item.product_quantity
        //         })
        //     }
        // }
        if (cart) {

            for (const item of cart) {

                addOrderDetailMutation.mutate({
                    order_id: order?.order_id as number,
                    product_id: item.product_id,
                    quantity: item.product_quantity

                })
            }
        }
        emptyCartM.mutate({ user_id: user_id })
        // console.log(addressRef.current?.value);
        //? This should run on successful order placement
        toast.success("Your Order has been placed")
        setTimeout(() => {
            window.location.href = "/"
        }
            , 2000)
    }
    const totalpersamething = cartWithProducts?.map((item) => {
        return item.product_quantity * item.product.Price
    })
    const grandtotal = totalpersamething?.reduce((a, b) => {
        return a + b
    }, 0)
    return (
        <div className='w-9/12 mx-auto my-4' >
            <h1 className='font-extrabold text-4xl ' >CheckOut</h1>

            <form onSubmit={handlePlaceOrder} className={"flex flex-col w-full"} >
                {!UserDetailsIndb ?
                    <div>

                        <div className='flex my-2 gap-3 align-middle items-center ' >
                            <label htmlFor="address" className='' >Shipping Address</label>
                            <input type="text" name="address" id="address" ref={addressRef} className="input flex-grow p-3 bg-base-200" />
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
                                <input type="text" name="city" id="city" minLength={7} ref={phoneNoRef} className="input bg-base-200" />
                            </div>
                        </div>
                    </div> :
                    <div>

                        <div className='flex my-2 gap-3 align-middle items-center ' >
                            <label htmlFor="address" className='' >Shipping Address</label>
                            <input type="text" value={UserDetailsIndb.address} name="address" id="address" ref={addressRef} className="input flex-grow p-3 bg-base-200" disabled={!updateDetails} />
                        </div>
                        <div className='flex flex-wrap gap-2 flex-col' >
                            <div className='flex items-center  w-full justify-between ' >
                                <label htmlFor="city" >City:</label>
                                <input type="text" name="city" value={UserDetailsIndb.city} id="city" minLength={4} ref={cityRef} className="input bg-base-200" disabled={!updateDetails} />
                            </div>
                            <div className='flex items-center w-full  justify-between ' >
                                <label htmlFor="city" >Province:</label>
                                <input type="text" name="province" value={UserDetailsIndb.province} id="province" minLength={4} ref={provinceRef} className="input bg-base-200" disabled={!updateDetails} />
                            </div>
                            <div className='flex items-center w-full  justify-between ' >
                                <label htmlFor="city" >Cell:</label>
                                <input disabled={!updateDetails} type="text" value={UserDetailsIndb.phoneNo} name="cell" id="cell" minLength={7} ref={phoneNoRef} className="input bg-base-200" />
                            </div>
                            <div className='flex' onClick={() => setUpdateDetails(true)} ><button className='btn float-right' >Edit Details</button></div>
                        </div>

                    </div>
                }
                <div className='w-full ' >
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