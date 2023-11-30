import React,{useState,useEffect,useContext} from 'react';
import {Navigate} from "react-router-dom";
import {AuthContext} from "../hooks/auth-hook";


const Profile = () => {
    if (localStorage.getItem("token") === null) return <Navigate to="/" replace />
    const [data, setData] = useState(null);
    const { setAuthToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Устанавливаем токен в заголовки Axios для всех будущих запросов
                //axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                console.log(axios.defaults.headers.common['Authorization'],'axios.defaults.headers.common[\'Authorization\']')
                const response = await axios.get('http://127.0.0.1:8000/api/profile');

                setData(response.data.user_info);
                setAuthToken(token)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    },[]);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-4">
            {data ? (
                <ul>
                    {Object.keys(data).map((key,index) =>
                        <li key={index}>{key} : {data[key]}</li>
                    )}
                </ul>
            ) : (
                <p>Loading data...</p>
            )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
