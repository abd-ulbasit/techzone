import React from 'react'
import { trpc } from '../utils/trpc'
import { useSession } from 'next-auth/react';
// import { Cart  } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

const Cart = () => {
    const { data: userSession } = useSession();
    const user_id = userSession?.user?.id ?? "";
    //this cart will have all the products fethced with in it
    const { data: cart } = trpc.cart.getCartWithProducts.useQuery({ user_id: user_id })
    const trpcContext = trpc.useContext();

    // console.log(cart);
    // const getUserCart
    const incrementIncartMutation = trpc.cart.AddOneToCart.useMutation({
        onSuccess(input) {
            trpcContext.cart.getCartWithProducts.invalidate({ user_id: user_id });
            trpcContext.cart.getnumberofItemsInCart.invalidate({ user_id: input.user_id })
            toast.success("Item added to cart")
        }
    });
    const cartDecrementMutation = trpc.cart.decrementFromCart.useMutation({
        onSuccess(input) {
            trpcContext.cart.getCartWithProducts.invalidate({ user_id: user_id });
            trpcContext.cart.getnumberofItemsInCart.invalidate({ user_id: input.user_id })
            toast.success("Item removed from cart")
        }
    });
    const removeFromCartMutation = trpc.cart.RemoveFromCart.useMutation({
        onSuccess(input) {

            trpcContext.cart.getCartWithProducts.invalidate({ user_id: input.user_id })
            trpcContext.cart.getnumberofItemsInCart.invalidate({ user_id: input.user_id })
            toast.success("Item removed from cart")
        }
    })
    // const cartType = typeof cart
    const handleIncermentinCart = (product_id: number) => {
        incrementIncartMutation.mutate({
            user_id: user_id, product_id: product_id
        })
        // toast.success("Item added to cart")
    }
    const handleDecremnetIncart = (product_id: number) => {
        // if (cart?.find((item) => item.product_id === product_id)?.product_quantity <= 0) {
        //     return;
        // }
        if (cart?.find((item) => item.product_id === product_id)?.product_quantity === 1) {
            // alert("you can not remove more items")
            removeFromCartMutation.mutate({ user_id: user_id, product_id: product_id })

        } else if (cart?.find((item) => item.product_id === product_id)?.product_quantity === 0) {
            toast.error("you can not remove more items")
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
            <div className='flex flex-wrap gap-6 justify-center '>
                {
                    cart ? cart.map((item) => {
                        return <div className="card z-10 w-96 bg-base-100 shadow-xl image-full" key={item.product_id}>
                            <figure><Image src={item.product.image} alt={item.product.ProductName} width={500} height={500} /></figure>
                            <div className="card-body">
                                <h2 className="card-title">{item.product.ProductName}</h2>
                                <p className='  font-semibold text-base-300' >{item.product.Price} x {item.product_quantity} = {item.product.Price * item.product_quantity}</p>
                                <div className="card-actions justify-end flex items-center">
                                    <button onClick={() => handleDecremnetIncart(item.product_id)} className='btn btn-ghost' ><Image src={"/static/remove_FILL0_wght400_GRAD0_opsz48.svg"} alt="-" width={30} height={30} /></button>
                                    <h2 className='font-semibold text-xl ' >{item.product_quantity}</h2>
                                    <button className='btn btn-ghost' onClick={() => handleIncermentinCart(item.product_id)} ><Image src={"/static/add_FILL0_wght400_GRAD0_opsz48.svg"} alt="+" width={30} height={30} /></button>
                                </div>

                            </div>
                        </div>
                    }) : ""
                }
            </div>
            {userSession &&
                <div className=' fixed right-12 bottom-12' >
                    <div className='text-center  bg-primary text-base-300 py-2 ' >{grandtotal} PKRs</div>
                    <Link href={`/CheckOut`} className=' p-3 rounded-sm hover:scale-105  hover:rounded-md btn' >Proceed to Checkout </Link>
                </div>}
        </div>
    )
}
export default Cart
