import type { Product } from '@prisma/client'
// import { TRPCContext } from '@trpc/react-query/shared';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import { useRouter } from 'next/router';
import React from 'react'
import { trpc } from '../../utils/trpc';
import toast from 'react-hot-toast';

const ProductCard = ({ props }: { props: Product }) => {
    const { data: UserSession } = useSession()
    const router = useRouter();
    const trpcContext = trpc.useContext();
    const updateInCartMutation = trpc.cart.AddOneToCart.useMutation({
        onSuccess() {
            // trpcContext.cart.getCart.invalidate({ user_id: UserSession?.user?.id || "" })
            trpcContext.cart.getnumberofItemsInCart.invalidate({ user_id: UserSession?.user?.id || "" })
            toast.success("Item Added to Cart")
        }
    });
    const addToCartMutation = trpc.cart.addtoCart.useMutation({
        onSuccess() {
            trpcContext.cart.getnumberofItemsInCart.invalidate({ user_id: UserSession?.user?.id || "" })
            toast.success("Item Added to Cart")

        }
    })
    const { data: cart } = trpc.cart.getUserCart.useQuery({ user_id: UserSession?.user?.id || "" });
    const handleAddToCart = async () => {

        if (!UserSession) {
            toast.error("LogIn to Add to Cart")
            return;
        }
        if (!(props.quanity_in_inventory > (cart?.find((item) => item?.product_id === props.pid)?.product_quantity ?? -9999))) {
            toast.error("Item out of stock")
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
        <div className="card card-compact w-80  sm:w-96  bg-base-100 shadow-xl scale-90 md:scale-95 lg:scale-100 ">
            <figure><Image src={props.image} alt={props.ProductName} width={400} height={300} priority /></figure>
            <div className="card-body">
                <h2 className="card-title line-clamp-3">{props.ProductName}</h2>
                <p>Only{props.quanity_in_inventory} remaining!</p>
                <p className='font-bold text-lg text-red-600' >{props.Price} PKRs</p>
                <div className="card-actions justify-end">
                    <button className='btn' onClick={handleAddToCart} >ADD TO CART </button>
                    <button className='btn' onClick={handleShowDetail} >Show Details</button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard