import { useParams, useNavigate, useLocation } from 'react-router-dom'

export default function PaymentSuccessPage() {
    const { appointmentId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state || {}

    return (
        <div className="main-content fade-in">
            <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
                <div style={{ marginBottom: '32px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 24px',
                        background: 'var(--success)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                    }}>
                        ✓
                    </div>
                    <h1 className="page-title">Payment Successful!</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Your appointment payment has been processed successfully.
                    </p>
                </div>

                {state.doctorName && (
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div className="card-title">Appointment Confirmation</div>
                        <div className="info-grid" style={{ textAlign: 'left', marginTop: '16px' }}>
                            <div className="info-item">
                                <label className="info-label">Doctor</label>
                                <p className="info-value">{state.doctorName}</p>
                            </div>
                            <div className="info-item">
                                <label className="info-label">Date & Time</label>
                                <p className="info-value">{state.appointmentDate} at {state.startTime}</p>
                            </div>
                            <div className="info-item">
                                <label className="info-label">Amount Paid</label>
                                <p className="info-value" style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                                    {state.currency} {state.amount}
                                </p>
                            </div>
                            <div className="info-item">
                                <label className="info-label">Appointment ID</label>
                                <p className="info-value" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{appointmentId}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/doctors')}>
                        Browse More Doctors
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/my-appointments')}>
                        View My Appointments
                    </button>
                </div>

                <p style={{ marginTop: '32px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    A confirmation email has been sent to your registered email address.
                </p>
            </div>
        </div>
    )
}
