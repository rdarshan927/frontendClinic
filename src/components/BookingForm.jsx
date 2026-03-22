import React, { useState } from 'react'
import { createAppointment, createPaymentSession, getMyPatient, getPatientById } from '../api'
import { useNavigate } from 'react-router-dom'

export default function BookingForm({ initialDoctorId = '' }) {
    const [doctorId, setDoctorId] = useState(initialDoctorId)
    const [slotId, setSlotId] = useState('')
    const [patientId, setPatientId] = useState('')
    const [reason, setReason] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [patientLookupLoading, setPatientLookupLoading] = useState(false)
    const [patientName, setPatientName] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const payload = { doctorId, slotId, patientId, reason }
            const appointment = await createAppointment(payload)
            // If backend returns payment URL or session, try to create session
            try {
                const session = await createPaymentSession(appointment.id)
                if (session && session.url) {
                    // redirect to payment provider
                    window.location.href = session.url
                    return
                }
            } catch (err) {
                // ignore payment session error; continue to details page
                console.warn('payment session error', err)
            }
            navigate(`/appointments/${appointment.id}`)
        } catch (err) {
            console.error(err)
            setError(err?.response?.data?.message || err.message || 'Failed')
        } finally {
            setLoading(false)
        }
    }

    async function useMyProfile() {
        setPatientLookupLoading(true)
        setError(null)
        try {
            const patient = await getMyPatient()
            setPatientId(patient.id)
            setPatientName(`${patient.firstName} ${patient.lastName}`)
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Unable to load profile')
        } finally {
            setPatientLookupLoading(false)
        }
    }

    async function validatePatientId() {
        if (!patientId) return
        setPatientLookupLoading(true)
        setError(null)
        try {
            const p = await getPatientById(patientId)
            setPatientName(`${p.firstName} ${p.lastName}`)
        } catch (err) {
            setPatientName('')
            setError(err?.response?.data?.message || 'Patient not found')
        } finally {
            setPatientLookupLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="booking-form">
            <div>
                <label>Doctor ID</label>
                <input value={doctorId} onChange={e => setDoctorId(e.target.value)} required />
            </div>
            <div>
                <label>Slot ID</label>
                <input value={slotId} onChange={e => setSlotId(e.target.value)} required />
            </div>
            <div>
                <label>Patient ID</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input value={patientId} onChange={e => setPatientId(e.target.value)} required />
                    <button type="button" onClick={validatePatientId} disabled={patientLookupLoading}>Check</button>
                    <button type="button" onClick={useMyProfile} disabled={patientLookupLoading}>Use My Profile</button>
                </div>
                {patientLookupLoading && <div>Loading patient…</div>}
                {patientName && <div>Selected: {patientName}</div>}
            </div>
            <div>
                <label>Reason</label>
                <input value={reason} onChange={e => setReason(e.target.value)} />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" disabled={loading}>{loading ? 'Booking…' : 'Book appointment'}</button>
        </form>
    )
}
