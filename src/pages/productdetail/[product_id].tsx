import { useRouter } from 'next/router'
import React from 'react'
import { trpc } from '../../utils/trpc';
import Image from 'next/image';
import ProductCard from '../../components/UI/ProductCard';
import { useSession } from 'next-auth/react';

const ProductDetail = () => {
    const { data: UserSession } = useSession()
    const router = useRouter();
    const { product_id } = router.query;
    const ProuductId = product_id as string;
    const updateInCartMutation = trpc.cart.AddOneToCart.useMutation();
    const addToCartMutation = trpc.cart.addtoCart.useMutation()
    const { data: cart } = trpc.cart.getUserCart.useQuery({ user_id: UserSession?.user?.id || "" });
    const productIdInNumber = parseInt(ProuductId);
    const { data: product } = trpc.products.getProductwithDetails.useQuery({ product_id: productIdInNumber })
    const { data: similarProducts } = trpc.products.getsimilarProducts.useQuery({ category_id: product?.category_Id })
    console.log(similarProducts);
    // const handleAddToCart = () => {
    //     // console.log("added");

    // }
    const handleAddToCart = async (pid: number) => {
        if (!UserSession) {
            alert("LogIn to Add to Cart")
            return;
        }
        const user_id = UserSession.user?.id as string;
        // const productId = props.pid
        if (cart?.find((item) => item.product_id === pid)) {
            //item already in cart now increment in it.
            updateInCartMutation.mutate({ user_id: user_id, product_id: pid })
            return;
        } else {
            addToCartMutation.mutate({ quantity: 1, pId: pid, uId: user_id })
        }
        // const userid=UserSession.user?.id
        // console.log("added to cart");

    }
    return (
        <div>
            <div className='flex gap-4 mx-auto my-6 w-3/4 ' >
                <div className='basis-1/2 border' ><Image src={product?.image || ""} alt={product?.ProductName || ""} width={500} height={500} /></div>
                <div className='basis-1/2'>
                    <h2 className='font-bold text-3xl py-2' >{product?.ProductName}</h2>
                    <div className='italic' >Rating: {product?.p_rating} / 5</div>
                    <div className='text-lg'>{product?.full_description}</div>
                    <div className='italic text-lg ' >Only <span className='font-bold'>{product?.quanity_in_inventory}</span> Remaining</div>
                    <div className='font-bold ' >PKRs <span className='text-red-600 text-xl' >{product?.Price}</span></div>
                    <button className='rounded-full bg-red-400 p-3 m-2 px-6 hover:bg-red-600 ' onClick={() => handleAddToCart(product?.pid || 0)} >
                        ADD TO CART
                    </button>
                </div>
            </div>
            <div>
                <h2 className='text-3xl font-bold ml-8 p-3' >Similar Products</h2>
                {similarProducts ? similarProducts.product.filter((item) => {
                    return item.pid !== product?.pid
                }).map((item) => {
                    return <div key={item.pid} >
                        <ProductCard props={item} ></ProductCard>
                    </div>
                })

                    : ""}
            </div>
        </div>
    )
}

export default ProductDetail