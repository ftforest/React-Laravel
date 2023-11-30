import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import App from "../pages/App";
import Profile from "../pages/Profile";
import Navbar from "./Navbar";
import { AuthProvider } from '../hooks/auth-hook';
function MyApp() {
    return (
        <>
        <Navbar />
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route
                path="*"
                element={<Navigate to="/profile" replace />}
            />
        </Routes>
        </>
    );
}
export default MyApp;
if (document.getElementById('app')) {
    ReactDOM.render(
        <BrowserRouter>
            <AuthProvider>
                <MyApp />
            </AuthProvider>
        </BrowserRouter>
        , document.getElementById('app'));
}
