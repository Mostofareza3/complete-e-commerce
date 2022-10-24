import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../context/Store';
import { BASE_URL, getError } from '../utils';

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
            return { ...state, loadingUpdate: false, error: action.payload };
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return {
                ...state,
                loading: false
            };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };
        default:
            return state;
    }
};

const ProductEditScreen = () => {

    const navigate = useNavigate();
    const params = useParams();
    const { id: productId } = params;
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    });

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`${BASE_URL}/api/products/${productId}`);
                setName(data.name);
                setSlug(data.slug);
                setPrice(data.price);
                setImage(data.image);
                setCategory(data.category);
                setCountInStock(data.countInStock);
                setBrand(data.brand);
                setDescription(data.description);
                dispatch({ type: 'FETCH_SUCCESS' })

            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(error) })
            }
        };
        fetchData();
    }, [productId]);

    const updateHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(`${BASE_URL}/api/products/${productId}`,
                {
                    _id: productId,
                    name,
                    slug,
                    price,
                    image,
                    category,
                    brand,
                    countInStock,
                    description
                },
                {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                }
            );
            dispatch({ type: 'UPDATE_SUCCESS' });
            toast.success("Product Updated Successfully");
            navigate('/admin/products')

        } catch (error) {
            toast.error(getError(error));
            dispatch({ type: 'UPDATE_FAIL' });
        }

    };

    return (
        <Container className="small-container">
            <Helmet>
                <title>Edit Product ${productId}</title>
            </Helmet>
            <h1>Edit Product ${productId}</h1>
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
                        <Form.Group className="mb-3" controlId="slug">
                            <Form.Label>Slug</Form.Label>
                            <Form.Control
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="image">
                            <Form.Label>Image File</Form.Label>
                            <Form.Control
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="countInStock">
                            <Form.Label>countInStock</Form.Label>
                            <Form.Control
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="brand">
                            <Form.Label>brand</Form.Label>
                            <Form.Control
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>description</Form.Label>
                            <Form.Control
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <div className="mb-3">
                            <Button
                                onClick={updateHandler}
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

export default ProductEditScreen;