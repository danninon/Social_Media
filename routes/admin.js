import express from 'express';
import * as db from "../db/DB.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


const router = express.Router();

const set_content_type = function (req, res, next) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    next()
}

router.use(set_content_type);
router.use(express.json());  // to support JSON-encoded bodies
router.use(express.urlencoded( // to support URL-encoded bodies
    {
        extended: true
    }));

router.use(verifyAdmin)

//TODO: update admin token
// router.post('/login', async (req,res)=>{
//    try{
//     const {email, password} = req.body;//creating access token by userEmail mail

//     //validate email & password
//     //const searchedUser = await getUserByEmail(password, email);
//     //const validPass = await bcrypt.compare(password, searchedUser.hash); 

//     //token 
//     const accessToken = await jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, { expiresIn: tokenLifeSpan});
//     res.json({accessToken : accessToken})
//    }catch(e){

//    }
// });

//TODO: update admin token
router.delete('/logout', async (req, res) => {
    try {
        db.logout(req.token,req.id);
        res.sendStatus(204) //successfuly deleted token
    }
    catch (e) { }
})

router.get("/getRequests", async (req, res) => {
    res.send(JSON.stringify(db.users.filter(user => user.userStatus === db.CREATED)));
})

router.get("/getAllUsers", (req, res) => {
    res.json(db.users);
})


router.post("/approveUser", async (req, res) => {
    try {
        let result = false;
        await db.approveUser(req.body.id); //should the body contain id only?
        //find on the request other list and remove
        res.json("New user status: Active");
    } catch (e) {
        console.log(e.message);
        res.status(400).send(e + "User status: unchanged");
    }
})

router.post("/post", db.authenticateToken, db.userIsApproved, async (req, res) => {
    try {
        const postItem = await db.createPost(req.body, req.id);
        res.json(postItem);
    } catch (e) {
        console.log(e.message);
        res.status(400).send(e);
    }
    
})

router.post("/sendMessageToAllUsers",async (req, res) => {
    try {
        await db.sendMessageToAllUsers(req.body.text);
        res.json("Massage sent");
    } catch (e) {
        console.log(e.message);
        res.status(400).send(e + "Can not send messages");
    }
})


router.put("/suspend/:id", async (req, res) => {
    try {
        await db.suspendUser(req.params.id);
        res.json("User Suspent");
    } catch (e) {
        console.log(e.message);
        res.status(400).send(e);
    }
})

router.put("/un_suspend/:id", async (req, res) => {
    try {
        await db.approveUser(req.params.id);
        res.json("User Unsuspent");
    } catch (e) {
        console.log(e.message);
        res.status(400).send(e);
    }
})

router.delete("/deleteUser/:id", async (req, res) => {
    try {
        res.json(await db.deleteUser(req.params.id));
    } catch (e) {
       console.log(e.message);
        res.status(400).send(e);
    }
})

router.delete("/deletePost/:id", async (req, res) => {
    try {
        await db.deletePost(req.params.id, db.k_AdminId)
        res.json("Post deleted");
    } catch (e) {
        console.log(e.message);
        res.status(400).send(e);
    }
})

function verifyAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //make sure theres the header => split
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, vRes) => {
        if (err || vRes.email !== db.adminEmail) {
           // console.log(err, vRes, "after token")
            return res.status(403).send("User can't access to this route")
        }
        if(db.deletedTokens[db.k_AdminId]=== token){
            res.status(403).send("token expired");
        }
        req.token = token;
       // console.log(vRes, "after token")
        next();
    })
}
export default router;