import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

const HomeScreen = () => {
    const [{ loading, error, products }, dispatch] = useReducer(reducer, {
        products: [],
        loading: true,
        error: ''
    })
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get('http://localhost:5000/api/product');
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: error.message })
            }
        };
        fetchData();
    }, [])
    return (
        <div>
            <h1>Featured Products</h1>
            <div className="products">
                {
                    loading ? (<div>loading...</div>) : error ? (<div>{error}</div>) :
                        (
                            <Row>
                                {products.map((product) => (
                                    <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                                        <Product product={product}></Product>
                                    </Col>
                                ))}
                            </Row>
                        )}
            </div>
        </div>
    );
};

export default HomeScreen;