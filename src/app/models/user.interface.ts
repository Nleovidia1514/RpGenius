import { DocumentReference } from '@angular/fire/firestore';

export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email?: string;
    displayName: string;
    cart: { quantity: number; ref: DocumentReference }[];
    isAdmin: boolean;
}
