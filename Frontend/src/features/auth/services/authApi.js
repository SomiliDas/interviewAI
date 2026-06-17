import axios from "axios"



export async function register({username, email, password}){

    try{
        const response = await axios.post("https://interviewai-backend-g3s2.onrender.com/api/auth/register",
         {
            username, email, password
        },
        {
            withCredentials: true
        })

        return response.data

    }catch(err){
        console.log(err)
    }

}


export async function login({email, password}){
    try{
        const response = await axios.post("https://interviewai-backend-g3s2.onrender.com/api/auth/login",
            {email, password},
            {withCredentials : true}
        )
        return response.data
    }catch(err){
        console.log(err)
    }
}

export async function logout(){
    try{
        const response = await axios.get("https://interviewai-backend-g3s2.onrender.com/api/auth/logout",
            {withCredentials: true}
        )
        return response.data


    }catch(err){
        console.log(err)
    }
}


export async function getme(){
    try{
        const response = await axios.get("https://interviewai-backend-g3s2.onrender.com/api/auth/get-me", 
            {
                withCredentials : true
            }
        )
        return response.data
    }catch(err){
        console.log(err)
    }
}

