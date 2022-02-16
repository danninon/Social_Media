import fsp from 'fs/promises';
import fs from 'fs';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const postsPath = './db/posts.json';
const usersPath = './db/users.json';
const messagesPath = './db/messages.json';
//need to save it for admin email


export let messages = [];
export let users = [];
export let posts = [];
export let deletedTokens = [];

export const DELETED = 'deleted';
export const ACTIVE = 'active';
export const CREATED = 'created';
export const SUSPENDED = 'suspended';


export async function readData() {

    if (fs.existsSync(messagesPath)) {
        const data = await fsp.readFile(messagesPath, "utf8");
        messages = JSON.parse(data);
    }

    if (fs.existsSync(usersPath)) { //this is done later which is bad because it keeps creating new admins instead of reading file
        const data = await fsp.readFile(usersPath, "utf8");
        users = JSON.parse(data);
    }
    if (fs.existsSync(postsPath)) {
        const data = await fsp.readFile(postsPath, "utf8");
        posts = JSON.parse(data);
    }

}

export async function saveData() {
    await fsp.writeFile(messagesPath, JSON.stringify(messages));
    await fsp.writeFile(usersPath, JSON.stringify(users));
    await fsp.writeFile(postsPath, JSON.stringify(posts));
}
export const k_AdminId = 0;
export const k_AdminName = "Admin";
export const k_adminHashKey = "12341234";
export const adminEmail = "admin@api.com";

export async function MakeAdmin() {
    {
        //this doesn't work because of the operating order
        if (users.some(user => user.id === 0)) {
            //throw new Error("Admin already exists")
        }
        else {
            //password = hashPaswword(password);
            const creationDate = Date.now().stringify;
            const Hash = await bcrypt.hash(k_adminHashKey, 10);
            users.push({ name: k_AdminName, date: creationDate, email: adminEmail, id: k_AdminId, hashKey: Hash, userStatus: ACTIVE })
            await saveData();
        }
    }
}
//throws if cannot find id
//assumes email and id are unique already

//551678584061881 got
export async function approveUser(id) {
    let searchedUser = users.find((u) => u.id === id);
    if (searchedUser === undefined) { throw new Error("no matching request found") };
    searchedUser.userStatus = ACTIVE;
    await saveData();
}

export async function suspendUser(id) {
    let searchedUser = users.find((u) => u.id === id);
    if (searchedUser === undefined) { throw new Error("no matching request found") }
    searchedUser.userStatus = SUSPENDED;
    await saveData();
}


function generateId() {
    // let alreadyExists
    // let newId;
    // do {
    //     alreadyExists = false;
    //     newId = randomInt(users.length * 10);
    //     if (users.some(user => user.id === newId)) {
    //         alreadyExists = true;
    //     }
    // } while (alreadyExists);
    return Math.random().toString().substr(2);
}


export async function addUserRequest(name, email, password) {

    // if (users.some(user => user.userStatus === CREATED && user.email === email)) {
    //     throw new Error("A request with this email has already been sent to admin for confirmation.");
    // }
    // if (signUpRequests.some(user => user.email === email)) {
    //     throw new Error("An account with this email already exists.");
    // }

    checkIfEmailAlreadyExist(email);
    const id = await generateId();
    const now = new Date();
    const date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    const hashKey = await bcrypt.hash(password, 10); //10 is salted times hash doesn't work
    const newUser = { name, email, hashKey, id, date, userStatus: CREATED }

    users.push(newUser)
    await saveData(); //saves request
    return newUser;
}
//use salt and hash (can use .env for salt)

function checkIfEmailAlreadyExist(email) {
    if (users.some(user => user.email === email)) {
        throw new Error("Email already exist")
    }
}

export async function deleteUser(id) {
    const index = users.findIndex(user => user.id === id);
    let delUser;
    if (index > -1) {
        delUser = users[index];
        users.splice(index, 1);
        await saveData();
    } else {
        throw new Error("User not found")
    }
    return delUser;
}

export function logout(token, id) {
    deletedTokens[id] = token;
}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token =  authHeader && authHeader.split(' ')[1]; //make sure theres the header => split
    if (token == null) return res.sendStatus(401); //authentication failure
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403).send("invalid token");; //invalid token - no access
        req.id = getIdUsingEmail(user.email);
        req.token = token;
        if (deletedTokens[req.id] === token) {
            return res.status(403).send("token expired");
        }

        next();
    })
}

export function userIsApproved(req, res, next) {

    if (users.some(user => user.id === req.id && user.userStatus === ACTIVE)) {
        next();
    } else {
        res.status(401).send("User is not active");
    }
}

export async function getPostById(id) {
    const post = posts.find(post => post.postId === id);

    return post;
}
//how to read this json
export async function createPost(post, userId) {
    const sendingUserName = users.find(user => user.id === userId).name
    let postItem = { author: { name : sendingUserName, id: userId }, content: { id : generateId(),text: post.postText, date : getDate()}};
    posts.push(postItem)
    await saveData();
    return postItem;
}
export function getIdUsingEmail(email) {
    const userId = users.find(user => user.email === email).id;
    return userId;
}

export async function deletePost(postId, userId) {
    const index = posts.findIndex(post => post.postId === postId);
    if (index > -1) {
        if (posts[index].userId === userId || userId === k_AdminId) {
            posts.splice(index, 1);
            await saveData();
        } else {
            throw new Error("User not allowed to delete this post")
        }

    } else {
        throw new Error("Post not found")
    }
}

export function getAllMessageById(id) {
    return messages.filter(message => message.to.id === id);
}

export function getMessageById(id) {
    const message = messages.find(message => message.id === id)
    if (message) {
        return message;
    } else {
        throw new Error("message not found")
    }
}
export async function sendMessageToUser(text, userTargetId, userId) {
    const targetUser = users.find(user => user.id === userTargetId);
    const sendingUser = users.find(user => user.id === userId)
    if (targetUser) {
        let msg = { from: { name: sendingUser.name, id: sendingUser.id }, to: { name: targetUser.name, id: targetUser.id }, text, id: generateId(), date: getDate() };
        messages.push(msg)
        await saveData();
        return (msg);
    } else {
        throw new Error("User Id does not exist");
    }

}

export async function sendMessageToAllUsers(text) {
    users.forEach(user => {
        sendMessageToUser(text, user.id, k_AdminId);
    });
    await saveData();
}

function getDate() {
    let currentdate = new Date();
    let datetime = "Last Sync: " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    return datetime;
}



