import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBr from '../i18n/pt-br.json';

const resources = {
    pt: {
        translation: ptBr
    }
};

const i18n = i18next.createInstance();

i18n.use(initReactI18next).init({
    resources,
    lng: 'pt',
    debug: true,

    interpolation: {
        escapeValue: false // react already safes from xss
    }
});

export default i18n;
