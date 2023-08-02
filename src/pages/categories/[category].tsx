import { useRouter } from 'next/router'
import React from 'react'
import ProductCard from '../../components/UI/ProductCard';
import useProductStore from '../../stores/productStore';
const Category = () => {
    const router = useRouter();
    const categoryId = parseInt(router.query.category as string)
    const products = useProductStore(({ products }) => products).filter((product) => product.category_Id === categoryId)

    return (
        <div className="flex gap-3 flex-wrap  justify-center items-start " >

            {products?.map((product) => {

                return <div key={product.pid} >
                    <ProductCard props={product} />
                </div>
            })
            }
        </div>
    )
}

export default Category