import { useState } from 'react';
import { UserProfile } from '../models/profile';

interface SectionVisibility {
    personalInfo: boolean;
    introduction: boolean;
    statistics: boolean;
}

function useProfileController() {
    const [profile, setProfile] = useState<UserProfile>({
        id: '1',
        name: 'Người dùng',
        dob: '1990-01-01',
        email: 'user@example.com',
        avatarUrl: '/avatar.webp',
        bio: 'Tôi quan tâm đến sức khỏe da và tìm hiểu về các phương pháp chẩn đoán hiện đại.',
        location: 'Hà Nội, Việt Nam',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<UserProfile>(profile);
    
    // Section visibility state - all sections visible by default
    const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>({
        personalInfo: true,
        introduction: true,
        statistics: true,
    });

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

    const toggleSection = (section: keyof SectionVisibility) => {
        setSectionVisibility(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return {
        profile,
        isEditing,
        editForm,
        sectionVisibility,
        startEdit,
        cancelEdit,
        saveProfile,
        updateEditForm,
        toggleSection
    };
}

export default useProfileController;