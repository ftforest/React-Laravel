import React,{useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../hooks/auth-hook";
function Navbar() {
    const { token, set } = useContext(AuthContext);
    const navigate = useNavigate();
    function handleLogout() {
        localStorage.removeItem("token")
        setAuthToken(null)
        navigate('/');
    }
    return (
        <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor: "#e3f2fd"}}>
                <Link to="/" className="navbar-brand">React App</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
                        aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav mr-auto">
                        {token == null ?
                            <li className="nav-item active">
                                <Link to="/" className="nav-link">Sing In/Sign Up</Link>
                            </li>
                        :
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="#" onClick={handleLogout}>Log Out</Link>
                                </li>
                            </>
                        }
                    </ul>
                </div>
            </nav>
        </div>
    );
};
export default Navbar;
