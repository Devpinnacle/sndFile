import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../redux/UserSlice'

const Nave = () => {
    const { loading, user, error, login, token } = useSelector((state) => state.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogin = () => {
        navigate("/login")
    }
    const handleLogout = () => {
        dispatch(logout())
    }
    return (
        <>
            <nav class="navbar navbar-expand-lg navbar-light bg-primary text-light">
                <a class="navbar-brand text-light" href="#">Navbar</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <a class="nav-link text-light" href="#">Home <span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-light" href="#">About</a>
                        </li>

                    </ul>
                    <div class="form-inline my-2 my-lg-0">
                        {!login && (<button type="button" className="btn btn-info float-right" onClick={handleLogin}>Login</button>)}
                        {login && (
                            <>
                                <p>{user[0].email}</p>
                                <button type="button" className="btn btn-info mx-2" onClick={handleLogout}>Logout</button>

                            </>
                        )}
                    </div>
                </div>
            </nav>

        </>
    )
}
export default Nave




{/* <nav>
<div className="nav nav-tabs" id="nav-tab" role="tablist">
    <Link to='/' className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Home</Link>
    <Link className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</Link>
    <Link className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Contact</Link>
    {!login && (<button type="button" className="btn btn-info float-right" onClick={handleLogin}>Login</button>)}
    {login && (<div className='d-flex flex-row-reverse'>
        <div className="p-2"><button type="button" className="btn btn-info" onClick={handleLogout}>Logout</button></div>
        <div className="p-2"><p>{user[0].email}</p></div>
    </div>)}

</div>
</nav> */}