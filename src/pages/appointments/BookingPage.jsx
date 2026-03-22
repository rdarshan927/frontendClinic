import React from 'react'
import BookingForm from '../../components/BookingForm'

export default function BookingPage() {
    return (
        <div className="page">
            <h2>Book Appointment</h2>
            <p>Enter doctor, slot and your patient id to reserve a slot and start payment.</p>
            <BookingForm />
        </div>
    )
}
