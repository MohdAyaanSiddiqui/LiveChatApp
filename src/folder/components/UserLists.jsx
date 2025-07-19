import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection , getDocs } from "firebase/firestore";
import {useAuth} from './AuthContext'

const UserLists = ({startChat})=>{
    const [users , setUsers] = useState([])//the state variable to store the list of users fetched from firestore
    const { user } = useAuth()//the currently log in user 
    useEffect(()=>{
        const fetchUsers = async ()=>{
            const querySnapshot = await getDocs(collection(db,"users"))// create a reference to the users collection in firestore
            const usersArrays = []

            querySnapshot.forEach((doc)=>{
                if(doc.data().uid !== user.uid){
                    usersArrays.push(doc.data())//get the user data like email , uid
                }
            })
            setUsers(usersArrays)
        }
        fetchUsers()
    },[user])
    return(
        <div>
            <h2>Available Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.uid} onClick={() => startChat(user)}>{user.email}</li>
                ))}
            </ul>
        </div>
    )
}
export default UserLists