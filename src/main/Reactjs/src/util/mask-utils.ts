import _, { replace } from 'lodash';

/* eslint-disable @typescript-eslint/no-use-before-define */
export const maskCnpj = (value: string) => {
    if (value != null) {
        const replaced = value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1/$2')
            .replace(/(\d{4})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
        return replaced;
    }
    return null;

};

export const maskZipCode = (value: string) => {
    if (value != null ) {
        if (unmask(value).length > 8) {
            return value.slice(0, value.length - 1);
        }
        return value.replace(/\D/g, '').replace(/(.{5})(\d)/, '$1-$2');
    };
    return null;
};

export const unmask = (value: string) => {
    if (value != null) {
        return value.replace(/\D/g, '');
    }
    return '';
};

export const formatterCurrency = (amount: number | undefined | string) => {
    if (amount == null || amount === '') {
        return '';
    }
    let value = String(amount);

    value = value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{2})$/, "$1,$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");

    return `R$ ${value}`;
}

export const removeCurrencyMask = (amount: number | undefined | string) => {
    if(amount == null || amount === '') {
        return '';
    }
    amount = _.replace(amount as any, /[^0-9.,]/g, '');
    amount = _.replace(amount, /\./g, '');
    amount = _.replace(amount as any, /,/g, '.');
    
    return amount;
}

export const ifHasMaskRemove = (amount: number | undefined | string) => {
    if(String(amount).includes('R$')) {
        return removeCurrencyMask(amount);    
    }
    return amount;
}

export const maskAmount = (amount: number | undefined | string): string => {
    if(amount) {
        return amount?.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }
    
    return '';
}

export const maskCpf = (value: string) => {
    if (value != null) {
        const replaced = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        return replaced;
    }
    return null;
}

export const maskPrice = (price: number) => {
    return price?.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};