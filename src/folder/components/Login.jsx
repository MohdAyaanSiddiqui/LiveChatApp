import React, { useEffect, useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useFetcher, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import './Login.css'
import { db } from "../firebase";
import { doc , setDoc , getDoc } from "firebase/firestore";
const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();//a variable is representing the firebase authentication service instance , this lines initializes the authentication services , allowing you to perform like sign-in , sign-out , sign-up
  const location = useLocation();

  const handlogout = ()=>{
    signOut(auth)
    .then(()=>{
      console.log("User Signed Out");
      navigate("/")
    }).catch((error)=>{
      console.log("Signed Out Error",error);
      
    })
  }
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, [location.pathname]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isSignUp) {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);//create a refrence for a specific document (user) in the user collection
      const userSnap = await getDoc(userDocRef);//fetches the data for that user from firestore

      if (!userSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Anonymous",
          createdAt: new Date(),
        });
      }
      navigate("/chatroom");
    } catch (error) {
      alert(error.message);
    }};
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>{isSignUp ? "Sign Up" : "Log In"}</h2>
        <input type="email" placeholder="Enter Email" style={{color:"black"}}  value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off"/>

        <input type="password" placeholder="Enter Password" style={{color:"black"}} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password"/>
        
        <button type="submit">{isSignUp ? "Sign Up" : "Log In"}</button>
        <p>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
        </p>
        <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Switch to Log In" : "Switch to Sign Up"}
        </button>
        <button type="button" onClick={handlogout}>Log Out</button>
      </form>
    </div>
  );
};

export default Login;