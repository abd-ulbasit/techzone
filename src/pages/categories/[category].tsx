import { useRouter } from 'next/router'
import React from 'react'
import { trpc } from '../../utils/trpc';
// import Image from 'next/image';
import ProductCard from '../../components/UI/ProductCard';
const Category = () => {
    const router = useRouter();
    // const { category }:{category:string} = router.query.;
    const category = router.query.category
    const aCategory = category as string;
    const { data } = trpc.categories.getProductbyCategory.useQuery({ category: aCategory });
    console.log(category);
    const products = data?.product;
    // console.log(products);



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