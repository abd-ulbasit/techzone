import type { Product } from '@prisma/client'
// import { TRPCContext } from '@trpc/react-query/shared';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import { useRouter } from 'next/router';
import React from 'react'
import { trpc } from '../../utils/trpc';

const ProductCard = ({ props }: { props: Product }) => {
    const { data: UserSession } = useSession()
    const router = useRouter();
    const updateInCartMutation = trpc.cart.AddOneToCart.useMutation();
    const addToCartMutation = trpc.cart.addtoCart.useMutation()
    const { data: cart } = trpc.cart.getUserCart.useQuery({ user_id: UserSession?.user?.id || "" });
    const handleAddToCart = async () => {
        if (!UserSession) {
            alert("LogIn to Add to Cart")
            return;
        }
        const user_id = UserSession.user?.id as string;
        const productId = props.pid
        if (cart?.find((item) => item.product_id === props.pid)) {
            //item already in cart now increment in it.
            updateInCartMutation.mutate({ user_id: user_id, product_id: productId })
            return;
        } else {
            addToCartMutation.mutate({ quantity: 1, pId: productId, uId: user_id })
        }
        // const userid=UserSession.user?.id
        // console.log("added to cart");

    }
    const handleShowDetail = () => {
        // console.log("show detail");
        // alert("show detail")
        router.push(`/productdetail/${props.pid}`)
    }
    return (
        <div className='border border-red-800 rounded-lg flex flex-row p-3 mx-auto w-4/6 my-2'>
            <div className='w-40 h-40 ' >
                <Image src={props.image} alt={props.ProductName} width={500} height={500} loading="lazy" className="bg-cover" />
            </div>
            <div className='px-4' >
                <div>{props.ProductName}</div>
                <div>Only {props.quanity_in_inventory} remaining!</div>
                <div className='font-bold text-lg text-red-600' >{props.Price} PKRs</div>
                <button className='rounded-lg bg-red-400 p-3 m-2' onClick={handleAddToCart} >ADD TO CART </button>
                <button className='rounded-lg bg-purple-500 p-3 m-2' onClick={handleShowDetail} >Show Details</button>
            </div>
        </div>
    )
}

export default ProductCard