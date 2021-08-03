import React, {useEffect, useRef, useState} from "react";
import { FaSearch , FaUser , FaShoppingCart , FaBars } from "react-icons/fa";
import DesktopCategory from "../desktopCategory/desktopCategory";

function Header (props:{setOffCanvShow:Function}) {

    const [categoryShow , setCategoryShow] = useState(false)

    return(
        <header className={"w-full h-auto px-5 lg:px-36 pt-5 pb-3 shadow-md bg-white sticky top-0 z-50"}>
            <div className={"w-full h-auto flex flex-col md:flex-row items-center bg-white"}>
                <div dir={"ltr"} className={"w-full md:w-auto flex justify-between h-auto items-end mb-5 md:mb-4"}>

                    <div className={"flex items-end justify-center cursor-pointer"}>
                        <p className={"text-5xl md:text-5xl font-bold text-green-500"}>PC</p>
                        <p className={"text-2xl md:text-3xl font-normal text-gray-800 ml-1"}>Market</p>
                    </div>
                    <div className={"self-center"}>
                        <FaBars className={"h-full block md:hidden text-xl cursor-pointer"} onClick={()=> props.setOffCanvShow(true)}></FaBars>
                    </div>
                </div>
                <div className={"w-full h-11 flex justify-between md:mr-10"}>
                    <div className={"w-8/12 lg:w-6/12 bg-gray-100 rounded border-transparent px-3 flex"}>
                        <FaSearch className={"h-full text-2xl text-gray-400"}/>
                        <input placeholder={"جستجو ..."} className={"w-full px-2 bg-transparent placeholder-gray-400 text-gray-500 font-anjoman outline-none"}/>
                    </div>
                    <div className={"flex"}>
                        <div className={"pl-3 border-l-2 ml-3"}>
                            <div className={"h-full flex justify-center items-center border hover:border-gray-500 cursor-pointer rounded text-gray-400 hover:text-gray-600 p-2 text-center"}>
                                <p className={"h-full font-anjoman pl-3 hidden lg:block"}>ورود به حساب کاربری</p>
                                <FaUser className={"text-xl"}/>
                            </div>
                        </div>
                        <FaShoppingCart className={"text-4xl h-full text-green-500 cursor-pointer"}/>
                    </div>
                </div>
            </div>

            <div className={"hidden relative md:flex font-anjoman font-thin text-gray-500"} onMouseEnter={()=> setCategoryShow(true)} onMouseLeave={()=> setCategoryShow(false)}>
                <div className={"flex pb-1 border-l-2 pl-3 ml-3"}>
                    <button className={"hover:text-green-500"}>دسته بندی کالا ها</button>
                </div>
                <div className={`${!categoryShow && 'hidden'} absolute w-3/6 md:w-2/6 top-7 h-50`}><DesktopCategory/></div>
                <button className={"hover:text-green-500 text-sm ml-8"}>لپ تاپ ها</button>
                <button className={"hover:text-green-500 text-sm ml-8"}>کارت گرافیک ها</button>
                <button className={"hover:text-green-500 text-sm ml-8"}>هدفون ها</button>
            </div>
        </header>
    )
}

export default Header