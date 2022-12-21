import { Document } from './document';
import { ContractAttachmentType } from './enums/contract-attachment-type';

export interface ContractAttachment {
    id?: number;
    contractAttachmentType?: ContractAttachmentType;
    attachment?: Document
}
