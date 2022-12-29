import { useRouter } from 'next/router'
import React from 'react'
import { trpc } from '../../utils/trpc';
import Image from 'next/image';
import ProductCard from '../../components/UI/ProductCard';

const ProductDetail = () => {
    const router = useRouter();
    const { product_id } = router.query;
    const ProuductId = product_id as string;
    const productIdInNumber = parseInt(ProuductId);
    const { data: product } = trpc.products.getProductwithDetails.useQuery({ product_id: productIdInNumber })
    const { data: similarProducts } = trpc.products.getsimilarProducts.useQuery({ category_id: product?.category_Id })
    console.log(similarProducts);
    const handleAddToCart = () => {
        console.log("added");

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
                    <button className='rounded-full bg-red-400 p-3 m-2 px-6 hover:bg-red-600 ' onClick={handleAddToCart} >
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