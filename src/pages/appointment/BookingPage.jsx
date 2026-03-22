import BookingForm from './BookingForm'

export default function BookingPage() {
    return (
        <div className="page">
            <h2>Book Appointment</h2>
            <p>Confirm appointment details here, then continue to checkout and payment.</p>
            <BookingForm />
        </div>
    )
}
