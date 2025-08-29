import {useState, useCallback} from 'react';
import {UserMedical} from "../models/user-medical";

function useMedicalHistoryController() {
    const [medicalHistory, setMedicalHistory] = useState<UserMedical[]>([])

    // Mock data for demonstration
    const loadMedicalHistory = useCallback(() => {
        setMedicalHistory([
            {
                id: '1',
                name: '',
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
                name: '',
                userId: 'user1',
                conditions: ['Viêm da seborrheic'],
                medications: ['Ketoconazole shampoo', 'Vitamin D3'],
                allergies: ['Latex'],
                surgeries: ['Cắt bỏ nốt ruồi (2023)'],
                familyHistory: ['Bệnh tim mạch'],
                lastUpdated: '2024-01-10T14:15:00.000Z'
            },
            {
                id: '3',
                name: '',
                userId: 'user1',
                conditions: ['Dị ứng thức ăn'],
                medications: ['Loratadine 10mg'],
                allergies: ['Đậu phộng', 'Sữa'],
                surgeries: [],
                familyHistory: ['Hen suyễn'],
                lastUpdated: '2024-01-05T09:45:00.000Z'
            },
            {
                id: '4',
                name: '',
                userId: 'user1',
                conditions: ['Viêm khớp'],
                medications: ['Ibuprofen 200mg', 'Glucosamine'],
                allergies: ['Aspirin'],
                surgeries: ['Phẫu thuật gối (2022)'],
                familyHistory: ['Bệnh xương khớp'],
                lastUpdated: '2023-12-20T16:20:00.000Z'
            },
            {
                id: '5',
                name: '',
                userId: 'user1',
                conditions: ['Cao huyết áp'],
                medications: ['Lisinopril 10mg', 'Amlodipine 5mg'],
                allergies: [],
                surgeries: [],
                familyHistory: ['Đột quỵ', 'Tim mạch'],
                lastUpdated: '2023-12-15T11:00:00.000Z'
            },
            {
                id: '6',
                name: '',
                userId: 'user1',
                conditions: ['Viêm dạ dày'],
                medications: ['Omeprazole 20mg'],
                allergies: ['Nsaids'],
                surgeries: [],
                familyHistory: ['Ung thư dạ dày'],
                lastUpdated: '2023-12-01T08:30:00.000Z'
            },
            {
                id: '7',
                name: '',
                userId: 'user1',
                conditions: ['Thiếu máu'],
                medications: ['Iron supplement', 'Vitamin B12'],
                allergies: [],
                surgeries: [],
                familyHistory: ['Thiếu máu di truyền'],
                lastUpdated: '2023-11-25T14:45:00.000Z'
            }
        ]);
    }, []);

    return { medicalHistory, loadMedicalHistory };
}

export default useMedicalHistoryController;