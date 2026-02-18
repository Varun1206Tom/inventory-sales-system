import React from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AppNavbar = () => {

    const navigate = useNavigate();
    const accessToken = localStorage.getItem('token');
    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const login = () => {
        navigate('/login')
    }

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>Inventory & Sales System</Navbar.Brand>

                    {accessToken ? (
                        <Nav>
                            <Button variant="outline-light" onClick={logout}>
                                Logout
                            </Button>
                        </Nav>
                    ) : (
                        <Nav>
                            <Button variant="outline-light" onClick={login}>
                                Login
                            </Button>
                        </Nav>
                    )}

                </Container>
            </Navbar>
        </div>
    )
}

export default AppNavbar