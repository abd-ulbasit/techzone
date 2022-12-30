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
            <div className='flex flex-wrap gap-6 mx-auto pb-12'>
                {
                    cart ? cart.map((item) => {
                        return <div key={item.product_id} className="border w-5/6 mx-auto" >
                            <div className=' flex  border justify-between items-center '>
                                <div>
                                    <div className='' >
                                        <Image src={item.product.image} alt={item.product.ProductName} width={120} height={120} />
                                    </div>
                                </div>
                                <div>
                                    <div>{item.product.ProductName}</div>
                                    <div>{item.product.Price} x {item.product_quantity} = {item.product.Price * item.product_quantity}</div>
                                </div>
                                <div className='flex items-center' >
                                    <button onClick={() => handleDecremnetIncart(item.product_id)} ><Image src={"/static/remove_FILL0_wght400_GRAD0_opsz48.svg"} alt="-" width={30} height={30} /></button>
                                    <h2 className='px-4 rounded-lg ' >{item.product_quantity}</h2>
                                    <button className='px-4 py-2 m-2' onClick={() => handleIncermentinCart(item.product_id)} ><Image src={"/static/add_FILL0_wght400_GRAD0_opsz48.svg"} alt="+" width={30} height={30} /></button>
                                </div>
                            </div>
                        </div>
                    }) : ""
                }
            </div>
            {userSession &&
                <div className=' fixed right-12 bottom-12' >
                    <div className=' bg-yellow-300 mx-auto text-center text-lg font-bold text-red-600 py-4 rounded-t-md' >{grandtotal} PKRs</div>
                    <Link href={`/CheckOut`} className=' p-3 bg-yellow-500 rounded-sm hover:scale-105  hover:rounded-md hover:bg-yellow-600 ' >Proceed to Checkout </Link>
                </div>}
        </div>
    )
}
export default Cart
