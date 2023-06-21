import { trpc } from '../utils/trpc'
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
const Navbar = ({ children }: { children: React.ReactNode }) => {
    // const { setTheme, theme } = useTheme()


    const { data: sessionData } = useSession();
    const { data: catogoryData } = trpc.categories.getCatogoires.useQuery();
    const { data: noOfItemsInCart } = trpc.cart.getnumberofItemsInCart.useQuery({
        user_id: sessionData?.user?.id ? sessionData?.user?.id : ""
    })
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }
    return (
        <>
            <div className="navbar bg-base-200 bg-opacity-60 z-20 fixed backdrop-blur-md">
                <div className="flex-none">
                    <div className="drawer">
                        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content ">
                            <label htmlFor="my-drawer" className="btn  drawer-button btn-ghost flex flex-row  ">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className=" w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>Categories</label>
                        </div>
                        <div className="drawer-side z-20 ">
                            <label htmlFor="my-drawer" className="drawer-overlay"></label>
                            <ul className="menu p-4 w-80 h-full text-base-content bg-base-100 flex flex-col">

                                {catogoryData ? catogoryData.map((category) => {
                                    return <li key={category.id} className={" btn btn-outline my-1 "} >
                                        <Link href={`/categories/${category.category_name}`} >
                                            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                                            {category.category_name}
                                        </Link>
                                    </li>
                                }) : ""
                                }
                                <div className='flex flex-grow items-end content-center' >

                                    <button className='btn btn-block' onClick={() => { setTheme(theme == "night" ? "lofi" : "night") }} >
                                        {theme}
                                    </button>
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <Link href={"/"} className="btn btn-ghost normal-case text-xl">TechZone</Link>
                </div>
                <div className="flex-none z-10">
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                <span className="badge badge-sm indicator-item">{noOfItemsInCart}</span>
                            </div>
                        </label>
                        <div tabIndex={0} className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow z-10">
                            <div className="card-body">
                                <span className="font-bold text-lg">{noOfItemsInCart} {noOfItemsInCart == 1 ? "Item" : "Items"}</span>
                                {/* <span className="text-info">Subtotal: $999</span> */}
                                <div className="card-actions">
                                    <Link href={"/Cart"} className="btn btn-primary btn-block">View cart</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <Image src={sessionData?.user?.image ? sessionData.user.image : '/static/profilepic.png'} width={40} height={40} alt='ProfilePic' />
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                            <li><button onClick={() => sessionData ? signOut() : signIn()} className=""  > {sessionData ? "SignOut" : "SignIn"} </button></li>

                        </ul>
                    </div>
                </div>
            </div>
            <div className='pt-24'>
                {children}
            </div>
        </>

    )
}
export default Navbar
