import { isEmpty, isEqual, xorWith } from 'lodash';

class ArrayUtils {
    static isEqual = (array1: any[], array2: any[]) => {
        return isEmpty(xorWith(array1, array2, isEqual));
    };
}

export default ArrayUtils;
