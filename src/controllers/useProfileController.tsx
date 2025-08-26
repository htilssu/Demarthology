import { useState } from 'react';
import { UserProfile } from '../models/profile';

function useProfileController() {
    const [profile, setProfile] = useState<UserProfile>({
        id: '1',
        name: 'Người dùng',
        dob: '1990-01-01',
        email: 'user@example.com',
        avatarUrl: '/avatar.webp',
        bio: 'Tôi quan tâm đến sức khỏe da và tìm hiểu về các phương pháp chẩn đoán hiện đại.',
        location: 'Hà Nội, Việt Nam',
        website: 'https://example.com'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<UserProfile>(profile);

    const startEdit = () => {
        setEditForm(profile);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setEditForm(profile);
        setIsEditing(false);
    };

    const saveProfile = () => {
        setProfile(editForm);
        setIsEditing(false);
    };

    const updateEditForm = (field: keyof UserProfile, value: string) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    return {
        profile,
        isEditing,
        editForm,
        startEdit,
        cancelEdit,
        saveProfile,
        updateEditForm
    };
}

export default useProfileController;