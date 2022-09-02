import React, { useState } from 'react';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';

import Auth from '../utils/auth';

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
        <Container fluid className="justify-content-center">
          <Navbar.Brand style={{ color: 'black' }} href="/">
            <img
              alt=""
              src="../../assets/images/Rifle19Mask.png"
              width="350"
              className="text-center"
            />
            <h1 className="text-center">Muzzleloader Range Log</h1>
            <Nav className="justify-content-center">
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link style={{ color: 'black' }} as={Link} to="/firearm">
                    Firearm
                  </Nav.Link>
                  <Nav.Link style={{ color: 'black' }} as={Link} to="/logs">
                    Log
                  </Nav.Link>
                  <Nav.Link style={{ color: 'black' }} onClick={Auth.logout}>
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link
                  style={{ color: 'black' }}
                  onClick={() => setShowModal(true)}
                >
                  Login/SignUp
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Modal
        size="md"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        <Tab.Container defaultActiveKey="login">
          <Modal.Header className="border-bottom-0" closeButton>
            <Modal.Title id="signup-modal">
              <Nav fill variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">SignUp</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <Login handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignUp handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
