import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";



const Protected = ({children}) => {
    
    const {loading, user} = useAuth()
    if(loading){
        return(
            <main><h1 className="text-white flex items-center justify-center h-dvh font-extrabold text-4xl">Loading...</h1></main>
        )
    }
    if(!user){
        return <Navigate to={"/login"} />
    }

    return children
        
    
}

export default Protected
