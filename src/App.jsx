import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!API_URL) {
      setError('VITE_API_URL is not set. Add it to your .env file.')
      setLoading(false)
      return
    }

    const controller = new AbortController()

    fetch(`${API_URL}/users`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then(setUsers)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <main className="container">
      <h1>User Directory</h1>
      <p className="source">
        Data from <code>{API_URL}</code>
      </p>

      <input
        className="search"
        type="search"
        placeholder="Search by name…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <ul className="grid">
          {filtered.map((user) => (
            <li key={user.id} className="card">
              <h2>{user.name}</h2>
              <p>@{user.username}</p>
              <p>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </p>
              <p>{user.company.name}</p>
              <p className="muted">{user.address.city}</p>
            </li>
          ))}
          {filtered.length === 0 && <p>No users match “{query}”.</p>}
        </ul>
      )}
    </main>
  )
}

export default App
