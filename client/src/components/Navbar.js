import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import Download from './Download';
import rifleLogo from '../Rifle19Mask.png';
import {
  LockOpenIcon,
  LockClosedIcon,
  ArrowDownOnSquareIcon,
} from '@heroicons/react/24/outline';

import AuthService from '../utils/auth';

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const loggedIn = AuthService.loggedIn();

  // Retrieve logged in user information and setup state to update it
  const [userData, setUserData] = useState({});
  const { data: userdata } = useQuery(GET_ME, { skip: !loggedIn });

  useEffect(() => {
    const user = userdata?.me || {};
    setUserData(user);
  }, [userdata]);

  return (
    <>
      <Navbar collapseOnSelect expand="sm" bg="light" variant="light">
        <Container fluid className="justify-content-center">
          <Navbar.Brand
            className="text-center"
            style={{ color: 'black' }}
            href="/"
          >
            <div>
              <img alt="" src={rifleLogo} width="360" />
              <h1>Muzzleloader Range Log</h1>
              {loggedIn ? (
                <h2>
                  {userData[0]?.firstName} {userData[0]?.lastName}
                </h2>
              ) : (
                <h2>Please Log In</h2>
              )}
            </div>
            <Nav className="justify-content-center">
              {loggedIn ? (
                <>
                  <Nav.Link style={{ color: 'black' }} as={Link} to="/firearms">
                    Firearms
                  </Nav.Link>

                  <Nav.Link style={{ color: 'black' }} as={Link} to="/logs">
                    Logs
                  </Nav.Link>

                  <Nav.Link
                    style={{ color: 'black' }}
                    onClick={() => setShowDownload(true)}
                  >
                    <ArrowDownOnSquareIcon className="download-icon" />
                    Downloads
                  </Nav.Link>

                  <Nav.Link
                    style={{ color: 'black' }}
                    onClick={AuthService.logout}
                  >
                    <LockClosedIcon className="lock-icon" />
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link
                  style={{ color: 'black' }}
                  onClick={() => setShowModal(true)}
                >
                  <LockOpenIcon className="unlock-icon" />
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
                <Nav.Item componentClass="span">
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item componentClass="span">
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
      <Modal
        size="md"
        show={showDownload}
        onHide={() => setShowDownload(false)}
        aria-labelledby="signup-modal"
      >
        <Tab.Container defaultActiveKey="download">
          <Modal.Header className="border-bottom-0" closeButton>
            <Modal.Title id="download-modal">
              <h2 className="text-center">Download Log Data</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Download handleDownloadClose={() => setShowDownload(false)} />
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
