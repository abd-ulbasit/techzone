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
            <div className=' flex  w-full items-center justify-between  ' >
                <div className='p-4  ' ><Link href={"/"} >TECHZONE</Link></div>

                <div className="drawer">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        {/* Page content here */}
                        <label htmlFor="my-drawer" className="btn  drawer-button">Categories</label>
                    </div>
                    <div className="drawer-side">
                        <label htmlFor="my-drawer" className="drawer-overlay"></label>
                        <ul className="menu p-4 w-80 h-full text-base-content">
                            {/* Sidebar content here */}

                            {catogoryData ? catogoryData.map((category) => {
                                return <li key={category.id} className={"py-2 px-6 m-2 w-auto rounded-md hover:scale-105 transition-all"} >
                                    <Link href={`/categories/${category.category_name}`} >
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
                <div className='flex'>

                    {sessionData ?
                        <div className='rounded-full' >
                            <Image src={sessionData.user?.image || " "} alt='profilePic' width={40} height={40} className="rounded-full  m-2" />
                        </div> : <div className='w-10 h-10 rounded-full m-2 ' >
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