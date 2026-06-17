import { RouterProvider } from "react-router"
import { router } from "./appRoutes.jsx"
import { AuthProvider } from "./features/auth/services/authContext.jsx"
import { InterviewProvider } from "./features/interview/services/interviewContext.jsx"



function App() {

  return (
    <AuthProvider>
      
      <InterviewProvider>
          <RouterProvider router = {router}/>
      </InterviewProvider>
      
    </AuthProvider>
    
  )
}

export default App



