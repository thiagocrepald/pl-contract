export interface Validation {
    message: string;
    handler: (event: any[]) => boolean
}

export interface ErrorAndMessage {
    value: boolean;
    message: string;
}

export const defaultValue: Readonly<ErrorAndMessage> = {
    message: '',
    value: false
}
