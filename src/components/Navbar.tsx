import type { ReactNode } from 'react'
import { trpc } from '../utils/trpc'
import { FaShoppingCart } from "react-icons/fa"
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import type { Session } from 'next-auth';
const Navbar = ({ children }: { children: ReactNode }) => {
    const { data: sessionData } = useSession();
    const { data: catogoryData } = trpc.categories.getCatogoires.useQuery();
    return (
        <>
            <div className=' flex  w-full items-center justify-between  ' >
                <div className='p-4  ' ><Link href={"/"} >TECHZONE</Link></div>

                <div className="drawer">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        {/* Page content here */}
                        <label htmlFor="my-drawer" className="btn  drawer-button">Categories</label>
                    </div>
                    <div className="drawer-side z-50">
                        <label htmlFor="my-drawer" className="drawer-overlay"></label>
                        <ul className="menu p-4 w-80 h-full text-base-content bg-base-100">
                            {/* Sidebar content here */}

                            {catogoryData ? catogoryData.map((category) => {
                                return <li key={category.id} className={" btn btn-outline my-1 "} >
                                    <Link href={`/categories/${category.category_name}`} >
                                        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                                        {category.category_name}
                                    </Link>
                                </li>
                            }) : ""
                            }
                        </ul>
                    </div>
                </div>
                <div className='flex'>

                </div>
                <div className='flex gap-3 items-center '>

                    {sessionData ?
                        <div className='rounded-full w-10 h-10' >
                            <Image src={sessionData.user?.image || " "} alt='profilePic' width={40} height={40} className="rounded-full " />
                        </div> : <div className='w-10 h-10 rounded-full ' >
                            <Image src="/static/profilepic.png" alt="" width="40" height="40" className='rounded-full' />
                        </div>
                    }

                    <button onClick={() => sessionData ? signOut() : signIn()} className="btn"  > {sessionData ? "SignOut" : "SignIn"} </button>
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

    return (<Link href={"/Cart"} className="relative pl-2 pr-6 " >
        <FaShoppingCart className="text-2xl" />
        {
            noOfItemsInCart && noOfItemsInCart > 0 ?
                <div className='bg-red-500 p-1 text-black  absolute -top-4 right-1 rounded-full text-sm' >
                    {noOfItemsInCart}
                </div> : null
        }
    </Link>)

}