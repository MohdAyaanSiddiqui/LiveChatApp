import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection,addDoc,serverTimestamp,onSnapshot,query,orderBy,} from "firebase/firestore";
import './Chatroom.css'
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { deleteDoc , doc } from "firebase/firestore";
const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => { //this useEffect sets up a real time listener to the messages collection in your firestore database. it ensure that whenever a new message is addded , removed or change your UI updates Automatically
    const q = query(collection(db, "messages"), orderBy("createdAt"));//this create a firestore query for the messages collection, ordering the results by creditAT timestamp
    const unsubscribe = onSnapshot(q, (snapshot) => {//onSnapshot sets up a real time listener on the query
      setMessages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));//when the data changes , the callback runs it maps all over the documents in the snapshot , extracting thier data and adding the document ID, it updates the message state with latest data
    });
    return unsubscribe;// whenever the components unmounts , this function is called to unsubscribe from the firestore listener
  }, []);
  useEffect(()=>{
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  },[messages])
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid:user.uid,
      email:user.email
    });
    setNewMessage("");
  };
  const navigate = useNavigate();
  const auth = getAuth();
  const handleLogout = ()=>{
    signOut(auth)
    .then(()=>{
      navigate("/")
    })
    .catch((error)=>{
      console.log("Signed Out Error",error);
    })
  }
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "messages", id));
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };
    return (
    <div>
      <h2>Live Chat Room</h2>
      <button type="button" onClick={handleLogout}>Log Out</button>
      <div className="message">
        {messages.map((msg) => (
          <li key={msg.id} className={`message-bubble ${msg.uid === user.uid ? 'own' : ""}`}>
            <strong>{msg.email}</strong>
            <p>{msg.text}</p>
            <small>
              {msg.createdAt?.toDate
                ? msg.createdAt.toDate().toLocaleTimeString()
                : ""}
            </small>
            {msg.uid === user.uid && (
              <button className="del-btn" onClick={() => handleDelete(msg.id)}>Delete</button>
            )}
          </li>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Message Here"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
export default ChatRoom;
// db is connection to the firestore database , allowing you to store and retireve chat message in real time
// it is allow your react-app to interact with firestore , which is cloud hosted NOSQL database provided by firebase