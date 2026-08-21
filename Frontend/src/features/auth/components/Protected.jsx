import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";




const Protected = ({children}) => {
    
    const {loading, user} = useAuth()
    if(loading){
    return(
      <Loading/>
    )
  }
    if(!user){
        return <Navigate to={"/login"} />
    }

    return children
        
    
}

export default Protected
