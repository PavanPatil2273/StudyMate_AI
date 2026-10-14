import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
} from 'lucide-react'

export default function Login({ onLogin }) {
  const navigate = useNavigate()

  const API_URL = import.meta.env.VITE_API_URL

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })

    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch(`${API_URL}/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify(form),
})

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Invalid email or password.'
        )
      }

      // Keep the existing HTTP-only cookie authentication.
// Do not store the token in localStorage.
    
// if (!data.access_token) {
//   throw new Error('Login succeeded but no access token was returned.')
// }

// localStorage.setItem('studymate-token', data.access_token)

// if (data.user?.email) {
//   localStorage.setItem('studymate-user', data.user.email)
// } else {
//   localStorage.setItem('studymate-user', form.email)
// }

localStorage.removeItem('studymate-token')
localStorage.setItem('studymate-user', data.user.email)

onLogin()
navigate('/', { replace: true })
    
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* =========================================
          STUDYMATE LOGO - TOP LEFT
      ========================================== */}
      <Link
        to="/login"
        className="absolute left-6 top-6 z-50 flex items-center gap-3 sm:left-8 sm:top-8"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950 shadow-lg">
          <BookOpen size={19} />
        </div>

        <div>
          <div className="text-base font-bold tracking-tight">
            StudyMate AI
          </div>

          <div className="text-[11px] text-slate-400">
            Learn smarter
          </div>
        </div>
      </Link>


      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =========================================
            LEFT SIDE
        ========================================== */}
        <div className="relative hidden overflow-hidden lg:flex">

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '42px 42px',
            }}
          />

          <div className="relative z-10 flex w-full flex-col justify-center p-10 xl:p-14">

            <div className="max-w-xl">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                <Sparkles size={15} />
                AI-powered learning assistant
              </div>

              <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
                Your notes.
                <br />

                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Your knowledge.
                </span>

                <br />

                One intelligent assistant.
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                Upload your study material, ask questions,
                and let StudyMate AI help you understand
                your documents faster.
              </p>


              <div className="mt-9 grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                  <Brain
                    size={20}
                    className="mb-3 text-blue-400"
                  />

                  <p className="text-sm font-semibold">
                    Intelligent Answers
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Ask questions directly from your notes.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                  <BookOpen
                    size={20}
                    className="mb-3 text-indigo-400"
                  />

                  <p className="text-sm font-semibold">
                    Your Documents
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Keep your study material organized.
                  </p>
                </div>

              </div>


              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500">

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-400"
                  />
                  PDF-based learning
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-400"
                  />
                  AI-powered RAG
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-400"
                  />
                  Fast answers
                </div>

              </div>

            </div>

          </div>
        </div>


        {/* =========================================
            RIGHT SIDE
        ========================================== */}
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-5 py-24 dark:bg-slate-950 sm:px-8">

          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl lg:hidden" />

          <div className="relative z-10 w-full max-w-md">

           <div className="mb-8 text-center">

  <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
    <LockKeyhole size={21} />
  </div>

  <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
    Welcome back
  </h2>

  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
    Sign in to continue learning with StudyMate AI.
  </p>

</div>


            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-8">

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                    {error}
                  </div>
                )}


                {/* Email */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Email address
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800"
                    />

                  </div>

                </div>


                {/* Password */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Password
                  </label>

                  <div className="relative">

                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>


                {/* Login */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
                >

                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}

                </button>

              </form>


              <div className="my-7 flex items-center gap-3">

                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />

                <span className="text-xs text-slate-400">
                  New to StudyMate?
                </span>

                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />

              </div>


              <Link
                to="/register"
                className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
              >
                Create a new account
              </Link>

            </div>


            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              By continuing, you agree to use StudyMate AI
              responsibly for your learning.
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}