import React, { useState, useEffect } from "react";
import { Button, Col, Row, Modal, Form, FormControl, Container, Image, Badge } from "react-bootstrap";
import { Navigate } from 'react-router-dom';
import { useParams } from "react-router";
import './MyNavBar.css';
import API from "./API";
import MyOrders from "./MyOrders";
import minus from './minus-circle-solid2.png';
import plus from './minus-circle-solid.png';


function MySingleClient(props) {
    const [goBack, setGoBack] = useState(false);
    const [client, setClient] = useState([]);
    const [reqUpdate, setReqUpdate] = useState(true)
    const [showMod, setShowMod] = useState(false)
    const [text, setText] = useState()


    const { id } = useParams();

    useEffect(() => {
        if (reqUpdate) {
            API.loadClient(id).then((c) => {
                if (c.error === undefined) {
                    setClient(c);
                    setReqUpdate(false);
                }
            }).catch((err) => {
                console.log(err)
            });
        }
    }, [reqUpdate, id]);

    if (goBack) {
        return (<Navigate to={"/"+props.user.role+"/clients"}></Navigate>)
    }



    return (
        <>
            <Container className="bg-dark min-height-100 justify-content-center align-items-center below-nav mt-3" fluid>

                <Row className="m-0 p-4 pb-2">
                    <Col sm="2" className="m-0 p-0"><h2 className="text-white"><b>Name: </b></h2>
                    </Col>
                    <Col sm="4" className="m-0 p-0"><h2 className="text-white">{client.name}</h2>
                    </Col>
                </Row>
                <Row className="m-0 p-4 pt-0 pb-2">
                    <Col sm="2" className="m-0 p-0"><h2 className="text-white"><b>Surname: </b></h2>
                    </Col>
                    <Col sm="4" className="m-0 p-0"><h2 className="text-white">{client.surname}</h2>
                    </Col>
                </Row>
                <Row className="m-0 p-4 pt-0 pb-2">
                    <Col sm="2" className="m-0 p-0"><h2 className="text-white"><b>Email: </b></h2>
                    </Col>
                    <Col sm="4" className="m-0 p-0"><h2 className="text-white">{client.email}</h2>
                    </Col>
                </Row>
                <Row className="m-0 p-4 pt-0 pb-2">
                    <Col sm="2" className="m-0 p-0"><h2 className="text-white"><b>Role: </b></h2>
                    </Col>
                    <Col sm="4" className="m-0 p-0"><h2 className="text-white">{client.role}</h2>
                    </Col>
                </Row>
                <Row className="m-0 p-4 pt-0 pb-2">
                    <Col sm="2" className="m-0 p-0"><h2 className="text-white"><b>Wallet: </b></h2>
                    </Col>
                    <Col sm="2" className="m-0 p-0"><h2 className="text-white m-0 p-0">{client.wallet + " €"}</h2>
                    </Col>
                    <Col sm="1" className="m-0 p-0" fluid="true">
                        <Button className="bg-transparent border border-dark p-0 m-0 mt-0 mb-0" onClick={() => {setText("add");setShowMod(true)}}>
                            <Image src={plus} className="w-50 m-0 mt-0 mb-0 p-1 pb-0 pt-0" />
                        </Button>
                    </Col>
                    <Col sm="1" className="m-0 p-0" fluid="true">
                        <Button className="bg-transparent border border-dark p-0 m-0 mt-0 mb-0" onClick={() => {setText("subtract");setShowMod(true)}}>
                            <Image src={minus} className="w-50 m-0 mt-0 mb-0 p-1 pb-0 pt-0" />
                        </Button>
                    </Col>
                </Row>
                <hr className="text-white my-5" style={{
                    marginTop: '1rem',
                    marginBottom: '1rem',
                    border: '0',
                    borderTop: '2px solid rgba(0, 0, 0, 0.1)'
                }} />
                <h1 className="text-white">Orders</h1>
                {!reqUpdate && <MyOrders setUser={props.setUser} id={client.id}/>}
                <Row className="text-center justify-content-center p-0 pt-2 pb-5"><Button size="lg" className="btn-danger p-2 w-50 mt-3" onClick={() => setGoBack(true)}>Back</Button></Row>
                <MyModal show={showMod} setShow={setShowMod} id={id} wallet={client.wallet} setUpdate={setReqUpdate} text={text}></MyModal>
            </Container>

        </>
    );
}

function MyModal(props) {
    const [amount, setAmount] = useState("")
    const [trigger, setTrigger] = useState(false)
    const [error, setError] = useState()

    useEffect(() => {
        //insert survey with the list of questions
        const updateWallet = async () => {
            const response = await fetch('/api/clients/' + props.id + '/wallet', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(send_obj)
            });
            if (response.status === 500) {
                console.log(response.err);
            }
        }
        //set up the data to be send by the post
        let new_amount = 0
        if (props.text==="add"){
            new_amount = Number(props.wallet) + Number(amount)
        }
        else{
            new_amount = Number(props.wallet) - Number(amount)
        }
        let send_obj = { "wallet": new_amount }
        if (trigger) {
            if (new_amount<0){
                setError("The new amount would be negative!")

            }
            else if(amount < 0){
                setError("Cannot set a negative value")
            }  
            else{
                updateWallet()
                setAmount("")
                setTrigger(false)
                props.setShow(false)
                setError(undefined)
            }

        }
    }, [trigger, amount, props.id, props.wallet, props.text, props.setShow]);

    const handleAmount = (event) => { setAmount(event.target.value); };

    return (
        <Modal show={props.show} className="p-4">
            <Container className="bg-dark w-100 p-4">
                <h3 className="text-white text-left">Select the amount to {props.text}:</h3>
                <Form className="m-0 mt-3 mb-3">
                    <FormControl type="number" placeholder="€" value={amount} onChange={handleAmount}></FormControl>
                </Form>
                {
                    error?<Badge bg="danger" pill>{error}</Badge>:<></>
                }
                <Row className="p-3 pb-1">
                    <Col sm="5"><Button size="lg" variant="danger" className="p-auto m-0 w-100" onClick={() => { props.setShow(false); setAmount(""); setError(undefined) }}>Delete</Button></Col>
                    <Col sm="2"></Col>
                    <Col sm="5"><Button size="lg" variant="success" className="p-auto m-0 w-100" onClick={() => { setTrigger(true); setAmount(amount); props.setUpdate(true) }}>Confirm</Button></Col>

                </Row>
            </Container>
        </Modal>
    );
}


export default MySingleClient;
