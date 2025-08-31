import { useState } from 'react';
import { UserProfile as ProfileModel } from '../models/profile';
import { useAuth } from '../contexts/AuthContext';

function useProfileController() {
    const { user } = useAuth();
    
    // Convert API user profile to local profile model
    const [profile, setProfile] = useState<ProfileModel>({
        id: user?.email || '1',
        name: user?.name || 'Người dùng',
        dob: user?.dateOfBirth || '1990-01-01',
        email: user?.email || 'user@example.com',
        avatarUrl: user?.urlImage || '/avatar.webp',
        bio: 'Tôi quan tâm đến sức khỏe da và tìm hiểu về các phương pháp chẩn đoán hiện đại.',
        location: 'Hà Nội, Việt Nam',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<ProfileModel>(profile);

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

    const updateEditForm = (field: keyof ProfileModel, value: string) => {
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