import React, { useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { Row, Col, ListGroup, Card, Badge, Button } from 'react-bootstrap';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import MessageBox from './../components/MessageBox';
import LoadingBox from './../components/LoadingBox';
import { getError } from '../utils';
import { Store } from '../context/Store';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

const ProductScreen = () => {
    const history = useHistory();
    const params = useParams();
    const { slug } = params;
    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: ''
    });
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`http://localhost:5000/api/products/slug/${slug}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
            }
        };
        fetchData();
    }, [slug]);

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart } = state;

    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`http://localhost:5000/api/products/${product._id}`)
        if (data.countInStock < quantity) {
            window.alert('Sorry! Product is out of stock!');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...product, quantity }
        });
        history.push('/cart')
    }

    return (
        <>
            {loading ? (<LoadingBox />) : error ? (<MessageBox variant="danger">{error}</MessageBox>) :
                <div>
                    <Row>
                        <Col md={6}>
                            <img className="img-large" src={product.image} alt={product.name} />
                        </Col>
                        <Col md={3}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Helmet>
                                        <title>{product.name}</title>
                                    </Helmet>
                                    <h1>{product.name}</h1>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating rating={product.rating} numReviews={product.numReviews} />
                                </ListGroup.Item>
                                <ListGroup.Item>Price : $ {product.price}</ListGroup.Item>
                                <ListGroup.Item>Description : {product.description}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Price:</Col>
                                                <Col>${product.price}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Status:</Col>
                                                <Col>{product.countInStock > 0 ?
                                                    <Badge bg="success">In stock</Badge> :
                                                    <Badge bg="danger">Stock out</Badge>
                                                }</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {
                                            product.countInStock > 0 && (
                                                <ListGroup.Item>
                                                    <div className="d-grid">
                                                        <Button onClick={addToCartHandler} variant="primary">Add to cart</Button>
                                                    </div>
                                                </ListGroup.Item>
                                            )
                                        }
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

export default ProductScreen;