import {useState, useCallback} from 'react';
import {UserMedical} from "../models/user-medical";

function useMedicalHistoryController() {
    const [medicalHistory, setMedicalHistory] = useState<UserMedical[]>([])

    // Mock data for demonstration
    const loadMedicalHistory = useCallback(() => {
        setMedicalHistory([
            {
                id: '1',
                userId: 'user1',
                conditions: ['Eczema', 'Viêm da cơ địa'],
                medications: ['Hydrocortisone cream 1%', 'Cetirizine 10mg'],
                allergies: ['Penicillin', 'Hải sản'],
                surgeries: [],
                familyHistory: ['Tiểu đường type 2', 'Cao huyết áp'],
                lastUpdated: '2024-01-15T10:30:00.000Z'
            },
            {
                id: '2',
                userId: 'user1',
                conditions: ['Viêm da seborrheic'],
                medications: ['Ketoconazole shampoo', 'Vitamin D3'],
                allergies: ['Latex'],
                surgeries: ['Cắt bỏ nốt ruồi (2023)'],
                familyHistory: ['Bệnh tim mạch'],
                lastUpdated: '2024-01-10T14:15:00.000Z'
            }
        ]);
    }, []);

    return { medicalHistory, loadMedicalHistory };
}

export default useMedicalHistoryController;