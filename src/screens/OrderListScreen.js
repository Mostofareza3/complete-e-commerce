import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MessageBox from '../components/MessageBox';
import { Store } from '../context/Store';
import { BASE_URL, getError } from '../utils';
import LoadingBox from './../components/LoadingBox';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                orders: action.payload,
                loading: false
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: true };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true
            };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state;
    }
}

const OrderListScreen = () => {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    });

    // console.log(orders[6].substring(0, 10));

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`${BASE_URL}/api/orders`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(error) })
            }
        }
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
    }, [userInfo.token, successDelete]);

    const deleteHandler = async (order) => {
        if (window.confirm('Do you want to to delete?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' });
                await axios.delete(`${BASE_URL}/api/orders/${order._id}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                });
                toast.success('order deleted.')
                dispatch({ type: 'DELETE_SUCCESS' });

            } catch (error) {
                toast.error(getError(error));
                dispatch({ type: 'DELETE_FAIL' })
            }
        }
    };
    return (
        <div>
            <Helmet>
                <title>Orders</title>
            </Helmet>
            <h1>Orders</h1>
            {loadingDelete && <LoadingBox />}
            {loading ? (<LoadingBox />) : error ? (<MessageBox variant="danger">{error}</MessageBox>) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user ? order.user.name : 'DELETED_USER'}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                                <td>{
                                    order.isDelivered ? order.deliveredAt.substring(0, 10)
                                        : 'No'
                                }
                                </td>
                                <td>
                                    <Button
                                        type="button"
                                        variant="light"
                                        onClick={() => {
                                            navigate(`/order/${order._id}`)
                                        }}
                                    >
                                        Details
                                    </Button> &nbsp;
                                    <Button
                                        type="button"
                                        variant="light"
                                        onClick={() => deleteHandler(order)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default OrderListScreen;