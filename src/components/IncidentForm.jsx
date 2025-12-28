import { useEffect, useState } from 'react'
import './IncidentForm.css'

function IncidentForm() {
  const [location, setLocation] = useState('')
  const [type, setType] = useState('Accident')
  const [description, setDescription] = useState('')

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`)
      },
      () => alert('Location access denied')
    )
  }, [])

  const submitHandler = (e) => {
    e.preventDefault()
    console.log({ type, description, location })
    alert('Incident submitted (console)')
  }

  return (
    <form onSubmit={submitHandler} className="form">
      <label>Incident Type</label>
      <select value={type} onChange={e => setType(e.target.value)}>
        <option>Accident</option>
        <option>Medical</option>
        <option>Fire</option>
        <option>Infrastructure</option>
      </select>

      <label>Description</label>
      <textarea
        required
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <label>Location</label>
      <input value={location} readOnly />

      <button type="submit">Submit Report</button>
    </form>
  )
}

export default IncidentForm
