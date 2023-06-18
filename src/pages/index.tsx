import { type NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
import { trpc } from "../utils/trpc";
import ProductCard from "../components/UI/ProductCard";
const Home: NextPage = () => {
  const { data: products } = trpc.products.getAllProducts.useQuery();
  // console.log(data);

  return (
    <>

      <Head>
        <title>Techzone</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main data-theme="retro" >
        <div className="" >
          <div>
            {products?.map((product) => {

              return <div key={product.pid} >
                <ProductCard props={product} />
              </div>
            })
            }
          </div>
        </div>
      </main>

    </>
  );
};
export default Home;