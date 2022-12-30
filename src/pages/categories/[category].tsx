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
    const product = data?.product;
    // console.log(products);



    return (
        <div>{product?.map((item) => {
            return <div key={item.pid}>
                <ProductCard props={item} />
            </div>
            // return <Image key={item.pid} src={} />

        })}</div>
    )
}

export default Category