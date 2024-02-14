import express from "express"
import cors from "cors"
import bcrypt from "bcrypt"
import Traveller from "../models/TravellerSchema.js"

// api endpoint for traveller /traveller

const router = express.Router()
router.use(express.urlencoded({extended:true}))
router.use(express.json())
router.use(cors())

//saltrounds for password hashing
const saltrounds = parseInt(process.env.saltrounds)

router.get("/:id", async(req, res)=>{
    const traveller = await Traveller.findById({_id: req.params.id})

    if(traveller)
    {
        res.json({"travellerInfo":traveller})
    }
})

router.post("/signup", async(req,res)=>{
    const {fname, lname, email, password, phoneNumber, isTraveller, isCompanion, isAdmin} = req.body;

    try{
        //Salting + Hashing the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, saltrounds)

        if(isTraveller)
        {
            const newTraveller = new Traveller({
                firstName: fname,
                lastName: lname,
                email: email,
                password: hashedPassword,
                phoneNumber: phoneNumber
            })
            await newTraveller.save()

            res.status(201).json({ "message": "Registration Successful", token: await newTraveller.generateToken() });
        }
    }
    catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            // duplicate email error
            return res.status(409).json({"message": "Email already in use" });
        }
        res.status(500).json({ "message": "Internal Server Error" });
        console.error(err);
    }
})

router.post("/login", async(req, res)=>{
    const {email, password, isTraveller, isAdmin, isCompanion} = req.body;
    
    if(isTraveller)
    {
        const traveller = await Traveller.findOne({email : email})

        if(!traveller) //checking if user registered or not
        {
            res.status(404).json({"message":"Invalid Credentials"})
        }
        else
        {
            //Verifying the input password with that from the database using bcrypt
            var result =await bcrypt.compare(password, traveller.password)
            if(result)
            {
                res.status(200).json({"message":"Login Successful", token: await traveller.generateToken()})
            }
            else
            {
                res.status(401).json({"message":"Invalid Credentials"})
            }
        }
    }
})

export { router as LoginRoute }