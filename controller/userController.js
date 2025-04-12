import userModel from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'
import getDataUri from '../utils/feature.js'
import cloudinary from 'cloudinary'
export const registerController = async (req, res) => {
    try {
        const { name, email, phone, address, password, role, answer } = req.body;
        if (!name || !email || !phone || !address || !password || !role || !answer) {
            return res.send("fill all the blanks")
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({ email, name, phone, address, password: hashPassword, role, answer })
        res.status(201).send({
            success: true,
            message: 'register successfully',
            user
        })



    } catch (error) {
        res.status(500).send({
            message: 'success false',
            error: error.message
        })
    }
}
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.send('fill the blanks')
        }
        const userwa = await userModel.findOne({ email })
        if (!userwa) {
            return res.send({ success: false, message: 'user not found' })
        };
        const isMatch = await bcrypt.compare(password, userwa.password)
        if (!isMatch) {
            return res.send(' incorrect creditentials')
        }

        const token = JWT.sign({ id: userwa._id }, process.env.JWT_SECRET)
        res.status(200).cookie('token', token, {
            expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            httpOnly: process.env.NODE_ENV === 'development' ? true : false,
            secure: process.env.NODE_ENV === 'development' ? true : false
        }).json({
            success: true,
            message: 'login successfully',
            token,
            userwa
        })

    }
    catch (error) {
        res.status(500).send({
            message: "success false",
            error: error.message
        })
    }
}
export const profileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id)
        user.password = undefined;
        res.status(200).send({
            success: true,
            message: 'profile successfully',
            user
        })
    } catch (error) {
        res.status(500).send({
            success: ' false',
            message: 'profile api error',
            error
        })
    }
}
// logoutController
export const logoutController = async (req, res) => {
    try {
        res.cookie('token', '', {
            expires: new Date(Date.now()),
            httpOnly: process.env.NODE_ENV === 'development' ? true : false,
            secure: process.env.NODE_ENV === 'development' ? true : false
        }).send({
            success: true,
            message: 'logout successfully'
        })
    } catch (error) {
        res.status(500).send({
            success: ' false',
            message: 'logout api error',
            error
        })
    }
}
export const updateProfileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id)
        if (!user) {
            return res.send('user not found')
        }
        const { name, email, phone, address } = req.body;
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        // if (password) user.password = await bcrypt.hash(password, 10)
        await user.save();
        res.status(200).send({
            success: true,
            message: 'update successfully'
        })
    } catch (error) {
        res.status(500).send({
            success: ' false',
            message: 'update api error',
            error
        })
    }
}
export const updatePasswordController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id)
        if (!user) {
            return res.send('user not found')
        }
        const { password, newPassword } = req.body;
        if (!password || !newPassword) {
            return res.send('fill the blanks')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.send('incorrect password')

        }
        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()
        res.status(200).send({
            success: true,
            message: 'password updated successfully'
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: 'update password api error'
        })
    }
}
export const updateProfilePicController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id)
        //getting file from client via multer

        const file = getDataUri(req.file)
        if (!file.content) {
            return res.status(400).send("Invalid file content");
        }
        // delete previous pic
        if (user.profilePic.public_id) await cloudinary.v2.uploader.destroy(user.profilePic.public_id)
        // update new pic
        const cdb = await cloudinary.v2.uploader.upload(file.content);
        user.profilePic = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }

        await user.save();
        res.status(200).send({
            success: true,
            message: 'update pic successfully'
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: 'update pic api error'
        })
    }

}
//reset password
export const resetPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email || !answer || !newPassword) {
            return res.status(404).send({
                success: false,
                message: 'fill all fields'
            })
        }
        console.log(email, answer, newPassword)
        const user = await userModel.findOne({ email, answer })
        if (!user) {
            return res.status(404).send({
                success: false, message: 'user not found'
            })
        }

        const hashPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashPassword
        await user.save()
        res.status(200).send({
            success: true, message: 'password has updated successfully,please login'
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'update resetPassword error'
        })
    }
}















