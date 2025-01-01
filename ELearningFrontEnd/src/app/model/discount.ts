export interface Discount {
    id: number;
    code: string;
    type: string;
    discount: number;
    validFrom: Date;
    validTo: Date;
    quantity: number;
    ourseId: number | null;
    activated: boolean
}