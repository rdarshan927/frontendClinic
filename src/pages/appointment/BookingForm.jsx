import { useMemo, useState } from 'react'
import { createAppointment } from '../../api'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function BookingForm({ initialDoctorId = '' }) {
    const [searchParams] = useSearchParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    const doctorIdFromQuery = useMemo(() => searchParams.get('doctorId') || '', [searchParams])
    const slotIdFromQuery = useMemo(() => searchParams.get('slotId') || '', [searchParams])

    const [doctorId, setDoctorId] = useState(initialDoctorId || doctorIdFromQuery)
    const [slotId, setSlotId] = useState(slotIdFromQuery)
    const [reason, setReason] = useState('Consultation')
    const [notes, setNotes] = useState('')
    const [amount, setAmount] = useState(Number(import.meta.env.VITE_DEFAULT_APPOINTMENT_AMOUNT || 2500))
    const [currency, setCurrency] = useState('LKR')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            if (!user?.id) {
                throw new Error('Please login again to continue')
            }
            const payload = {
                doctorId,
                slotId,
                patientId: user.id,
                reason,
                notes,
                amount: Number(amount),
                currency,
            }
            const appointment = await createAppointment(payload)
            navigate(`/checkout?appointmentId=${appointment.id}`)
        } catch (err) {
            console.error(err)
            setError(err?.response?.data?.message || err.message || 'Failed')
        } finally {
            setLoading(false)
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
                <input value={user?.id || ''} readOnly />
            </div>
            <div>
                <label>Reason</label>
                <input value={reason} onChange={e => setReason(e.target.value)} required />
            </div>
            <div>
                <label>Notes</label>
                <input value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div>
                <label>Amount</label>
                <input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>
            <div>
                <label>Currency</label>
                <input value={currency} onChange={e => setCurrency(e.target.value.toUpperCase())} required />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" disabled={loading}>{loading ? 'Creating appointment…' : 'Continue to checkout'}</button>
        </form>
    )
}
