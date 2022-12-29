import React, { useRef } from 'react'

const CheckOut = () => {
    const addressRef = useRef<HTMLInputElement>(null)
    const cityRef = useRef<HTMLInputElement>(null)
    const provinceRef = useRef<HTMLInputElement>(null)
    const phoneNoRef = useRef<HTMLInputElement>(null)
    const handleAddUserDetails = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(addressRef.current?.value);

    }
    return (
        <div className='w-9/12 mx-auto my-4' >
            <h1 className='font-extrabold text-4xl text-indigo-700' >CheckOut</h1>
            <form onSubmit={handleAddUserDetails} className={"flex flex-col"} >
                <div>
                    <label htmlFor="address">Shipping Address</label>
                    <input type="text" name="address" id="address" ref={addressRef} />
                </div>
                <div className='flex flex-row' >
                    <div>
                        <label htmlFor="city" >City</label>
                        <input type="text" name="city" id="city" minLength={4} ref={cityRef} />
                    </div>
                    <div>
                        <label htmlFor="province">Province</label>
                        <input type="text" name="province" id="province" minLength={4} ref={provinceRef} />
                    </div>
                    <div>
                        <label htmlFor="cellno">Cell No.</label>
                        <input type="text" name="cellno" id="cellno" minLength={8} ref={phoneNoRef} />
                    </div>
                </div>
                <button className='border bg-slate-200 p-2 mx-40' >PlaceOrder </button>
            </form>
        </div>
    )
}

export default CheckOut