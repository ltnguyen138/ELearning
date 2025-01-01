export enum ApprovalStatusEnum{

    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export function getApprovalStatusEnum(status: string | null | undefined): string {

    switch (status) {
        case 'PENDING': return 'Chờ duyệt';
        case 'APPROVED': return 'Đã duyệt';
        case 'REJECTED': return 'Từ chối';
        case null: return 'Unknown';
        case undefined: return 'Unknown';
        default: return 'Unknown';
    }
}