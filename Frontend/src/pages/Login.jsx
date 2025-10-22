import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false)
  const url = import.meta.env.VITE_API_URL
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })    
  }  

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    try {
      const response  = await axios.post(`${url}/login`, {
        email: formData.email,
        password: formData.password
      })

      localStorage.setItem("userToken", response.data?.token)
      dispatch(login({
        userData: {
          token: response.data?.token
        }
      }))
      navigate('/')
      toast.success("Logged in successfully")
    } catch (error) {      
      setErrorMessage(error.response?.data?.error || "Login failed")
      
      if(error.response){
        console.log('Status:', error.response.status);   
        console.log('Message:', error.response.data.error);    
      }
      else if(error.request){
        console.log('No response received:', error.request);
      }
      else{
        console.log('Error:', error.message);
      }    
      setLoading(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-center font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
            type="email"
            name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
              required
            />
          </label>
          <label>
            Password
            <input
            type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
              required
            />
          </label>
          <button 
            type='submit'
            className="w-full bg-blue-600 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        {errorMessage.length != 0 && <p className='text-center text-lg mt-3 font-semibold text-red-500'>{errorMessage}</p>}
      </div>
      
    </div>
  )
}

export default Login
