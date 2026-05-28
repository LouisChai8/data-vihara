import axios from 'axios'

const BASE = 'https://data-vihara.infinityfreeapp.com/data-vihara-api/anggota.php'
const BASE_AUTH = 'https://data-vihara.infinityfreeapp.com/data-vihara-api/auth.php'

export const getAnggota     = (search = '') => axios.get(`${BASE}?search=${search}`)
export const getOneAnggota  = (id)          => axios.get(`${BASE}?id=${id}`)
export const createAnggota  = (data)        => axios.post(BASE, data)
export const updateAnggota  = (id, data)    => axios.put(`${BASE}?id=${id}`, data)
export const deleteAnggota  = (id)          => axios.delete(`${BASE}?id=${id}`)

// ── Auth ──────────────────────────────────────────────────────────────────
export const loginUser      = (data) => axios.post(`${BASE_AUTH}?action=login`,    data)
export const registerUser   = (data) => axios.post(`${BASE_AUTH}?action=register`, data)