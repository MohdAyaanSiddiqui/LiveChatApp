import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, onSnapshot, serverTimestamp, snapshotEqual, Timestamp } from "firebase/firestore";

const SimpleChatBox = ({selectedUser , currentUser})=>{//the users you want to chat with and currently who logged-in
    const [text , setText] = useState("")
    const [messages ,setMessage] = useState([])

    const chatID = currentUser.uid > selectedUser.uid//ensure that users have the same id , regardless of who starts the conversation
  ? `${currentUser.uid}_${selectedUser.uid}`//ompare the Both UIdS 
  : `${selectedUser.uid}_${currentUser.uid}`;

    useEffect(()=>{
        const unSub = onSnapshot(//listens for changes in chat,chatID , realtime chat
            collection(db , "chats" , chatID , "messages"),
            (snapshot)=>{
                const msgs =[]//collect thire data into the msgs array
                snapshot.forEach((doc)=>msgs.push(doc.data()))
                setMessage(msgs)
            }
        )
        return ()=> unSub()
    },[chatID])

    const handleSend = async ()=>{//sned a new msg in chat
        if(text.trim()==="")return

        await addDoc(collection(db, "chats", chatID, "messages"), {
            text,//the message content
            senderID: currentUser.uid,//The UID of the sender
            timestamp: serverTimestamp()// the server time when the message was sent
        })
        setText("")
    }
    return(
        <div>
            <h3>{selectedUser?.email}:-</h3>
            <div>
                {messages.map((msg, index) => (
  <span key={index}>{msg.text}</span>
))}
            </div>
            <input value={text} placeholder="Type Message" onChange={(e)=>setText(e.target.value)} />
            <button onClick={handleSend}>Send</button>
        </div>
    )
}
export default SimpleChatBox