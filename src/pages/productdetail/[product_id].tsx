import { useRouter } from 'next/router'
import React from 'react'
import { trpc } from '../../utils/trpc';
import Image from 'next/image';
import ProductCard from '../../components/UI/ProductCard';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { data: UserSession } = useSession()
    const router = useRouter();
    const { product_id } = router.query;
    const ProuductId = product_id as string;
    const trpcContext = trpc.useContext();
    const updateInCartMutation = trpc.cart.AddOneToCart.useMutation({
        onSuccess(input) {
            toast.success("Item added to cart")
        }
    });
    const addToCartMutation = trpc.cart.addtoCart.useMutation({
        onSuccess(input) {
            toast.success("Item added to cart")
        }
    })
    const { data: cart } = trpc.cart.getUserCart.useQuery(undefined, { enabled: !!UserSession?.user?.id });
    const productIdInNumber = parseInt(ProuductId || "-1");
    const { data: product } = trpc.products.getProductwithDetails.useQuery({ product_id: productIdInNumber })
    const { data: similarProducts } = trpc.products.getsimilarProducts.useQuery({ category_id: product?.category_Id || -1 })
    const handleAddToCart = async (pid: number) => {
        if (!UserSession) {
            toast.error("LogIn to Add to Cart")
            return;
        }
        if (!((product?.quanity_in_inventory ?? -1) > (cart?.find((item) => item?.product_id === pid)?.product_quantity ?? 0))) {
            toast.error("Item is out of stock")
            return;
        }
        const user_id = UserSession.user?.id as string;
        // const productId = props.pid
        if (cart?.find((item) => item.product_id === pid)) {
            //item already in cart now increment in it.
            updateInCartMutation.mutate({ product_id: pid })
            return;
        } else {
            addToCartMutation.mutate({ quantity: 1, pId: pid })
        }
        // const userid=UserSession.user?.id
        // console.log("added to cart");

    }
    return (
        <div>
            <div className='flex flex-col gap-4 mx-auto my-6 w-3/4 md:flex-row  ' >
                <div className='' ><Image src={product?.image ? product?.image : ""} alt={product?.ProductName ? product.ProductName : ""} width={500} height={500} priority={false} /></div>
                <div className='basis-1/2'>
                    <h2 className='font-bold text-3xl py-2' >{product?.ProductName}</h2>
                    <div className='italic badge' >Rating: {product?.p_rating} / 5</div>
                    <div className='text-primaary-content'>{product?.full_description}</div>
                    <div className='italic text-lg ' >Only <span className='font-bold'>{product?.quanity_in_inventory}</span> Remaining</div>
                    <div className='font-bold ' >PKRs <span className='text-red-600 text-xl' >{product?.Price}</span></div>
                    <button className="btn" onClick={() => handleAddToCart(product?.pid || 0)} >
                        ADD TO CART
                    </button>
                </div>
            </div>
            <div>
                <h2 className='text-3xl font-bold ml-8 p-3' >Similar Products</h2>
                <div className="flex gap-3 flex-wrap  justify-center" >
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
        </div>
    )
}

export default ProductDetail