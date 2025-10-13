import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import axios from "axios";

function App() {
  const navItems = [
    {
      name: "Home",
      url: "/"
    },
    {
      name: "All Cards",
      url: "/all-cards"
    },
    {
      name: "Pending Cards",
      url: "/pending-cards"
    },
    {
      name: "My Decks",
      url: "my-decks"
    }
  ]

  const navigate = useNavigate()
  // for testing setting token manually
  axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODk0NGYzZDU0MGM0YTc0YjYzNTRmYWQiLCJpYXQiOjE3NjAxODMxOTMsImV4cCI6MTc2MTA0NzE5M30.AXmOaw5BihkZCPUVRVneV7hK8fabOkX7KJSC-yWtl0I'


  // working
  // const authStatus = useSelector((state) => state.auth.status)
  // const [showLogin, setShowLogin] = useState(true);
  // console.log("authstatus: ", authStatus);
  

  // useEffect(() => {
  //   setShowLogin(authStatus)
  // }, [authStatus])
  // useEffect(() => {
  //   const token = localStorage.getItem('token')
  //   if(token){
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  //   }
  // }, [])


  return (
    <div className="w-screen h-screen flex flex-col relative">
    {/* Header */}
    <Header />

    {/* Main Content */}
    <div className="flex flex-1">
      {/* Navigation Panel */}
      <div className="w-1/6 bg-gray-100 border-r p-4 shadow-md">
        {/* Put nav items here */}
        <h2 className="text-xl font-semibold mb-4">Navigation</h2>
        <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.name} className="cursor-pointer text-lg hover:text-green-600" onClick={() => navigate(item.url)}>{item.name}</li>
        ))}
        </ul>
      </div>

      {/* Right Panel (Main Content) */}
      <div className="w-5/6 p-6 overflow-y-auto">
        <Outlet/>
      </div>
    </div>
    {/* {!showLogin && <LoginModal onClose={() => setShowLogin(false)}/>} */}
  </div>
  )
}

export default App;



// return (
//   <div className="flex h-screen dark:bg-gray-900 dark:text-white">
//     <ToastContainer />
//     <Sidebar />
    
//     {/* Top Right Buttons */}
//     <div className="absolute top-4 right-4 space-x-4">
//       <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => navigate('/signin')}>Sign In</button>
//       <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={() => navigate('/signup')}>Sign Up</button>
//     </div>

//     <div className="flex-1 flex justify-center items-center">
//       <Outlet/>
//     </div>
//   </div>
// );