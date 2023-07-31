import { type NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
import { trpc } from "../utils/trpc";
import ProductCard from "../components/UI/ProductCard";
const Home: NextPage = () => {
  const { data: products, error } = trpc.products.getAllProducts.useQuery(undefined, { retry: false });
  // console.log(data);
  if (error?.message) {
    return <div>{error.message}</div>
  }

  return (
    <>

      <Head>
        <title>Techzone</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        <div className="flex gap-3 flex-wrap  justify-center" >

          {products?.map((product) => {

            return <div key={product.pid} >
              <ProductCard props={product} />
            </div>
          })
          }
        </div>
      </main>

    </>
  );
};
export default Home;