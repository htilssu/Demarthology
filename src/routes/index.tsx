import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomeView from '../views/home';
import Introduce from '../views/introduce';
import Diagnosis from '../views/diagnosis';
import Contact from '../views/contact';
import Profile from "../views/profile";
import ArticlesView from '../views/articles';
import MedicalHistory from "../views/medical-history";
import Login from "../views/login";
import Register from "../views/register";
import MainLayout from "../components/layouts/main-layout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import HospitalView from '../views/hospital';
import UV from '../views/uv';
import CommunityView from '../views/community';
import QuestionDetailView from '../views/question-detail';
import DiseaseKnowledge from '../views/disease-knowledge';

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Auth routes without layout */}
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>

                {/* Main app routes with layout */}
                <Route path={"/"} element={<MainLayout/>}>
                    <Route path="/" element={<HomeView/>}/>
                    <Route path="/introduce" element={<Introduce/>}/>
                    <Route path="/diagnosis" element={
                        <ProtectedRoute>
                            <Diagnosis/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/medical-history" element={
                        <ProtectedRoute>
                            <MedicalHistory/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/contact" element={<Contact/>}/>
                    <Route path="/articles" element={<ArticlesView />}/>
                    <Route path="/hospital" element={<HospitalView/>}/>
                    <Route path="/uv" element={<UV/>}/>
                    <Route path="/disease-knowledge" element={<DiseaseKnowledge/>}/>
                    <Route path="/community" element={<CommunityView/>}/>
                    <Route path="/community/question/:questionId" element={<QuestionDetailView/>}/>
                    <Route path="*" element={<div>Page Not Found</div>}/>
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;
