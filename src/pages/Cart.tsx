import React from 'react'
import { trpc } from '../utils/trpc'
import { useSession } from 'next-auth/react';
// import { Cart  } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

const Cart = () => {
    const { data: userSession } = useSession();
    const user_id = userSession?.user?.id as string;
    //this cart will have all the products fethced with in it
    const { data: cart } = trpc.cart.getCart.useQuery({ user_id: user_id })
    // console.log(cart);
    // const getUserCart
    const incrementIncartMutation = trpc.cart.AddOneToCart.useMutation();
    const cartDecrementMutation = trpc.cart.decrementFromCart.useMutation();
    const removeFromCartMutation = trpc.cart.RemoveFromCart.useMutation()
    // const cartType = typeof cart
    const handleIncermentinCart = (product_id: number) => {
        incrementIncartMutation.mutate({
            user_id: user_id, product_id: product_id
        })
    }
    const handleDecremnetIncart = (product_id: number) => {
        // if (cart?.find((item) => item.product_id === product_id)?.product_quantity <= 0) {
        //     return;
        // }
        if (cart?.find((item) => item.product_id === product_id)?.product_quantity === 1) {
            // alert("you can not remove more items")
            removeFromCartMutation.mutate({ user_id: user_id, product_id: product_id })

        } else if (cart?.find((item) => item.product_id === product_id)?.product_quantity === 0) {
            alert("you can not remove more items")
            return;
        } else {
            cartDecrementMutation.mutate({
                user_id: user_id, product_id: product_id
            })
        }
    }
    const totalpersamething = cart?.map((item) => {
        return item.product_quantity * item.product.Price
    })
    const grandtotal = totalpersamething?.reduce((a, b) => {
        return a + b
    }, 0)
    return (
        <div>
            <div className='flex flex-wrap gap-6 content-center align-middle'>
                {
                    cart ? cart.map((item) => {
                        // return <div className="card lg:card-side bg-base-100 shadow-xl w-2/5 w-" key={item.product_id} >
                        //     <figure><Image src={item.product.image} alt={item.product.ProductName} width={300} height={300} /></figure>
                        //     <div className="card-body">
                        //        

                        //     </div>
                        // </div>
                        return <div className="card w-96 bg-base-100 shadow-xl image-full" key={item.product_id}>
                            <figure><Image src={item.product.image} alt={item.product.ProductName} width={500} height={500} /></figure>
                            <div className="card-body">
                                <h2 className="card-title">{item.product.ProductName}</h2>
                                <p className='  font-semibold text-base-300' >{item.product.Price} x {item.product_quantity} = {item.product.Price * item.product_quantity}</p>
                                <div className="card-actions justify-end flex items-center">
                                    <button onClick={() => handleDecremnetIncart(item.product_id)} className='btn' ><Image src={"/static/remove_FILL0_wght400_GRAD0_opsz48.svg"} alt="-" width={30} height={30} /></button>
                                    <h2 className='font-semibold text-xl ' >{item.product_quantity}</h2>
                                    <button className='btn' onClick={() => handleIncermentinCart(item.product_id)} ><Image src={"/static/add_FILL0_wght400_GRAD0_opsz48.svg"} alt="+" width={30} height={30} /></button>
                                </div>

                            </div>
                        </div>
                    }) : ""
                }
            </div>
            {userSession &&
                <div className=' fixed right-12 bottom-12' >
                    <div className=' mx-auto text-center text-lg font-bold text-red-600 py-4 rounded-t-md' >{grandtotal} PKRs</div>
                    <Link href={`/CheckOut`} className=' p-3 rounded-sm hover:scale-105  hover:rounded-md ' >Proceed to Checkout </Link>
                </div>}
        </div>
    )
}
export default Cart
