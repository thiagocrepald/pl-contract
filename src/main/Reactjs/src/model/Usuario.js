import { Model } from 'react-axiom';

class Usuario extends Model {

    static defaultState() {
        return {
            id: null,
            nome: '',
            login: '',
            telefone: ''
        };
    }

}

export default Usuario;
