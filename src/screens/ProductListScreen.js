import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
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
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                loading: false
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreate: false };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false };
        default:
            return state;
    }
}
const ProductListScreen = () => {

    const navigate = useNavigate();

    const [{ loading, error, products, pages, loadingCreate }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const page = sp.get('page') || 1;

    const { state } = useContext(Store);
    const { userInfo } = state;


    useEffect(() => {
        const fetchData = async () => {
            try {

                const { data } = await axios.get(`${BASE_URL}/api/products/admin?page=${page}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                });

                dispatch({ type: 'FETCH_SUCCESS', payload: data });

            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(error) })
            }
        }
        fetchData();
    }, [page, userInfo.token]);

    const createHandler = async () => {
        if (window.confirm('Do you want to create?')) {
            try {
                dispatch({ type: 'CREATE_REQUEST' });
                const { data } = await axios.post(`${BASE_URL}/api/products`,
                    {},
                    { headers: { authorization: `Bearer ${userInfo.token}` } }
                );

                toast.success('Product Created successfully');
                dispatch({ type: 'CREATE_SUCCESS' });
                navigate(`/admin/product/${data.product._id}`)

            } catch (error) {
                toast.error(getError(error));
                dispatch({ type: 'CREATE_FAIL' })
            }
        }
    };

    return (
        <div>
            <Helmet>
                <title>Products</title>
            </Helmet>
            <Row>
                <Col><h1>Products</h1></Col>
                <Col className="col text-end">
                    <div>
                        <Button
                            type="button"
                            onClick={createHandler}
                        >
                            Create Product
                        </Button>
                    </div>
                </Col>
            </Row>

            {loadingCreate && <LoadingBox />}

            {loading ?
                (<LoadingBox />) :
                error ? <MessageBox variant="danger">{error}</MessageBox> :
                    (<>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>PRICE</th>
                                    <th>CATEGORY</th>
                                    <th>BRAND</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div>
                            Next ->
                            {[...Array(pages).keys()].map((x) => (
                                <Link
                                    key={x + 1}
                                    className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                                    to={`/admin/products?page=${x + 1}`}
                                >
                                    {x + 1}
                                </Link>

                            ))}
                        </div>
                    </>
                    )
            }
        </div>
    );
};

export default ProductListScreen;