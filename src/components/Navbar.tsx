import type { ReactNode } from 'react'
import { trpc } from '../utils/trpc'
// import Image from 'next/image';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import type { Session } from 'next-auth';
const Navbar = ({ children }: { children: ReactNode }) => {
    const { data: sessionData } = useSession();
    const { data: catogoryData } = trpc.categories.getCatogoires.useQuery();
    return (
        <>
            <div className='bg-slate-800 flex  w-full items-center justify-between  ' >
                <div className='bg-slate-300 p-4  ' ><Link href={"/"} >TECHZONE</Link></div>
                <div className='flex'>

                    {catogoryData ? catogoryData.map((category) => {
                        return <div key={category.id} className={"bg-slate-500 py-2 px-6 m-2 w-auto rounded-md hover:scale-105 transition-all"} >
                            <Link href={`/categories/${category.category_name}`} >
                                {category.category_name}
                            </Link>
                        </div>
                    }) : ""
                    }
                </div>
                <div className='flex'>

                    {sessionData ?
                        <div className='rounded-full' >
                            <Image src={sessionData.user?.image || " "} alt='profilePic' width={40} height={40} className="rounded-full  m-2" />
                        </div> : <div className='w-10 h-10 rounded-full m-2 bg-slate-500' >
                            <Image src="/static/profilepic.png" alt="" width="40" height="40" className='rounded-full' />
                        </div>
                    }

                    <button onClick={() => sessionData ? signOut() : signIn()} className="bg-slate-500 px-5 py-1 hover:bg-slate-600 hover:scale-105 my-2 rounded-md "  > {sessionData ? "SignOut" : "SignIn"} </button>
                </div>
                <Cart session={sessionData} />
            </div>
            {children}
        </>
    )
}

export default Navbar



const Cart = ({ session }: { session: Session | null }) => {
    const user_id = session?.user?.id;
    if (!user_id) return null;
    const { data: noOfItemsInCart } = trpc.cart.getnumberofItemsInCart.useQuery({
        user_id
    })

    return (<div className='flex' >
        <Link href={"/Cart"} className="relative p-1 px-3 mx-3" >
            <Image src={"/static/shopping_cart_FILL0_wght400_GRAD0_opsz48.svg"} alt="Cart"
                width={40} height="40" className='bg-yellow-400  rounded-sm' ></Image>
            {
                noOfItemsInCart && noOfItemsInCart > 0 ?
                    <div className='bg-red-500 p-1 text-black  absolute -top-1 -right-1 rounded-full' >
                        {noOfItemsInCart}
                    </div> : null
            }
        </Link>
    </div>)

}