import axios from 'axios'

const BASE = 'http://localhost/data-vihara-api/anggota.php'

export const getAnggota    = (search = '') => axios.get(`${BASE}?search=${search}`)
export const getOneAnggota = (id)          => axios.get(`${BASE}?id=${id}`)
export const createAnggota = (data)        => axios.post(BASE, data)
export const updateAnggota = (id, data)    => axios.put(`${BASE}?id=${id}`, data)
export const deleteAnggota = (id)          => axios.delete(`${BASE}?id=${id}`)