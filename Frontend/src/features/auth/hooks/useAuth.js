import { useContext, useEffect } from "react";
import { AuthContext } from "../services/authContext";
import { login, register, logout, getme } from "../services/authApi";

export const useAuth = ()=>{
    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading } = context

    const handleLogin = async ({email, password})=>{
        setLoading(true)

        try{
            const data = await login({email, password})
            setUser(data.user)
            
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
        
    }

    const handleRegister = async({username, email, password})=>{

        setLoading(true)
        try{
            const data = await register({username, email, password})
            setUser(data.user)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
       

    }

    const handleLogout = async()=>{
        setLoading(true)
        try{
            await logout()
            setUser(null)
        }catch(err){
            console.log(err)
        }finally{
             setLoading(false)
        }
        

    }

    const handleGetMe = async()=>{
        setLoading(true)

        try{
            const data = await getme()
            setUser(data.user)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
        
    }

    useEffect(()=>{
        const getAndSetUser = async()=>{
            try{
                const data = await getme()
                setUser(data.user)
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false)
            }
            
        }
        getAndSetUser()
    }, [])

    return {user, loading, handleGetMe, handleLogin, handleLogout, handleRegister}
} 