import { AttachmentType } from './enums/attachment-type';

export interface Document {
    file?: any;
    id?: number;
    url?: string;
    key?: string;
    fileName?: string;
    originalFile?: any;
    processed?: boolean;
    contentType?: string;
    attachmentType?: AttachmentType;
}

export const defaultValue: Readonly<Document> = {
    processed: false
};
