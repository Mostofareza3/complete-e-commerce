import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from './../context/Store';
import { BASE_URL, getError } from './../utils';
import Axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        case 'PAY_REQUEST':
            return { ...state, loadingPay: true }
        case 'PAY_SUCCESS':
            return { ...state, loadingPay: false, successPay: true }
        case 'PAY_FAIL':
            return { ...state, loadingPay: false, errorPay: action.payload }
        case 'PAY_RESET':
            return { ...state, loadingPay: false, successPay: false };
        case 'DELIVER_REQUEST':
            return { ...state, loadingDeliver: true };
        case 'DELIVER_SUCCESS':
            return { ...state, loadingDeliver: false, successDeliver: true };
        case 'DELIVER_FAIL':
            return { ...state, loadingDeliver: false, errorDeliver: action.payload };
        case 'DELIVER_RESET':
            return { ...state, loadingDeliver: false, successDeliver: false }
        default:
            return state
    }
};


const OrderScreen = () => {

    const navigate = useNavigate();
    const params = useParams();
    const { id: orderId } = params;
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, order, successPay, loadingPay, loadingDeliver, successDeliver }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
        successPay: false,
        loadingPay: false
    });
    // console.log(order.orderItems)
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const createOrder = (data, actions) => {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: { value: order.totalPrice }
                    },
                ],
            }).then((orderID) => {
                return orderID;
            })
    }

    const onApprove = (data, actions) => {
        return actions.order.capture().then(async (details) => {
            try {

                dispatch({ type: 'PAY_REQUEST' });
                const { data } = await Axios.put(`${BASE_URL}/api/orders/${order._id}/pay`,
                    details,
                    {
                        headers: { authorization: `Bearer ${userInfo.token}` }
                    }
                );
                dispatch({ type: 'PAY_SUCCESS', payload: data });
                toast.success("Order is paid");

            } catch (error) {
                dispatch({ type: 'PAY_FAIL', payload: getError(error) });
                toast.error(getError(error))
            }
        })
    };

    const onError = (err) => {
        toast.error(getError(err))
    }

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await Axios.get(`${BASE_URL}/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data })
            }
            catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
            }
        }

        if (!userInfo) {
            return navigate('/login')
        };

        if (!order._id || successPay || successDeliver || (order._id && order._id !== orderId)) {
            fetchOrder();
            if (successPay) {
                dispatch({ type: 'PAY_RESET' })
            }
            if (successDeliver) {
                dispatch({ type: 'DELIVER_RESET' })
            }
        }
        else {
            const loadPayPalScript = async () => {
                const { data: clientId } = await Axios.get(`${BASE_URL}/api/keys/paypal`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                });
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'USD'
                    }
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
            }
            loadPayPalScript();
        }
    }, [userInfo, navigate, order._id, orderId, paypalDispatch, successPay, successDeliver]);

    const deliverOrderHandler = async () => {
        try {
            dispatch({ type: 'DELIVER_REQUEST' });
            const { data } = await Axios.put(`${BASE_URL}/api/orders/${order._id}/deliver`,
                {}, {
                headers: { authorization: `Bearer ${userInfo.token}` }
            });
            dispatch({ type: 'DELIVER_SUCCESS', payload: data });
            toast.success('Order is Delivered');

        } catch (error) {
            toast.error(getError(error));
            dispatch({ type: 'DELIVER_FAIL' });
        }
    }

    return (
        <>
            {loading ? (<LoadingBox />) : error ? (<MessageBox variant="danger">hello</MessageBox>) :
                <div>
                    <Helmet>
                        <title>Order {orderId}</title>
                    </Helmet>
                    <h1 className="my-3">Order {orderId}</h1>
                    <Row>
                        <Col md={8}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Shipping</Card.Title>
                                    <Card.Text>
                                        <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                                        <strong>Address:</strong> {order.shippingAddress.address},
                                        {order.shippingAddress.city},{order.shippingAddress.postalCode},
                                        {order.shippingAddress.country}
                                    </Card.Text>
                                    {order.isDelivered ? (
                                        <MessageBox variant="success">Delivered at {order.isDelivered}</MessageBox>) :
                                        (<MessageBox variant="danger">Not Delivered</MessageBox>)}
                                </Card.Body>
                            </Card>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Payment</Card.Title>
                                    <Card.Text>
                                        <strong>Method: </strong> {order.paymentMethod}
                                    </Card.Text>
                                    {order.isPaid ? (
                                        <MessageBox variant="success">Paid at {order.paidAt}</MessageBox>) :
                                        (<MessageBox variant="danger">Not Paid</MessageBox>)}
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Items</Card.Title>
                                    <ListGroup variant="flush">
                                        {order.orderItems.map((item) => (
                                            <ListGroup.Item key={item._id}>
                                                <Row className="align-items-center">
                                                    <Col md={6}>
                                                        <img src={item.image} alt={item.name}
                                                            className="img-fluid rounded img-thumbnail"
                                                        /> {' '}
                                                        <Link to={`/product/${item.slug}`}></Link>
                                                    </Col>
                                                    <Col md={3}>Quantity: <span>{item.quantity}</span></Col>
                                                    <Col md={3}>Price: ${item.price}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Order Summary</Card.Title>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Items</Col>
                                                <Col>${order.itemsPrice.toFixed(2)}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Shipping</Col>
                                                <Col>${order.shippingPrice.toFixed(2)}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Tax</Col>
                                                <Col>${order.taxPrice.toFixed(2)}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col><strong>Order Total</strong> </Col>
                                                <Col><strong>${order.totalPrice.toFixed(2)}</strong></Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {!order.isPaid && (
                                            <ListGroup.Item>
                                                {isPending ? (<LoadingBox />) : (
                                                    <div>
                                                        <PayPalButtons
                                                            createOrder={createOrder}
                                                            onApprove={onApprove}
                                                            onError={onError}
                                                        >
                                                        </PayPalButtons>
                                                    </div>
                                                )
                                                }
                                                {loadingPay && <LoadingBox />}
                                            </ListGroup.Item>
                                        )}
                                        {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                            <ListGroup.Item>
                                                {loadingDeliver && <LoadingBox />}
                                                <div className="d-grid">
                                                    <Button
                                                        type="button"
                                                        onClick={deliverOrderHandler}
                                                    >
                                                        Deliver Order
                                                    </Button>
                                                </div>
                                            </ListGroup.Item>
                                        )}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            }
        </>
    );
};

export default OrderScreen;