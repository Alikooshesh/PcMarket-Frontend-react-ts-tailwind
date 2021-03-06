import React, {useEffect, useState} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {login, logout} from "../../redux/reducers/userAuthReducer/userAuthReducer";
import {useHistory} from "react-router-dom";

function LoginPage() {

    const dispatch = useDispatch()
    const history = useHistory()

    const userAuthRedux = useSelector((state:any) => state.userAuth)

    const [box,setBox] = useState<number>(1)
    const [phoneNumber , setPhoneNumer] = useState<number|string>("")
    const [code , setCode] = useState<number|string>("")
    const [fullName , setFullName] = useState<string>("")
    const [loading,setLoading] = useState<boolean>(false)
    const [errText,setErrText] = useState<string|boolean>(false)

    function phoneInputChangeHandle(e:React.ChangeEvent<HTMLInputElement>) {
        if (`${phoneNumber}`.length < 11 || e.target.value.length < 11){
            e.target.value == '0' && setPhoneNumer(0)
            e.target.value == "" && setPhoneNumer("")
            parseInt(e.target.value) && setPhoneNumer(e.target.value)
        }
    }

    function codeInputChangeHandle(e:React.ChangeEvent<HTMLInputElement>) {
        if (`${code}`.length < 4 || e.target.value.length < 4){
            e.target.value == '0' && setCode(0)
            e.target.value == "" && setCode("")
            parseInt(e.target.value) && setCode(e.target.value)
        }
    }

    function sendCodeBtnClick() {
        setErrText(false)
        const phoneRegex:RegExp = /^(\+98|0098|98|0)?9\d{9}$/

        if(phoneRegex.test(`${phoneNumber}`)){
            if (!loading){
                setLoading(true)
                axios.post('https://pcmarket-server-api.herokuapp.com/userLogin',{phoneNumber : phoneNumber})
                    .then(res => {
                        setBox(2)
                        setLoading(false)
                        console.log(res)
                    })
                    .catch(err => {
                        setErrText("ارسال پیامک با خطا مواجه شد . دوباره امتحان کنید .")
                        console.log(err)
                        setLoading(false)
                    })
            }
        }else {
            setErrText("شماره موبایل نامعتبر است")
        }
    }

    function verifyCodeBtnClick() {
        setErrText(false)
        if (!loading){
            setLoading(true)
            axios.post('https://pcmarket-server-api.herokuapp.com/userLogin/verifyCode',{phoneNumber : phoneNumber , verifyCode : code})
                .then(res => {
                    console.log(res.data)
                    if (res.data.fullName){
                        dispatch(login({userId : res.data.userId , fullName : res.data.fullName , phoneNumber : res.data.phone , tokenId : res.data.tokenId}))
                        history.push('/dashboard')
                    }else {
                        dispatch(login({userId : res.data.userId , fullName : "" , phoneNumber : res.data.phone , tokenId : res.data.tokenId}))
                        setBox(3)
                        setLoading(false)
                    }
                })
                .catch(err => {
                    err.status == 404 && setErrText("شماره موبایل وارد شده نامعتبر است")
                    err.status != 404 && setErrText("کد وارد شده نامعتبر است")
                    console.log(err)
                    setLoading(false)
                })
        }
    }

    function addFullName() {
        setErrText(false)
        if(fullName.length>3){
            axios.post('https://pcmarket-server-api.herokuapp.com/user/fullName',{tokenId : userAuthRedux.tokenId , newFullName : fullName})
                .then(res =>{
                    dispatch(login({userId : res.data.userId , fullName : res.data.fullName , phoneNumber : res.data.phone , tokenId : res.data.tokenId}))
                    history.push('/dashboard')
                })
                .catch(err => {
                    err.status == 403 && setErrText("دسترسی شما منقضی شده است . لطفا دوباره وارد شوید .") && dispatch(logout())
                    err.status == 404 && setErrText("دریافت اطلاعات با خطا مواجه شد . دوباره امتحان کنید .")
                    console.log(err)
                    setLoading(false)
                })
        }else {setErrText("نام و نام خانوادگی نمی تواند کمتر از 3 حرف باشد .")}
    }

    useEffect(()=>{
        userAuthRedux.isLogin && history.push('/dashboard')
    },[])

    return(
        <div className={"w-full h-full flex justify-center items-center bg-gray-300 p-3 font-anjoman"}>
            <div className={`${box != 1 && 'hidden'} w-full md:w-2/4 lg:w-2/5 xl:w-1/4 bg-gray-200 rounded-lg px-3 py-2 text-center font-anjoman text-gray-600`}>
                <label htmlFor={"phone"}>شماره موبایلتان را وارد کنید</label>
                <input id={"phone"} placeholder={"09120000000"} className={"w-full h-8 p-2 text-center mt-1"} value={phoneNumber} onChange={phoneInputChangeHandle}/>

                <button className={`w-2/3 h-9 bg-green-500 hover:bg-green-600 rounded-lg mt-2 text-gray-100`} onClick={sendCodeBtnClick}>ارسال کد یک بار مصرف</button>
                <p className={`${!errText && 'hidden'} text-red-500`}>{errText}</p>
            </div>

            <div className={`${box != 2 && 'hidden'} w-full md:w-2/4 lg:w-2/5 xl:w-1/4 bg-gray-200 rounded-lg px-3 py-2 text-center font-anjoman text-gray-600`}>
                <div className={"w-full flex justify-between items-center"}>
                    <p>{`شماره تلفن شما : ${phoneNumber}`}</p>
                    <button className={"text-blue-400 text-xs"} onClick={()=> setBox(1)}>تغییر شماره</button>
                </div>
                <label htmlFor={"code"} className={"mt-3"}>کد پیامک شده را وارد کنید</label>
                <input id={"code"} placeholder={"0000"} className={"w-full h-8 p-2 text-center mt-1"} value={code} onChange={codeInputChangeHandle}/>

                <button className={"w-2/3 h-9 border-red-400 border-1 hover:bg-red-400 rounded-lg mt-2 text-red-400 hover:text-gray-200"}>ارسال مجدد</button>
                <button className={"w-2/3 h-9 bg-green-500 hover:bg-green-600 border-green-500 border-1 rounded-lg mt-2 text-gray-100"} onClick={verifyCodeBtnClick}>ورود</button>
                <p className={`${!errText && 'hidden'} text-red-500`}>{errText}</p>
            </div>

            <div className={`${box != 3 && 'hidden'} w-full md:w-2/4 lg:w-2/5 xl:w-1/4 bg-gray-200 rounded-lg px-3 py-2 text-center font-anjoman text-gray-600`}>
                <div className={"w-full flex justify-between items-center"}>
                    <p>{`شماره تلفن شما : ${phoneNumber}`}</p>
                    <button className={"text-blue-400 text-xs"} onClick={()=> setBox(1)}>تغییر شماره</button>
                </div>
                <label htmlFor={"fullName"} className={"mt-3"}>نام و نام خانوادگیتان را وارد کنید</label>
                <input id={"fullName"} placeholder={"مهران مدیری"} className={"w-full h-8 p-2 text-center mt-1"}
                       value={fullName} onChange={(e:React.ChangeEvent<HTMLInputElement>)=> setFullName(e.target.value)}/>

                <button className={"w-2/3 h-9 bg-green-500 hover:bg-green-600 border-green-500 border-1 rounded-lg mt-2 text-gray-100"} onClick={addFullName}>ورود به داشبورد</button>
                <p className={`${!errText && 'hidden'} text-red-500`}>{errText}</p>
            </div>
        </div>
    )
}

export default LoginPage