import { useMemo } from 'react';

let UID:number = 0;

export default function useUID():string {
    return useMemo(() => `app-uid-${UID++}`, []);
}
