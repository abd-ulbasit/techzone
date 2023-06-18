import React, { useRef } from 'react'
import { trpc } from '../utils/trpc';
import { useSession } from 'next-auth/react';

const CheckOut = () => {
    const { data: userSession } = useSession();
    const user_id = userSession?.user?.id as string;
    //this cart will have all the products fethced with in it
    const { data: cartX } = trpc.cart.getCart.useQuery({ user_id: user_id })
    // const { data: userSession } = useSession();

    // const user_id = userSession?.user?.id as string;
    const { data: cart } = trpc.cart.getUserCart.useQuery({ user_id: user_id });
    // console.log(cart);
    const addOrderDetailM = trpc.orderdetail.addOrderDetails.useMutation()
    const adduserDetailMutation = trpc.userdetail.addUserDetail.useMutation()
    const addOrderMutation = trpc.orders.addNewOrder.useMutation();
    // const orderdetailMutation = trpc.orderdetail.addOrderDetails.useMutation()
    const { data: order } = trpc.orders.getorderDetails.useQuery({ user_id: user_id })
    console.log(order);
    const emptyCartM = trpc.cart.emptyCart.useMutation()

    const addressRef = useRef<HTMLInputElement>(null);
    const cityRef = useRef<HTMLInputElement>(null);
    const provinceRef = useRef<HTMLInputElement>(null);
    const phoneNoRef = useRef<HTMLInputElement>(null);

    const handleAddUserDetails = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            user_id: user_id,
            address: addressRef.current?.value as string,
            city: cityRef.current?.value as string,
            province: provinceRef.current?.value as string,
            phoneNo: phoneNoRef.current?.value as string
        });

        adduserDetailMutation.mutate({
            user_id: user_id,
            address: addressRef.current?.value as string,
            city: cityRef.current?.value as string,
            province: provinceRef.current?.value as string,
            phoneNo: phoneNoRef.current?.value as string,

        })
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

                addOrderDetailM.mutate({
                    order_id: order?.order_id as number,
                    product_id: item.product_id,
                    quantity: item.product_quantity

                })
            }
        }
        emptyCartM.mutate({ user_id: user_id })
        // console.log(addressRef.current?.value);
        alert("Your Order has been placed . GO to homePage")
    }
    const totalpersamething = cartX?.map((item) => {
        return item.product_quantity * item.product.Price
    })
    const grandtotal = totalpersamething?.reduce((a, b) => {
        return a + b
    }, 0)
    return (
        <div className='w-9/12 mx-auto my-4' >
            <h1 className='font-extrabold text-4xl text-primary-content' >CheckOut</h1>
            <form onSubmit={handleAddUserDetails} className={"flex flex-col w-full"} >
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
                <div className='w-full ' >
                    {
                        cartX ? cartX.map((item) => {
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