import axios from 'axios'

// API Gateway URL - all requests will go through the gateway
// when hosted
// const API_GATEWAY = 'https://api-gateway-268672367192.europe-west1.run.app'

// development
const API_GATEWAY = 'http://localhost:8080'

function getToken() {
    return localStorage.getItem('accessToken')
}

function authHeaders() {
    return { Authorization: `Bearer ${getToken()}` }
}

// ── Auth / User Service ─────────────────────────────────────────────────────

export async function register(data) {
    const res = await axios.post(`${API_GATEWAY}/api/auth/register`, data)
    return res.data
}

export async function login(data) {
    const res = await axios.post(`${API_GATEWAY}/api/auth/login`, data)
    return res.data
}

export async function logout() {
    const res = await axios.post(
        `${API_GATEWAY}/api/auth/logout`,
        {},
        { headers: authHeaders() }
    )
    return res.data
}

export async function refreshTokens(refreshToken) {
    const res = await axios.post(`${API_GATEWAY}/api/auth/refresh`, { refreshToken })
    return res.data
}

export async function getMe() {
    const res = await axios.get(`${API_GATEWAY}/api/auth/me`, {
        headers: authHeaders(),
    })
    return res.data
}

// ── Doctor Service ──────────────────────────────────────────────────────────

export async function getDoctors(params = {}) {
    const res = await axios.get(`${API_GATEWAY}/api/doctors`, {
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
    const res = await axios.get(`${API_GATEWAY}/api/doctors/${id}`, {
        headers: authHeaders(),
    })
    return res.data
}

export async function createDoctor(data) {
    const res = await axios.post(`${API_GATEWAY}/api/doctors`, data, {
        headers: authHeaders(),
    })
    return res.data
}

export async function updateDoctor(doctorId, data) {
    const res = await axios.put(`${API_GATEWAY}/api/doctors/${doctorId}`, data, {
        headers: authHeaders(),
    })
    return res.data
}

export async function verifyDoctor(doctorId, verified) {
    const res = await axios.patch(
        `${API_GATEWAY}/api/doctors/${doctorId}/verify`,
        { verified },
        { headers: authHeaders() }
    )
    return res.data
}

export async function getSlots(doctorId, date) {
    const url = (date && date !== 'undefined' && date !== undefined) ? `${API_GATEWAY}/api/doctors/${doctorId}/slots?date=${date}` : `${API_GATEWAY}/api/doctors/${doctorId}/slots`
    console.log('getSlots called with:', doctorId, date, 'URL:', url)
    const response = await fetch(url, {
        headers: authHeaders(),
    })
    console.log('Response status:', response.status)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    console.log('Response data:', data)
    return data
}

export async function createSlot(doctorId, data) {
    const res = await axios.post(
        `${API_GATEWAY}/api/doctors/${doctorId}/slots`,
        [data],
        { headers: authHeaders() }
    )
    return res.data
}

export async function reserveSlot(slotId, userId) {
    const res = await axios.post(
        `${API_GATEWAY}/api/slots/${slotId}/reserve`,
        { userId },
        { headers: authHeaders() }
    )
    return res.data
}

export async function releaseSlot(slotId) {
    const res = await axios.post(
        `${API_GATEWAY}/api/slots/${slotId}/release`,
        {},
        { headers: authHeaders() }
    )
    return res.data
}

export async function linkDoctorUser(doctorId, userId) {
    const res = await axios.patch(
        `${API_GATEWAY}/api/doctors/${doctorId}/link-user`,
        { userId },
        { headers: authHeaders() }
    )
    return res.data
}
