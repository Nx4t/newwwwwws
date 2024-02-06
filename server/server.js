import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';

import User from './Schema/User.js';

const server = express();
let PORT = 3000;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^.{6,20}$/; // regex for password

server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true,
});

const formatDatatoSend = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY);

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    };
};

const validateSignupInput = (fullname, email, password) => {
    if (!fullname || fullname.length < 3) {
        throw { status: 403, error: "ชื่อผู้ใช้งานควรมีมากกว่าสามตัวอักษรขึ้นไป" };
    }
    if (!email.length) {
        throw { status: 403, error: "โปรดป้อนที่อยู่อีเมลล์" };
    }
    if (!emailRegex.test(email)) {
        throw { status: 403, error: "เกิดข้อผิดพลาด โปรดป้อนที่อยู่อีเมลล์ที่ถูกต้อง" };
    }
    if (!passwordRegex.test(password)) {
        throw { status: 403, error: "เกิดข้อผิดพลาด รหัสผ่านควรมีจำนวน 6-20 ตัวอักษร" };
    }
};

const generateUsername = async (email) => {
    let username = email.split("@")[0];
    let isUsernameNotUnique = await User.exists({ "personal_info.email": email }).then((result) => result)
    isUsernameNotUnique ? username += nanoid().substring(0, 5) : "";
    return username
}

server.post("/signup", async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        validateSignupInput(fullname, email, password);

        const hashed_password = await bcrypt.hash(password, 10);
        const username = await generateUsername(email);

        const user = new User({
            personal_info: { fullname, email, password: hashed_password, username },
        });

        const savedUser = await user.save();
        res.status(200).json(formatDatatoSend(savedUser));
    } catch (error) {
        res.status(error.status || 500).json({ error: error.error || "Internal Server Error" });
    }
});

server.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ "personal_info.email": email });

        if (!user) {
            throw { status: 403, error: "Email not found" };
        }

        const result = await bcrypt.compare(password, user.personal_info.password);

        if (!result) {
            throw { status: 403, error: "รหัสผ่าไม่ถูกต้อง โปรดลองอีกครั้ง" };
        }

        res.status(200).json(formatDatatoSend(user));
    } catch (error) {
        res.status(error.status || 500).json({ error: error.error || "Internal Server Error" });
    }
});

server.listen(PORT, () => {
    console.log('listening on port -> ' + PORT);
});
