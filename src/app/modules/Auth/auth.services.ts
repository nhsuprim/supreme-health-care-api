import { UserStatus } from "@prisma/client"
import generateToken from "../../helpers/jwtHelpers"
import prisma from "../../shared/prisma"
import * as bcrypt from "bcrypt"
import  jwt, { JwtPayload, Secret } from "jsonwebtoken"
import emailSender from "./sendEmail"

const AccessTokenJwtSecret = process.env.ACCESS_JWT_SECRET as Secret
const RefreshTokenJwtSecret = process.env.REFRESH_JWT_SECRET as Secret


const logInUser = async(payload:{
    email: string,
    password: string
}) =>{
    
    const userData =  await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })
    const isCorrectPassword:Boolean = await bcrypt.compare(payload.password,userData.password)

    if (!isCorrectPassword){
        throw new Error("Invalid password")
    }

    const accessToken = generateToken({
        email: userData.email,
        role: userData.role,
        secretKey: AccessTokenJwtSecret,
        expiresIn: '5m'  
    })

    const refreshToken = generateToken({
        email: userData.email,
        role: userData.role,
        secretKey: RefreshTokenJwtSecret,
        expiresIn: process.env.REFRESH_JWT_SECRET_EXPIRES_IN as string  
    })

    return ({
        accessToken,
        refreshToken,
        needPasswordChange:userData.needPasswordChange
    })


}

const refreshToken = async(token:string) =>{
    // implement logic to refresh token
    let decodedData ;
    try {
        decodedData = jwt.verify(token, RefreshTokenJwtSecret) as JwtPayload;
    } catch (error) {
        throw new Error("Unautorized")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where:{
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    })

    const accessToken = generateToken({
        email: userData.email,
        role: userData.role,
        secretKey: AccessTokenJwtSecret,
        expiresIn: process.env.ACCESS_JWT_SECRET_EXPIRES_IN as string  
    })

    return ({
        accessToken,
        needPasswordChange:userData.needPasswordChange
    })

}

const changePassword = async(user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            
        }
    })

    const isCorrectPassword:Boolean = await bcrypt.compare(payload.oldPassword,userData.password)

    if (!isCorrectPassword){
        throw new Error()
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            email: user.email,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false,
        }
    })
    return({
        message:"Password changed successfully"
    })
}

const forgetPassword = async(payload: {email:string}) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const resetPassToken = generateToken(
        {email: userData.email, role:userData.role,
        secretKey: process.env.RESET_PASS_SECRET as Secret,
        expiresIn: process.env.RESET_PASS_SECRET_EXPIRES_IN as string}
    )

    const resetPassLink = process.env.RESET_PASS_LINK + `?userId=${userData.id}&token=${resetPassToken}`;
    
    await emailSender(userData.email,
        `
        <div>
        <h1>Reset Password</h1>
        <p>To reset your password, please click the following link:</p>
        <a href="${resetPassLink}">
        <button type="button">Reset Password</button>
        </a>
        </div>
        `
    )
}

const resetPassword = async(token: string, payload:{id: string, password: string}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
        }
    })
    if(!userData){
        throw new Error("User not found")
    }

    const isTokenValid = jwt.verify(token, process.env.RESET_PASS_SECRET as Secret) as JwtPayload;
    if(!isTokenValid ){
        throw new Error("Invalid token")
    }

    const hashedPassword = await bcrypt.hash(payload.password, 12);

    await prisma.user.update({
        where: {
            id: payload.id,
        },
        data: {
            password: hashedPassword,
        }
    })
}

export const  AuthService = {
    logInUser,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword
}