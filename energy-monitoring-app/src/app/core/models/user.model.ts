// src/app/core/models/user.model.ts
export interface User {
    id: string;
    userName: string;
    email: string;
    fullName: string;
    roles: string[];
    enterpriseName?: string;
    numberOfEmployees?: number;
    contractDate?: string;
    category?: string;
}