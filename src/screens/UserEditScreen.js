import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { BASE_URL, getError } from '../utils';
import { Store } from './../context/Store';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };
        default:
            return state;
    }
};

const UserEditScreen = () => {

    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
        loading: false,
        error: ''
    });

    const { state } = useContext(Store);
    const { userInfo } = state;

    const params = useParams();
    const { id: userId } = params;
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isAdmin, setIsAdmin] = useState('');

    // const { search } = useLocation();
    // const redirectInUrl = new URLSearchParams(search).get('redirect');
    // const redirect = redirectInUrl ? redirectInUrl : '/';

    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    // const { state, dispatch: ctxDispatch } = useContext(Store);
    // const { userInfo } = state;


    useEffect(() => {
        const fetchData = async () => {

            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`${BASE_URL}/api/users/${userId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                });

                setName(data.name);
                setEmail(data.email);
                setIsAdmin(data.isAdmin);
                dispatch({ type: 'FETCH_SUCCESS' });

            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
                toast.error(getError(err))
            }

        }
        fetchData();
    }, [userId, userInfo.token]);


    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/api/users/${userId}`, {
                _id: userId, name, email, isAdmin
            },
                {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                });
            dispatch({ type: 'UPDATE_SUCCESS' });
            toast.success("user updated");
            navigate(`/admin/users`);
        } catch (error) {
            toast.error(getError(error));
            dispatch({ type: 'UPDATE_FAIL' })
        }
    };

    return (
        <Container className="small-container">
            <Helmet>
                <title>Edit User {userId}</title>
            </Helmet>
            <h1>Edit User {userId}</h1>
            {loading ? (<LoadingBox />) :
                error ? (<MessageBox variant="danger">{error}</MessageBox>) :
                    <Form>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Check
                            className="mb-3"
                            type="checkbox"
                            id="isAdmin"
                            label="isAdmin"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        />


                        <div className="mb-3">
                            <Button
                                onClick={submitHandler}
                                type="submit"
                                disabled={loadingUpdate}
                            >
                                Update
                            </Button>
                            {loadingUpdate && <LoadingBox />}
                        </div>
                    </Form>
            }
        </Container>
    );
};

export default UserEditScreen;