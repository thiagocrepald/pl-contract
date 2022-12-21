export interface LogType {
    snapshot?: Snapshot;
    change?: [];
}

interface Snapshot {
    commitMetadata?: {
        id?: number;
        author?: string;
        properties?: [];
        commitDate?: string;
        commitDateInstant?: string;  
    };
    globalId?: {
        cdoId?: number;
        entity?: string; 
    };
    state?: any,
    changedProperties?: string[];
    type: string; 
    version: number;
}
        