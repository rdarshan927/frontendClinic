import axios from 'axios'

const USER_SERVICE = 'https://user-service-268672367192.us-central1.run.app'
const DOCTOR_SERVICE = 'https://doctor-service-efc3c5f3xa-uc.a.run.app'

function getToken() {
    return localStorage.getItem('accessToken')
}

function authHeaders() {
    return { Authorization: `Bearer ${getToken()}` }
}

// ── Auth / User Service ─────────────────────────────────────────────────────

export async function register(data) {
    const res = await axios.post(`${USER_SERVICE}/api/auth/register`, data)
    return res.data
}

export async function login(data) {
    const res = await axios.post(`${USER_SERVICE}/api/auth/login`, data)
    return res.data
}

export async function logout() {
    const res = await axios.post(
        `${USER_SERVICE}/api/auth/logout`,
        {},
        { headers: authHeaders() }
    )
    return res.data
}

export async function refreshTokens(refreshToken) {
    const res = await axios.post(`${USER_SERVICE}/api/auth/refresh`, { refreshToken })
    return res.data
}

export async function getMe() {
    const res = await axios.get(`${USER_SERVICE}/api/auth/me`, {
        headers: authHeaders(),
    })
    return res.data
}

// ── Doctor Service ──────────────────────────────────────────────────────────

export async function getDoctors(params = {}) {
    const res = await axios.get(`${DOCTOR_SERVICE}/api/doctors`, {
        headers: authHeaders(),
        params,
    })
    return res.data
}

/**
 * Find the doctor profile linked to a given user-service userId.
 * There is no /api/doctors/me endpoint, so we fetch all doctors
 * and filter by userId on the client side.
 */
export async function getDoctorByUserId(userId) {
    const doctors = await getDoctors()
    return doctors.find(d => d.userId === userId) ?? null
}

export async function getDoctorById(id) {
    const res = await axios.get(`${DOCTOR_SERVICE}/api/doctors/${id}`, {
        headers: authHeaders(),
    })
    return res.data
}

export async function createDoctor(data) {
    const res = await axios.post(`${DOCTOR_SERVICE}/api/doctors`, data, {
        headers: authHeaders(),
    })
    return res.data
}

export async function updateDoctor(doctorId, data) {
    const res = await axios.put(`${DOCTOR_SERVICE}/api/doctors/${doctorId}`, data, {
        headers: authHeaders(),
    })
    return res.data
}

export async function verifyDoctor(doctorId, verified) {
    const res = await axios.patch(
        `${DOCTOR_SERVICE}/api/doctors/${doctorId}/verify`,
        { verified },
        { headers: authHeaders() }
    )
    return res.data
}

export async function getSlots(doctorId, date) {
    const url = date
        ? `${DOCTOR_SERVICE}/api/doctors/${doctorId}/slots?date=${date}`
        : `${DOCTOR_SERVICE}/api/doctors/${doctorId}/slots`
    const res = await axios.get(url, { headers: authHeaders() })
    return res.data
}

export async function createSlot(doctorId, data) {
    const res = await axios.post(
        `${DOCTOR_SERVICE}/api/doctors/${doctorId}/slots`,
        { slots: [data] },
        { headers: authHeaders() }
    )
    return res.data
}

export async function reserveSlot(slotId, userId) {
    const res = await axios.post(
        `${DOCTOR_SERVICE}/api/slots/${slotId}/reserve`,
        { userId },
        { headers: authHeaders() }
    )
    return res.data
}

export async function releaseSlot(slotId) {
    const res = await axios.post(
        `${DOCTOR_SERVICE}/api/slots/${slotId}/release`,
        {},
        { headers: authHeaders() }
    )
    return res.data
}

export async function linkDoctorUser(doctorId, userId) {
    const res = await axios.patch(
        `${DOCTOR_SERVICE}/api/doctors/${doctorId}/link-user`,
        { userId },
        { headers: authHeaders() }
    )
    return res.data
}
