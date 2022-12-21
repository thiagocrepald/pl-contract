import UsuarioFactory from '../views/Usuario/Usuario.factory';

const Axios = require('axios');

// @ts-ignore
const api = Axios.create({
    // @ts-ignore
    baseURL: process.env.REACT_APP_API_URL
});

api.interceptors.request.use(async(config) => {
    const token = UsuarioFactory.getTokenUsuario();
    if (token != null && token.trim() !== '') {
        config.headers.Authorization = `Basic ${token}`;
    }
    return config;
});

export default api;
