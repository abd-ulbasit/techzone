import React, { useEffect } from 'react'
import { trpc } from '../utils/trpc'
import { useSession } from 'next-auth/react';
import type { Cart as CartType, Product } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useProductStore from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
interface CartWithProduct extends CartType {
    product: Product
}
const Cart = () => {
    const { data: userSession } = useSession();

    const productsInInventory = useProductStore(({ products }) => products)
    const user_id = userSession?.user?.id ?? "";
    const [cart, increaseQuantity, decreaseQuantity, removeFromCart] = useCartStore(state => [state.cart, state.increaseQuantity, state.decreaseQuantity, state.removeFromCart]);

    // const [cart, setCart] = React.useState<CartWithProduct[]>([])

    //this cart will have all the products fethced with in it


    const trpcContext = trpc.useContext();

    const incrementIncartMutation = trpc.cart.AddOneToCart.useMutation({
        onSuccess(_input) {
            trpcContext.cart.getCartWithProducts.invalidate({ user_id: user_id });
            toast.success("Item added to cart")
        }
    });
    const cartDecrementMutation = trpc.cart.decrementFromCart.useMutation({
        onSuccess(_input) {
            trpcContext.cart.getCartWithProducts.invalidate({ user_id: user_id });
            toast.success("Item removed from cart")
        }
    });
    const removeFromCartMutation = trpc.cart.RemoveFromCart.useMutation({
        onSuccess(input) {

            trpcContext.cart.getCartWithProducts.invalidate({ user_id: input.user_id })
            toast.success("Item removed from cart")
        }
    })
    const handleIncermentinCart = (product_id: number, productQuantity: number) => {
        if (!cart) return;
        // const { data: product } = trpc.products.getProductwithDetails.useQuery({ product_id })
        if (!(productQuantity < (
            (productsInInventory?.find((item) => item.pid === product_id) || {})?.quanity_in_inventory ?? -999
        ))
        ) {
            toast.error("you can not add more items")
            return;
        }

        increaseQuantity(product_id)
        incrementIncartMutation.mutate({
            user_id: user_id, product_id: product_id
        })
        // toast.success("Item added to cart")
    }
    const handleDecremnetIncart = (product_id: number) => {
        if (cart?.find((item) => item.product_id === product_id)?.product_quantity === 1) {

            removeFromCart(product_id)
            removeFromCartMutation.mutate({ user_id: user_id, product_id: product_id })

        } else if (cart?.find((item) => item.product_id === product_id)?.product_quantity === 0) {
            toast.error("you can not remove more items")
            return;
        } else {

            decreaseQuantity(product_id)
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
                            <figure><Image src={item?.product?.image ? item?.product?.image : ""} alt={item?.product?.ProductName ? item?.product?.ProductName : ""} width={500} height={500} /></figure>
                            <div className="card-body">
                                <h2 className="card-title">{item.product.ProductName}</h2>
                                <p className='  font-semibold text-base-300' >{item.product.Price} x {item.product_quantity} = {item.product.Price * item.product_quantity}</p>
                                <div className="card-actions justify-end flex items-center">
                                    <button onClick={() => handleDecremnetIncart(item.product_id)} className='btn btn-ghost' ><Image src={"/static/remove_FILL0_wght400_GRAD0_opsz48.svg"} alt="-" width={30} height={30} /></button>
                                    <h2 className='font-semibold text-xl ' >{item.product_quantity}</h2>
                                    <button className='btn btn-ghost' onClick={() => handleIncermentinCart(item.product_id, item.product_quantity)} ><Image src={"/static/add_FILL0_wght400_GRAD0_opsz48.svg"} alt="+" width={30} height={30} /></button>
                                </div>

                            </div>
                        </div>
                    }) : ""
                }
            </div>
            {userSession && grandtotal ?
                <div className=' fixed right-12 bottom-12 z-20' >
                    <div className='text-center  bg-primary text-base-300 py-2 ' >{grandtotal} PKRs</div>
                    <Link href={`/CheckOut`} className=' p-3 rounded-sm hover:scale-105  hover:rounded-md btn'  >Proceed to Checkout </Link>
                </div> : ""}
            {!grandtotal && <div className=' fixed right-12 bottom-12' >
                <div className='text-center  bg-primary text-base-300 py-2 px-6' >Cart Is Empty</div>
            </div>}
        </div>
    )
}
export default Cart
