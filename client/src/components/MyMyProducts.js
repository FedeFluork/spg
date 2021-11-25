import React, { useState, useEffect } from "react";
import { Button, ListGroup, Container, Row, Col, Alert } from "react-bootstrap";
import { PencilSquare, CheckSquare } from "react-bootstrap-icons";
import { Link, Navigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import './MyNavBar.css';
import API from "./API";


function MyMyProducts(props) {
    const [goBack, setGoBack] = useState(false);
    const [modal, setModal] = useState();
    const [products, setProducts] = useState([]);
    const [reqUpdate, setReqUpdate] = useState(true);
    const [product, setProduct] = useState();
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);

    useEffect(() => {
        if (reqUpdate || props.cart) {
            API.loadNextProducts().then((p) => {
                if (p.error === undefined) {
                    p.forEach((prod) => {
                        let find = props.cart.find((c) => c.id === prod.id)
                        if (props.cart.find((c) => c.id === prod.id)) {
                            prod.quantity = prod.quantity - find.quantity;
                        }
                    });
                    setProducts(p.filter((prod) => prod.quantity !== 0));
                    setReqUpdate(false);
                }
            }).catch((err) => {
                console.log(err)
            });
        }
    }, [reqUpdate, props.cart, props.user]);

    if (goBack) {
        return (<Navigate to={"/" + props.user.role}></Navigate>)
    }

    const handleModify = (id) => {
        setProduct(products.find((prod) => prod.id === id));
        handleShow();
    }

    const handleConfirm = (id) => {
        setProduct(products.find((prod) => prod.id === id));
        handleShow();
    }


    return (
        <>
            <Container className="bg-dark min-height-100 justify-content-center align-items-center text-center below-nav mt-3" fluid>
                {(props.clock && !((props.clock.day() === 1 && props.clock.hour() >= 9) || (props.clock.day() >= 2 && props.clock.day() <= 5) || (props.clock.day() === 6 && props.clock.hour() < 9))
                    &&
                    <Alert variant="danger">You can add new products from Monday 9:00 to Saturday 9:00.</Alert>)
                }
                {(props.clock && ((props.clock.day() === 1 && props.clock.hour() >= 9) || (props.clock.day() >= 2 && props.clock.day() <= 5) || (props.clock.day() === 6 && props.clock.hour() < 9))
                    &&
                    <Alert variant="danger">You can confirm products from Saturday 9:00 to Monday 9:00.</Alert>)
                }
                <Row>
                    <Col>
                        <Button size="lg" className="btn-danger p-2 w-100 mt-3" onClick={() => setGoBack(true)}>Back</Button>
                    </Col>
                    <Col>
                        {(props.clock && ((props.clock.day() === 1 && props.clock.hour() >= 9) || (props.clock.day() >= 2 && props.clock.day() <= 5) || (props.clock.day() === 6 && props.clock.hour() < 9))) ?
                            <Button size="lg" className="btn-info p-2 w-100 mt-3" onClick={() => { setModal('add'); handleShow(); }}>Add new product</Button>
                            :
                            <Button size="lg" className="btn-light p-2 w-100 mt-3">Add new product</Button>
                        }
                    </Col>
                </Row>
                <ListGroup className="my-3 mx-5" horizontal>
                    <ListGroup.Item variant="warning" className="d-flex w-100 justify-content-center"><b>Id</b></ListGroup.Item>
                    <ListGroup.Item variant="warning" className="d-flex w-100 justify-content-center"><b>Name</b></ListGroup.Item>
                    <ListGroup.Item variant="warning" className="d-flex w-100 justify-content-center"><b>Quantity</b></ListGroup.Item>
                    <ListGroup.Item variant="warning" className="d-flex w-100 justify-content-center"><b>Farmer</b></ListGroup.Item>
                    <ListGroup.Item variant="warning" className="d-flex w-100 justify-content-center"><b>Price</b></ListGroup.Item>
                    <ListGroup.Item variant="warning" className="d-flex w-100 justify-content-center"><b>Modify</b></ListGroup.Item>
                    <ListGroup.Item variant="warning" className="d-flex w-100 justify-content-center"><b>Confirm</b></ListGroup.Item>
                </ListGroup>
                {products &&
                    <>
                        {
                            products.map(p => {
                                return (
                                    <ListGroup key={p.id} className="my-2 mx-5" horizontal>
                                        <ListGroup.Item variant="primary" className="d-flex w-100 justify-content-center">{p.id}</ListGroup.Item>
                                        <ListGroup.Item variant="primary" className="d-flex w-100 justify-content-center">{p.name}</ListGroup.Item>
                                        <ListGroup.Item variant="primary" className="d-flex w-100 justify-content-center">{p.quantity + " " + p.unit}</ListGroup.Item>
                                        <ListGroup.Item as={Link} to={"/employee/farmers/" + p.farmer} style={{ textDecoration: 'none' }} variant="primary" className="d-flex w-100 justify-content-center">{p.farmerName}</ListGroup.Item>
                                        <ListGroup.Item variant="primary" className="d-flex w-100 justify-content-center">{p.price + " €"}</ListGroup.Item>
                                        <ListGroup.Item variant="primary" className="d-flex w-100 justify-content-center">
                                            {(props.clock && ((props.clock.day() === 1 && props.clock.hour() >= 9) || (props.clock.day() >= 2 && props.clock.day() <= 5) || (props.clock.day() === 6 && props.clock.hour() < 9))) ?
                                                <Button variant="warning" onClick={() => { setModal('modify'); handleModify(p.id); }}><PencilSquare /></Button>
                                                :
                                                <Button variant="light" ><PencilSquare /></Button>
                                            }
                                        </ListGroup.Item>
                                        <ListGroup.Item variant="primary" className="d-flex w-100 justify-content-center">
                                            {(props.clock && !((props.clock.day() === 1 && props.clock.hour() >= 9) || (props.clock.day() >= 2 && props.clock.day() <= 5) || (props.clock.day() === 6 && props.clock.hour() < 9))) ?
                                                <Button variant="success" onClick={() => handleConfirm(p.id)}><CheckSquare /></Button>
                                                :
                                                <Button variant="light" ><CheckSquare /></Button>
                                            }
                                        </ListGroup.Item>
                                    </ListGroup>
                                );
                            })
                        }

                    </>
                }

                <MyModal show={show} setReqUpdate={setReqUpdate} setShow={setShow} product={product} modal={modal} setProduct={setProduct} />
            </Container>

        </>
    );
}

