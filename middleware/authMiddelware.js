import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js'

export const isAuth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).send({
            success: 'false',
            message: 'unauthorized user'
        })
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded.id);
    next();
}
//isAdmin
export const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(404).send(({
            success: false, message: 'admin only'
        }))
    }
    next();
};
