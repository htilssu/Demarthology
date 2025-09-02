export interface UserProfile {
    id: string;
    name: string;
    dob: string; //Date of Birth in ISO format
    email: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
}