import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from './../context/Store';

const SigninScreen = () => {
    const history = useHistory();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`http://localhost:5000/api/users/signin`, {
                email,
                password
            });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            history.push(redirect || '/');
        } catch (error) {
            toast.error(getError(error))
        }
    };

    useEffect(() => {
        if (userInfo) {
            history.push(redirect)
        }
    }, [redirect, history, userInfo])

    return (
        <Container className="small-container">
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <h1 className="my-3">Sign In</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" required />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Sign In</Button>
                </div>
                <div className="mb-3">
                    New customer? {' '}
                    <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
                </div>
            </Form>
        </Container>
    );
};

export default SigninScreen;