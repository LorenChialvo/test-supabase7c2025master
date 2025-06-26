"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { VITE_SUPABASE_URL } from "../config"

interface WeatherData {
  city: string
  country: string
  temperature: number
  feelsLike: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
}

const WeatherWidget = () => {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!city.trim()) {
      setError("Please enter a city name")
      return
    }

    setLoading(true)
    setError(null)
    setWeather(null)

    try {
      // Get the current session to get the access token
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setError("You must be logged in to use this feature")
        return
      }

      const response = await fetch(`${VITE_SUPABASE_URL}/functions/v1/weather-service`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ city: city.trim() }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to fetch weather data")
        return
      }

      setWeather(data)
      setCity("") // Clear the input after successful fetch
    } catch (err) {
      console.error("Error fetching weather:", err)
      setError("Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="weather-widget">
      <h2>Weather Service</h2>
      <form onSubmit={fetchWeather} className="weather-form">
        <div className="form-group">
          <label htmlFor="city">Enter City Name:</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g., London, Tokyo, New York"
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading || !city.trim()}>
          {loading ? "Getting Weather..." : "Get Weather"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {weather && (
        <div className="weather-display">
          <div className="weather-header">
            <h3>
              {weather.city}, {weather.country}
            </h3>
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="weather-icon"
            />
          </div>
          <div className="weather-details">
            <div className="temperature">
              <span className="temp-main">{weather.temperature}°C</span>
              <span className="temp-feels">Feels like {weather.feelsLike}°C</span>
            </div>
            <div className="weather-info">
              <p className="description">{weather.description}</p>
              <div className="additional-info">
                <span>Humidity: {weather.humidity}%</span>
                <span>Wind: {weather.windSpeed} m/s</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherWidget
