"use client"

import { useState, useEffect } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "../firebase/firebase"

function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser)
    return () => unsubscribe()
  }, [])

  const handleLogout = () => {
    signOut(auth).catch((error) => {
      setError(error.message)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-4 sm:py-8 px-3 sm:px-4 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-20 left-10 sm:top-40 sm:left-40 w-30 h-30 sm:w-60 sm:h-60 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-12 z-10 px-2 w-full max-w-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4 lg:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center sm:mr-3 lg:mr-4 mb-2 sm:mb-0 shadow-lg">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">🎨</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            DesignStudio
          </h1>
        </div>
        <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 font-light mb-1 sm:mb-2">
          Where AI meets creativity
        </p>
        <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-cyan-200 font-medium">
          Hey designers, unleash your imagination
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto space-y-4 sm:space-y-6 lg:space-y-8 z-10 px-2">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl p-4 sm:p-6 lg:p-8 xl:p-10 border border-white/20">
          {user ? (
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 leading-tight">
                  Welcome back{user.displayName ? `, ${user.displayName}` : ''}!
                </h2>
                <p className="text-cyan-200 text-sm sm:text-base lg:text-lg break-words">{user.email}</p>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm">
                Ready to create something amazing?
              </p>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full flex justify-center py-3 sm:py-4 px-4 sm:px-6 border border-transparent rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg text-sm sm:text-base lg:text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-red-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="text-xs sm:text-sm">Signing Out...</span>
                  </div>
                ) : (
                  'Sign Out'
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                  {isSignUp ? "Start Creating" : "Welcome Back"}
                </h2>
                <p className="text-cyan-200 text-sm sm:text-base lg:text-lg">
                  {isSignUp ? "Join our creative community" : "Continue your design journey"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl lg:rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-300 text-sm sm:text-base lg:text-lg backdrop-blur-sm"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl lg:rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-300 text-sm sm:text-base lg:text-lg backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 sm:py-4 px-4 sm:px-6 border border-transparent rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg text-sm sm:text-base lg:text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-cyan-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span className="text-xs sm:text-sm">
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                      </span>
                    </div>
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </button>
              </form>

              {error && (
                <div className="rounded-lg sm:rounded-xl lg:rounded-2xl bg-red-500/10 border border-red-400/30 p-3 sm:p-4 backdrop-blur-sm">
                  <p className="text-red-200 text-xs sm:text-sm text-center font-medium break-words">{error}</p>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 sm:px-3 lg:px-4 bg-transparent text-cyan-200 font-medium">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 py-3 sm:py-4 px-3 sm:px-4 lg:px-6 border border-white/20 rounded-lg sm:rounded-xl lg:rounded-2xl text-sm sm:text-base lg:text-lg font-semibold text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-white/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-xs sm:text-sm lg:text-base">Continue with Google</span>
              </button>

              <div className="text-center pt-2 sm:pt-3 lg:pt-4">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  disabled={isLoading}
                  className="text-cyan-300 hover:text-cyan-200 font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 hover:underline disabled:opacity-50 break-words"
                >
                  {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Join Now"}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center px-2">
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="text-cyan-300 hover:text-cyan-200 underline transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-cyan-300 hover:text-cyan-200 underline transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth