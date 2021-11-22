import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import MyLogin from "./MyLogin";
import MyEmployee from "./MyEmployee";
import API from "./API";
import MyNavBar from "./MyNavBar";
import MyClients from "./MyClients";
import MySingleClient from "./MySingleClient";
import MyProducts from "./MyProducts";
import MyForm from "./MyForm";
import MyOrders from "./MyOrders";
import MyNewProducts from "./MyNewProducts";
import MyFarmer from "./MyFarmer";
import MyMyProducts from "./MyMyProducts";
import MyClientPage from "./MyClientPage";
import MyClientProfile from './MyClientProfile'

function MyContainer(props) {
    const [user, setUser] = useState();
    const [cart, setCart] = useState([]);

    const location = useLocation();

    //some comments

    // useEffect(() => {
    //   API.isLoggedIn()
    //     .then((response) => {
    //       if (response.error === undefined) {

    //         setUser(() => response);
    //       } else {
    //         setUser(() => undefined);
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }, []);

    useEffect(() => {
        API.isLoggedIn().then((response) => {
            if (response.error === undefined && response.role !== undefined) {
                setUser({ username: response.username, role: response.role, id: response.id });
            }
            else {
                setUser(() => undefined);
            }
        }).catch(err => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        if (user) {
            API.updateBasket(user.id, cart)
                .then((c) => {
                    // console.log(user.id)
                    if (c.error === undefined) {

                        //console.log("SUCCESSFUL");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [cart]);



    //getting the items from the user table and fill the state(cart)
    useEffect(() => {
        if (user) {
            API.loadClient(user.id)
                .then((c) => {
                    // console.log(user.id)
                    if (c.error === undefined) {
                        const json = c.basket;
                        const basket = JSON.parse(json);
                        //console.log(basket);
                        setCart([...basket]);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }

    }, [user]);

    if (!user && location.pathname !== '/login') {
        return (<Navigate to="/login" />);
    }

    return (
        <>
            <Routes>
                {/* Route to show the homepage */}
                <Route
                    path="/" exact
                    element={
                        <>
                            <Navigate to="/login" />
                        </>
                    }
                />
                <Route
                    path="/client"
                    element={
                        <>
                            <MyNavBar setUser={setUser} cart={cart} setCart={setCart} showCart={true}></MyNavBar>
                            <MyClientPage />

                        </>
                    }
                />
                <Route
                    path="/client/profile"
                    element={
                        <>
                            <MyNavBar setUser={setUser} cart={cart} setCart={setCart} showCart={true}></MyNavBar>
                            <MyClientProfile user={user} id={user ? user.id : undefined} />
                        </>
                    }
                />
                <Route
                    path="/farmer" exact
                    element={
                        <>
                            <MyNavBar setUser={setUser} cart={cart} setCart={setCart} showCart={true}></MyNavBar>
                            <MyFarmer user={user} />
                        </>
                    }
                />
                <Route
                    path="/farmer/products"
                    element={
                        <>
                            <MyNavBar setUser={setUser} cart={cart} setCart={setCart} showCart={true}></MyNavBar>
                            <MyProducts user={user} cart={cart} setCart={setCart} showCart={true} />
                        </>
                    }
                />
                <Route
                    path="/farmer/myProducts"
                    element={
                        <>
                            <MyNavBar setUser={setUser} cart={cart} setCart={setCart} showCart={true}></MyNavBar>
                            <MyMyProducts user={user} cart={cart} setCart={setCart} showCart={true} />
                        </>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <>
                            <MyNavBar setUser={setUser} cart={cart} setCart={setCart} showCart={false}></MyNavBar>
                            <MyLogin user={user} setUser={setUser} />
                        </>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <>
                            <MyNavBar setUser={setUser} cart={cart} setCart={setCart} showCart={false}></MyNavBar>
                            <MyForm user={user} setUser={setUser} />
                        </>
                    }
                />
                <Route
                    path="/employee" exact
                    element={
                        <>
                            <MyNavBar setUser={setUser} cart={cart} setCart={setCart} showCart={true}></MyNavBar>
                            <MyEmployee user={user}></MyEmployee>
                        </>
                    }
                />
                <Route
                    path="/employee/clients/:id"
                    element={
                        <>
                            <MyNavBar setUser={setUser} cart={cart} setCart={setCart} showCart={true}></MyNavBar>
                            <MySingleClient user={user}></MySingleClient>
                        </>
                    }
                />
                <Route
                    path="/employee/orders"
                    element={
                        <>
                            <MyNavBar setUser={setUser} cart={cart} setCart={setCart} showCart={true}></MyNavBar>
                            <MyOrders user={user}></MyOrders>
                        </>
                    }
                />
                <Route
                    path="/employee/clients" exact
                    element={
                        <>
                            <MyNavBar setUser={setUser} cart={cart} setCart={setCart} showCart={true}></MyNavBar>
                            <MyClients></MyClients>
                        </>
                    }
                />
                <Route
                    path="/client/products"
                    element={
                        <>
                            <MyNavBar cart={cart} setCart={setCart} showCart={true} setUser={setUser}></MyNavBar>
                            <MyProducts user={user} cart={cart} setCart={setCart} showCart={true} ></MyProducts>
                        </>
                    }
                />

                <Route
                    path="/employee/products"
                    element={
                        <>
                            <MyNavBar cart={cart} setCart={setCart} showCart={true} setUser={setUser}></MyNavBar>
                            <MyProducts user={user} cart={cart} setCart={setCart} showCart={true} ></MyProducts>
                        </>
                    }
                />
                <Route
                    path="/manager"
                    element={
                        <>

                        </>
                    }
                />
                <Route
                    path="/employee/form"
                    element={
                        <>
                            <MyNavBar cart={cart} setCart={setCart} showCart={false} setUser={setUser}></MyNavBar>
                            <MyForm user={user} />
                        </>
                    }
                />

                {/* just for testing */}
                <Route
                    path="/newProducts"
                    element={
                        <>
                            <MyNavBar cart={cart} setCart={setCart} setUser={setUser}></MyNavBar>

                            <MyNewProducts user={user} />
                        </>
                    }
                />
            </Routes>
        </>
    );
}

export default MyContainer;
