import { useState } from 'react';
import { UserProfile as ProfileModel } from '../models/profile';
import { useAuth } from '../contexts/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';

function useProfileController() {
    const { user } = useAuth();
    const { location: currentLocation, loading: locationLoading, error: locationError, getCurrentLocation } = useGeolocation();
    
    // Convert API user profile to local profile model
    const [profile, setProfile] = useState<ProfileModel>({
        id: user?.email || '1',
        name: user?.name || 'Người dùng',
        dob: user?.dateOfBirth || '1990-01-01',
        email: user?.email || 'user@example.com',
        avatarUrl: user?.urlImage || '/avatar.webp',
        bio: 'Tôi quan tâm đến sức khỏe da và tìm hiểu về các phương pháp chẩn đoán hiện đại.',
        location: 'Hà Nội, Việt Nam',
        latitude: undefined,
        longitude: undefined,
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

    const updateEditForm = (field: keyof ProfileModel, value: string | number) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const setCurrentLocation = async () => {
        try {
            const location = await getCurrentLocation();
            updateEditForm('latitude', location.latitude);
            updateEditForm('longitude', location.longitude);
            
            // Optional: Update location text with coordinates
            const locationText = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
            updateEditForm('location', locationText);
        } catch (error) {
            console.error('Failed to get current location:', error);
        }
    };

    return {
        profile,
        isEditing,
        editForm,
        startEdit,
        cancelEdit,
        saveProfile,
        updateEditForm,
        currentLocation,
        locationLoading,
        locationError,
        setCurrentLocation
    };
}

export default useProfileController;