import  jwt, { Secret } from "jsonwebtoken"

const generateToken = (payload: {
    email: string,
    role: string,
    secretKey : Secret,
    expiresIn: string
})=>{
    const token = jwt.sign({
        email: payload.email,
        role: payload.role,
    },
    payload.secretKey,
    {
        algorithm: 'HS256',
        expiresIn: payload.expiresIn
    }
)
return token
}

export default generateToken;