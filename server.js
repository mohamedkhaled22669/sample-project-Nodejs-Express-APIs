// Create Server
const express = require("express")
const app = express()
const _PORT = process.env.PORT
const cors = require("cors")
app.use(cors())
app.use(express.json())


const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



// Connect To DB
const   usename = process.env.USERNAME,
        password = process.env.PASSWORD,
        database = process.env.DB;
const mongoose = require("mongoose")
mongoose.connect(`mongodb+srv://${usename}:${password}@cluster0.u1ewys8.mongodb.net/${database}?retryWrites=true&w=majority`)


/* Models */
// User Model
const UserModel = require('./models/Users')

// get Request
app.get("/users", async (req, res) => {
    const users = await UserModel.find()
    res.json(users)
})

// Create USer
app.post("/createUser", async (req, res) => {
    const user = req.body;
    const newUser = new UserModel(user)
    await newUser.save()
    res.json(req.body)
})









// Admin Model
const AdminModel = require('./models/Admins')
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const admin = await AdminModel.findOne({ username })
    // admin && res.json({message:"user is already exists!!"})
    if (admin) {
        return res.json({ message: "user is already exists!!" })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)
    const newAdmin = new AdminModel({ username, password: hashedPassword })
    await newAdmin.save();

    return res.json({ message: " Admin Created Succefuly" })
})



app.post('/login', async (req, res) => {
    const { username, password } = req.body

    const admin = await AdminModel.findOne({ username })
    !admin && res.json({ message: "Admin doesn't exist!" })

    const isPasswordValid = await bcrypt.compare(password, admin.password)
    !isPasswordValid && res.json({ message: "Username or Password Is not Correct" })


    const token = jwt.sign({ id: admin._id }, process.env.SECRET)

    return res.json({token,adminID: admin._id})
})




app.listen(_PORT, () => {
    console.log("server is works!!");
})

