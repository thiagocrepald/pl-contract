import _, { isNil } from 'lodash';

class StringUtils {
    static isStringEmpty = (event?: string) => {
        return isNil(event) || event === '';
    }

    static removeSpaceFromBothSides = (event?: string) => {
        return event?.trim();
    }

    static isPasswordInvalid = (event: string) => {
        return StringUtils.isStringEmpty(event) || event.length < 5 || event.length > 250;
    }

    static isSyntaxEmpty = (event?: string) => {
        return event === '${}' || event === '#{}';
    }

    static isSizeInvalid = (size: number, event?: string) => {
        if (StringUtils.isStringEmpty(event)) return true;
        return event?.length !== size;
    }

    static isSizeBetween = (min: number, max: number, event?: string) => {
        if (StringUtils.isStringEmpty(event)) return false;
        return event!.length >= min && event!.length <= max;
    }

    static generateFileUrl = (file: string, type: string) => {
        const blobObject = StringUtils.b64toBlob(file, type, null);
        return URL.createObjectURL(blobObject);
    };

    static b64toBlob = (b64Data, contentType, size) => {
        const sliceSize = size ?? 512;

        const byteCharacters = atob(b64Data);
        const byteArrays: Uint8Array[] = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType ?? '' });
    };


    static isEmailInvalid = (event?: string) => {
        if (StringUtils.isStringEmpty(event)) return true;
        const emailRegex = /\S+@\S+\.\S+/;
        return !emailRegex.test(event!);
    }

    static toObject = (key: string, event: any) => {
        const result = {};
        result[key] = event;
        return result;
    }

    static randomColor = () => {
        const colors: string[] = ['#14b071', '#4f35a5', '#1e98d6', '#1e2531', '#076653', '#cb2432', '#d54824', '#e89e14'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    static arrayRandomColors = (times: number) => {
        return Array.from(Array(times)).map(() => StringUtils.randomColor());
    };

    static randomString = () => {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
    }

    static b64EncodeUnicode = (str: string) => {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode(Number(`0x${p1}`));
            }));
    }

    static removeAccentToLowerCase = (event?: string) => {
        if (StringUtils.isStringEmpty(event)) return '';

        let withoutAccent;

        withoutAccent = event!.replace(new RegExp('[Ç]', 'gi'), 'c');
        withoutAccent = withoutAccent.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
        withoutAccent = withoutAccent.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
        withoutAccent = withoutAccent.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
        withoutAccent = withoutAccent.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
        withoutAccent = withoutAccent.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');

        return withoutAccent.toLowerCase();
    }

    static ignoreLettersMask =
        ['$', '#', '{', '}', '!', '@', '%', '&', '*', '(', ')', '+', '/', '[', ']', '?', '<', '>', '|', '\\', ';', ':', ','];

    static syntaxMask = (value: string, prefix: string) => {
        const newSyntaxMask = Array.from(value).filter(letter => !StringUtils.ignoreLettersMask.includes(letter));

        newSyntaxMask.push('}');
        newSyntaxMask.splice(0, 0, `${prefix}{`);

        return newSyntaxMask.join('').replace(/\s/g, '');
    }

    static digitize = (i) => {
        return (i>9) ? i : "0" + i; 
    }

    static convertDuration = (value?: string) => {
        if(value == null || value === '') {
            return undefined;
        }
        value = value.replace('PT', '');
        let hour = '00';
        if(value.includes('H')){
            hour = value.split('H')[0];
            hour = hour.length > 1 ? hour : `0${hour}`;
        }

        let minute = '00'
        if(value.includes('M')){
            minute = value.split('H').length > 1 ? value.split('H')[1].replace('M', '') : value.replace('M', '');
        }
        
        
        return _.padStart(hour, 2, '0') + ':' + _.padStart(minute, 2, '0');
    }

    static capitalizeFirstLetter(value?: string) {
        if (StringUtils.isStringEmpty(value)) return '';
        value = value!.toLowerCase();
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    static formatAsCurrency = (number) => {
        if (number != null) {
            let result = number.toString()
                .split("")
                .reverse()
                .join("")
                .replace(/(\d{2})?(\d)/, "$1.$2").split("")
                .reverse()
                .join("")

            return Number(result)
        }
        return undefined
    }

}

export default StringUtils;
