"use client";
import { signIn } from '@/lib/auth-client';
import React, { useState } from 'react'

const LoginUI = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleGithubLogin = async()=>{
        setIsLoading(true);
        try {
            await signIn.social({
                provider:"github"
            })
        } catch (error) {
            console.error("Login erros:", error)
            setIsLoading(false)
        }
    }
   return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Sign in to continue
        </p>

        <button onClick={handleGithubLogin}
        disabled= {isLoading}
          className="mt-6 w-full flex items-center justify-center gap-3 
                     border border-gray-300 rounded-lg py-3 
                     hover:bg-gray-50 transition"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="currentColor"
          >
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.38-3.87-1.38-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.04 1.78 2.72 1.27 3.38.97.1-.75.41-1.27.74-1.56-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.19-3.07-.12-.29-.52-1.45.11-3.02 0 0 .97-.31 3.18 1.17a11.1 11.1 0 012.9-.39c.99 0 1.99.13 2.9.39 2.21-1.48 3.18-1.17 3.18-1.17.63 1.57.23 2.73.11 3.02.74.8 1.19 1.82 1.19 3.07 0 4.4-2.69 5.37-5.25 5.65.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.52 11.52 0 0023.5 12C23.5 5.73 18.27.5 12 .5z" />
          </svg>

          <span className="font-medium text-gray-700">
            Continue with GitHub
          </span>
        </button>

        <p className="text-xs text-center text-gray-400 mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default LoginUI