import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-bootstrap/Modal';
import { getUser, loadUser, logout } from '../redux/UserSlice'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
;


const Login = () => {
    const [flag, setFlag] = useState(false)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [pass, setPass] = useState('')
    const [dob, setDob] = useState('')
    const [validated, setValidated] = useState(false);
    const [addr, setAddr] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    var b = useRef('')

    const { loading, user, error, login, token } = useSelector((state) => state.user)

    useEffect(() => {

        if (!(user === undefined)) {
            if (!(user.length === 0)) {
                console.log("handle load user.................", user)
                console.log("handle load user........UseEffect.........", user)
                navigate('/transfer')
            }

        }
    }, [user])

    useEffect(() => {
        if (token != null) {
            console.log("token part...................", token)
            dispatch(loadUser())
        }

    }, [token])

    const handleRegister = async () => {
        const snd = {
            email: email,
            password: pass,
            dob: dob,
            addr: addr,
            name:name
        }
       
        const y = await axios({
            method: 'post',
            url: 'http://192.168.6.65:3000/api/user/add_user',
            data: snd
        });
        console.log(y.data)
        setFlag(false)
    }

    const handleLogin = async (e) => {
        console.log("login pressed")
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();

        }
        console.log("inside if")
        const snd = {
            email: email,
            password: pass,
        }
        dispatch(getUser(snd))
        setValidated(true);
    }

    const handleClose = () => {
        setFlag(false)
    }

    const handlelLogout = () => {
        dispatch(logout())
    }
    return (
        <>
            <div className="container w-25 my-5">
                <button type="button" className="btn btn-outline-primary" onClick={() => setFlag(true)}>Add User</button>
                <button type="button" className="btn btn-outline-primary mx-1" onClick={() => setFlag(false)}>Login</button>
            </div>
            {!flag ? (<div className="container my-5 w-100">
                <Form noValidate validated={validated} onSubmit={handleLogin}>
                    <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            required
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom02">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Password"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    <Button className='my-3' type="submit">Login</Button>
                </Form>
            </div>) : (<></>)}
            <Modal
                show={flag}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <div className="container my-5 w-50">
                    <button type="button" className="close" aria-label="Close" onClick={handleClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h2>Register</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">User name</label>
                            <input type="text" className="form-control" id="exampleInputPassword1" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Date of Birth</label>
                            <input type="date" className="form-control" id="exampleInputPassword1" placeholder="Password" value={dob} onChange={(e) => setDob(e.target.value)} />
                        </div>
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">Address</label>
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={addr} onChange={(e) => setAddr(e.target.value)}></textarea>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={() => handleRegister()}>Register</button>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default Login