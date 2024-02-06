import React, { useContext, useRef, useEffect } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
//import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
    const authForm = useRef();
    const { userAuth: { access_token }, setUserAuth } = useContext(UserContext);

    const userAuthThroughServer = (serverRoute, formData) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
            .then(({ data }) => {
                storeInSession("user", JSON.stringify(data));
                setUserAuth(data);
            })
            .catch(({ response }) => {
                const errorMessage = response.data && response.data.error ? response.data.error : 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์';
                toast.error(errorMessage);
            });
    };
    

    useEffect(() => {
        authForm.current = document.getElementById("formElement");
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        let serverRoute = type === "sign-in" ? "/signin" : "/signup";
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^.{6,20}$/; // regex for password

        let form = new FormData(authForm.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { fullname, email, password } = formData;

        if (type !== "sign-in" && (!fullname || fullname.length < 3)) {
            return toast.error("ชื่อผู้ใช้งานควรมีมากกว่าสามตัวอักษรขึ้นไป");
        }
        if (!email.length) {
            return toast.error("โปรดป้อนที่อยู่อีเมลล์");
        }
        if (!emailRegex.test(email)) {
            return toast.error("เกิดข้อผิดพลาด โปรดป้อนที่อยู่อีเมลล์ที่ถูกต้อง");
        }
        if (!passwordRegex.test(password)) {
            return toast.error("เกิดข้อผิดพลาด รหัสผ่านควรมีจำนวน 6-20 ตัวอักษร");
        }
        
        userAuthThroughServer(serverRoute, formData);

        console.log(formData);
    };

    const handleGoogleAuth = (e) => {
        e.preventDefault();
        // Assuming you have the authWithGoogle function implemented
        // authWithGoogle().then(user => {
        //     let serverRoute = "/google-auth";
        //     let formData = {
        //         access_token: user.accessToken
        //     }
        //     userAuthThroughServer(serverRoute, formData)
        // })
        // .catch(err => {
        //     toast.error('trouble login trough google');
        //     return console.log(err)
        // });
    };

    return (
        access_token ?
            <Navigate to="/" />
            :
            <AnimationWrapper keyValue={type}>
                <section className="h-cover flex items-center justify-center">
                    <Toaster />
                    <form id="formElement" className="w-[80%] max-w-[400px]">
                        <h1 className="text-4xl font-IBM font-bold capitalize text-center mb-24">
                            {type === "sign-in" ? "สวัสดีอีกครั้ง" : "เข้าร่วมวันนี้"}
                        </h1>

                        {type !== "sign-in" &&
                            <InputBox
                                name="fullname"
                                type="text"
                                placeholder="ชื่อผู้ใช้"
                                icon="fi-rr-user"
                            />
                        }

                        <InputBox
                            name="email"
                            type="email"
                            placeholder="email"
                            icon="fi-rr-at"
                        />

                        <InputBox
                            name="password"
                            type="password"
                            placeholder="ตั้งรหัสผ่าน"
                            icon="fi-rr-key"
                            style={{ fontFamily: "'IBM Plex Sans Thai', sans-serif" }}
                        />

                        <button
                            className="btn-dark center mt-14"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            {type.replace("-", " ")}
                        </button>

                        <div className="relative w-full flex items-center gap-2 my-10 opacity-10 text-black font-bold font-IBM text-dark-grey">
                            <hr className="w-1/2 border-black " />
                            <p>หรือ</p>
                            <hr className="w-1/2 border-black" />
                        </div>

                        <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center font-IBM" onClick={handleGoogleAuth}>
                            <img src={googleIcon} className="w-5 font-IBM" alt="Google Icon" />
                            ดำเนินการด้วย Google
                        </button>

                        {type === "sign-in" ?
                            <p className="mt-6 text-dark grey text-xl text-center font-IBM">
                                ยังไม่ได้ลงทะเบียนใช่ไหม ?
                                <Link to="/signup" className="underline text-black text-xl ml-1 font-IBM" >
                                    ลงทะเบียนเลย
                                </Link>
                            </p>
                            :
                            <p className="mt-6 text-dark grey text-xl text-center">
                                มีบัญชีที่ลงทะเบียนแล้ว ?
                                <Link to="/signin" className="underline text-black text-xl ml-1 font-IBM" >
                                    เข้าสู่ระบบ
                                </Link>
                            </p>
                        }
                    </form>
                </section>
            </AnimationWrapper>
    );
}

export default UserAuthForm;
