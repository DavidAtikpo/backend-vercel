import User from "../models/userModel.js";
import generateRefreshToken from "../dbConfig/refreshToken.js";
import generateToken from "../dbConfig/jwtToken.js"
import nodemailer from "nodemailer"
import jwt  from "jsonwebtoken";
import crypto from 'crypto'
import sendEmail from "../utils/utilitie.js"
// import { json } from "body-parser";

const register = async (req, res) => {
  const { email } = req.body;
  const {role} = req.body;
  const findexisting = await User.findOne({ email });
  const findrole = await User.findOne({role});

  if (findexisting) {
    return res.status(400).json({ email: "Email already exists" });
  }
  if (findrole) {
    return res.status(400).json({ role: "Role already exists" });
  }

  if (req.body.role === "admin") {
    const { password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    await User.create(req.body);
    SendEmailOnRegister(email);
    return res.json({ message: "admin created successfully" });
  }

  const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });
  req.body.verificationToken = verificationToken;
  const newUser = await User.create(req.body);
  const VerificationEmail = `http://localhost:8000/user/verify-email/${verificationToken}`;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    },
    secureConnection: "false",
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Account Verification Link",
    html: `Hello, ${newUser.firstName} Please verify your email by clicking this link :<p><a href="${VerificationEmail}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px;">Email Verification</a></p>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(500).json({ error: true, message: "Failed to send verification email,provide correct email" });
    }
    return res.status(201).json({ message: `${req.body.firstName} created successfully` });
  });
};


const reVerifyUser = async (req, res) => {
  try {
    const { email } = req.body;
    // Create a JWT token for email verification with expiration (1 hour in this example)
    const verificationToken = jwt.sign({ email },process.env. JWT_SECRET, {
      expiresIn: "72h"
    });

    // Save the verificationToken in the database (you might want to store it along with the user record)
    await User.create({
      email,
      verificationToken
    });

    body.verificationToken = verificationToken;
    const newUser = await User.create(body);
    const VerificationEmail = `http://localhost:8000/user/verify-email/${verificationToken}`;
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      },
      secureConnection: "false",
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false
      }
    });
    const mailOptions = {
      from: "your email",
      to: email,
      subject: "Account Verification Link",
      html: `Hello, ${newUser.firstName} Please verify your email by clicking this link :<p><a href="${VerificationEmail}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px;">Email Verification</a></p>`
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.send({ error: false, data: info, message: "OK" });
      }
    });

    res.send("Verification email sent");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending verification email");
  }
};

function SendEmailOnRegister(email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Registration Notice",
    text: "Congratulations on your Registration,"
  };
  try {
    transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const decode = jwt.verify(token,process.env. JWT_SECRET);

    const founduser = await User.findOne(
       {
        email: decode.email,
        verificationToken: token,
        isVerified: false
      }
    );

    if (!founduser) {
      return res.status(401).json({
        message: "invalid or expired verification token"
      });
    }

    if (founduser.isVerified) {
      return res
        .status(200)
        .json({ message: "User has been already verified. Please Login" });
    }
    const updated = await User.updateOne(
      { 
        isVerified: true, 
        verificationToken: null,
        email: decode.email,
        verificationToken: token
      },
      { 
        $set: { isVerified: true } // Update the isVerified field to true
      }
    );
    if (!updated) {
      return res.status(500).json({ msg: "Unable to verify the account." });
    }
    SendEmailOnRegister(decode.email);
    return res.redirect("http://localhost:5173/login");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};


const loginAdmin = async(req,res)=>{
  const {email,password}= req.body;
  const findAdmin = await User.findOne({email});
  if(findAdmin.role !== "admin") throw new Error("not authoresed")
  if(findAdmin && await findAdmin.isPasswordMatched(password)){
    const refreshToken = await generateRefreshToken(findAdmin?.id)
    const updateuser = await User.findByIdAndUpdate(findAdmin?.id, {refreshToken:refreshToken},{new:true})
    res.cookie('refreshToken',refreshToken,{
      httpOnly:true,
      maxAge:72*60*60*1000,
    })
  res.json({
    _id:findAdmin?._id,
    firstName:findAdmin?.firstName,
    lastName:findAdmin?.lastName,
    mobile:findAdmin?.mobile,
    token:generateToken(findAdmin?._id)

  })
  }else{
    throw new Error("Invalid credentials")
  }
};
// login user

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Recherche de l'utilisateur dans la base de données par email
    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // Vérification de la correspondance du mot de passe
    const passwordMatch = await findUser.isPasswordMatched(password);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Génération d'un jeton de rafraîchissement et mise à jour de l'utilisateur
    const refreshToken = await generateRefreshToken(findUser._id);
    await User.findByIdAndUpdate(findUser._id, { refreshToken: refreshToken }, { new: true });

    // Stockage du jeton de rafraîchissement dans un cookie HTTP-only
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // 3 jours
    });

    // Envoi de la réponse JSON avec les informations de l'utilisateur et le jeton
    return res.json({
      _id: findUser._id,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      token: generateToken(findUser._id),
      role: findUser.role,
    });
  } catch (error) {
    console.error("Login error: ", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



// admin will get all users

const getAllUsers = async (req, res) => {
  try {
    const user = req.user;
    const isAdmin = user.role === 'Coordinateur';

    if (!isAdmin) {
      return res.status(403).json({ error: 'You are not authorized to access this resource.' });
    }

    const allUsers = await User.find();

    res.json(allUsers);
  } catch (error) {
    console.error('Error occurred while fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//user can update 

const updateUser = async(req,res)=>{
const userId=req.user.id;
try {
  const updateuser = await User.findByIdAndUpdate(userId,req.body,{new:true})
  res.json(updateuser)

} catch (error) {
  throw new Error(error)
}
};

// Function to update profile photo URL for a user
const updateProfilePhotoURL = async (req, res) => {
  try {
      const { userId } = req.params;
      const { profilePhotoURL } = req.body;

      // Update profile photo URL for the user
      const user = await User.findByIdAndUpdate(userId, { profilePhotoURL }, { new: true });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Profile photo URL updated successfully', user });
  } catch (error) {
      console.error('Error updating profile photo URL:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const baseUrl = 'http://localhost:8000'; // Replace with your actual base URL

// Function to get profile photo URL
const getProfilePhotoURL = async (req, res) => {
  const userId = req.user.id;
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the profile photo URL from the database
    const profilePhotoUrl = user.profilePhotoURL;

    // Prepend the base URL to the profile photo URL
    const fullUrl = baseUrl + profilePhotoUrl;

    // Return the profile photo URL
    res.status(200).json({ profilePhotoUrl: fullUrl });
  } catch (error) {
    console.error('Error getting profile photo URL:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// forgot password 

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'Email not found' });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set reset token and expiration time in the user record
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Send reset email
  const resetURL = `${req.protocol}://${req.get('host')}/user/forgot/${resetToken}`;
  const message = `You requested a password reset. Click the link to reset your password: ${resetURL}`;
  console.log(message);
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      message
    });

    res.status(200).json({ success: 'Reset link sent to email' });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(500).json({ error: 'Email could not be sent' });
  }
};

// reset password 
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user by reset token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ error: 'Token is invalid or has expired' });
  }

  // Update password and clear reset token fields
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({ success: 'Password has been reset' });
};



export default { register, loginUser,verifyEmail,reVerifyUser,loginAdmin,getAllUsers,updateUser,getProfilePhotoURL,updateProfilePhotoURL,forgotPassword,resetPassword  };
