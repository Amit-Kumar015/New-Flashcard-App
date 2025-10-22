import React from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import axios from "axios";
import light_logo from "../assets/light_theme_logo.png"

const Header = () => {
    const isLoggedIn = useSelector(state => state.auth.status)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem("userToken")
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/'
    }

    return (
        <div className="bg-gray-50 flex items-center justify-between px-6 py-4 shadow-md">
            <div className="flex items-center space-x-2 h-12" onClick={() => navigate('/')}>
                <img src={light_logo} alt="logo" className="w-32 object-contain" />
            </div>

            {isLoggedIn ? (
                <div className="text-gray-600 text-sm">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/signup')}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
                    >
                        Signup
                    </button>
                </div>
            )}
        </div>
    )
}

export default Header