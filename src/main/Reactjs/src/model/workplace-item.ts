
export interface WorkplaceItem {
    id?: number;
    item?: number;  
    object?: string;
    quantity?: number;
    receivableAmount?: number | string;
    payablePartnerAmount?: number | string;
    paymentRpaAmount?: number | string;
    paymentPjAmount?: number | string;
}

export function workplaceItemFieldsIsNotEmpty(item: WorkplaceItem) {
    return (item?.id != null && item?.id !== 0 )
    || (item?.item != null && item?.item !== 0 )
    || (item?.object != null && item?.object !== '' )
    || (item?.quantity != null && item?.quantity !== 0 )
    || (item?.receivableAmount != null && item?.receivableAmount !== 0 )
    || (item?.payablePartnerAmount != null && item?.payablePartnerAmount !== 0 )
    || (item?.paymentPjAmount != null && item?.paymentPjAmount !== 0 )
    || (item?.paymentRpaAmount != null && item?.paymentRpaAmount !== 0 )
}