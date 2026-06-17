// import React from 'react'
import { useNavigate, Link } from "react-router"
import { useAuth } from "../hooks/useAuth"
import { useState } from "react"
import Loading from "../../components/Loading"
import {toast } from 'react-toastify'




const Register = () => {
  const navigate = useNavigate()

  const {loading, handleRegister} = useAuth()
  const [username, setUsername] =useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  const submitHandler = async(e)=>{
    e.preventDefault()
    if(!username || !email || !password){
      toast.error("Username, email and password are required")
      return
    }
    await handleRegister({username, email, password})
    navigate("/")
    setEmail("")
    setPassword("")
    setUsername("")
  }

  if(loading){
    return(
      <Loading/>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">Create Account</h1>
          <p className="text-slate-400 text-lg">Join us to get started with your interview plans</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8">
          <form onSubmit={submitHandler} className="flex flex-col gap-6">
            <div>
              <label className="text-sm text-slate-300 block mb-3 font-medium">Username</label>
              <input
                type="text"
                name="username"
                value={username}
                placeholder="Enter your username"
                onChange={(e)=>{setUsername(e.target.value)}}
                className="w-full bg-slate-900/50 border border-slate-700/30 rounded-lg px-4 py-3 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300 block mb-3 font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e)=>{setEmail(e.target.value)}}
                className="w-full bg-slate-900/50 border border-slate-700/30 rounded-lg px-4 py-3 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300 block mb-3 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e)=>{setPassword(e.target.value)}}
                className="w-full bg-slate-900/50 border border-slate-700/30 rounded-lg px-4 py-3 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 rounded-lg cursor-pointer transition-all hover:shadow-lg hover:shadow-pink-500/50 mt-2"
            >
              Register
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">Already have an account? <Link to={"/login"} className="text-pink-500 hover:text-pink-400 font-semibold transition-colors hover:underline">Login</Link></p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Register