function MyModal(props) {

    const [name, setName] = useState();
    const [quantity, setQuantity] = useState();
    const [unit, setUnit] = useState();

    useEffect(() => {
        if (props.modal === 'modify') {
            setName(props.product && props.product.name);
            setQuantity(props.product && props.product.quantity);
            setUnit(props.product && props.product.unit);
        }
    }, [props.modal, props.product]);

    const handleClose = () => {
        props.setProduct();
        props.setShow(false);
    }

    const handleSubmit = () => {
        if (props.modal === 'modify') {
            API.updateProduct({id: props.product.id, name: name, quantity: quantity, unit: unit}, { confirm: true }).then((r) => {
                if (r.error === undefined) {
                    props.setReqUpdate(true);
                }
            }).catch((err) => {
                console.log(err);
            });
        }
        else{
            API.createProduct({name: name, quantity: quantity, unit: unit}).then((r) => {
                if (r.error === undefined) {
                    props.setReqUpdate(true);
                }
            }).catch((err) => {
                console.log(err);
            });
        }
        props.setShow(false);
    }

    const handleDelete = () => {
        API.deleteProduct(props.product.id).then((p) => {
            if (p.error === undefined) {
                props.setReqUpdate(true);
            }
        }).catch((err) => {
            console.log(err);
        });
        props.setShow(false);
    }

    return (
        <Modal
            {...props}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header>
                {props.modal === 'modify' &&
                    <Modal.Title>
                        Modify product {props.product ? props.product.name : ""}
                    </Modal.Title>
                }
                {props.modal === 'add' &&
                    <Modal.Title>
                        Add product
                    </Modal.Title>
                }
            </Modal.Header>
            <Modal.Body>
                <Form className="">
                    <Row>
                        <Col>
                            <Form.Group controlId="name">
                                <Form.Label className="text-info w-100"><h5>Name</h5></Form.Label>
                                <Form.Control
                                    className="w-100 p-3"
                                    type="name"
                                    placeholder="Name"
                                    required
                                    onChange={(ev) => { setName(ev.target.value); }}
                                    value={name ? name : ""}
                                />
                                <Form.Text className="text-muted"></Form.Text>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="quantity">
                                <Form.Label className="text-info w-100"><h5>Quantity</h5></Form.Label>
                                <Form.Control
                                    className="w-100 p-3"
                                    type="number"
                                    placeholder="0"
                                    min={0}
                                    required
                                    onChange={(ev) => { setQuantity(ev.target.value); }}
                                    value={quantity ? quantity : ""}
                                />
                                <Form.Text className="text-muted"></Form.Text>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="unit">
                                <Form.Label className="text-info w-100"><h5>Unit</h5></Form.Label>
                                <Form.Control
                                    className="w-100 p-3"
                                    type="text"
                                    placeholder="Unit"
                                    required
                                    onChange={(ev) => { setUnit(ev.target.value); }}
                                    value={unit ? unit : ""}
                                />
                                <Form.Text className="text-muted"></Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {props.modal === 'modify' &&
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                }
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="success" onClick={handleSubmit}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default MyMyProducts;
