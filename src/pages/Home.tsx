"use client"

import { type FC, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from "../config"
import WeatherWidget from "../components/WeatherWidget"

const styles = {
  buttons: {
    display: "flex",
    gap: "1rem",
    margin: "1rem 0",
  },
  display: {
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    margin: "1rem 0",
    backgroundColor: "#f5f5f5",
  },
  language: {
    display: "block",
    marginTop: "0.5rem",
    color: "#666",
    fontStyle: "italic",
  },
} as const
const Home: FC = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [excuse, setExcuse] = useState("")
  const [language, setLanguage] = useState("en")

  const fetchExcuse = async (lang: "en" | "es") => {
    try {
      const response = await fetch(`${VITE_SUPABASE_URL}/functions/v1/excuse-generator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ language: lang }),
        credentials: "include",
      })
      const data = await response.json()
      setExcuse(data.excuse)
      setLanguage(lang)
    } catch (error) {
      console.error("Error fetching excuse:", error)
      setExcuse("Failed to fetch excuse")
    }
  }

  useEffect(() => {
    // Check for current session
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Error getting session:", error.message)
        navigate("/login")
        return
      }

      if (!data.session) {
        // No active session, redirect to login
        navigate("/login")
        return
      }

      // Session exists, get user data
      setUser(data.session.user)
      setLoading(false)
    }

    checkSession()

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/login")
      } else if (session) {
        setUser(session.user)
      }
    })

    return () => {
      // Clean up the subscription
      authListener.subscription.unsubscribe()
    }
  }, [navigate])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error.message)
        return
      }
      navigate("/login")
    } catch (err) {
      console.error("Unexpected error during logout:", err)
    }
  }

  if (loading) {
    return <div className="container">Loading...</div>
  }

  return (
    <div className="container">
      <h1>Excuse Me!</h1>
      <img
        className="inner-container"
        src="https://pnctschmbeqswueglzaz.supabase.co/storage/v1/object/public/assets/oops.png"
        alt="A cute raccoon peeking out from behind a trash can, with a surprised expression"
      />

      {user && (
        <div className="user-info">
          <p>Logged in as: {user.email}</p>
          {user.user_metadata?.full_name && <p>Name: {user.user_metadata.full_name}</p>}
        </div>
      )}

      <div style={styles.buttons}>
        <button onClick={() => fetchExcuse("en")}>Get English Excuse</button>
        <button onClick={() => fetchExcuse("es")}>Get Spanish Excuse</button>
      </div>
      {excuse && (
        <div style={styles.display}>
          <p>{excuse}</p>
          <small style={styles.language}>Language: {language === "en" ? "English" : "Spanish"}</small>
        </div>
      )}

      <WeatherWidget />
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home
