import React from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export function LoginPage() {
  const navigate = useNavigate();


  const [fields, setFields] = React.useState({
    username: '',
    password: '',
  })

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch('https://front-test.hex.team/api/login', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: fields.username,
        password: fields.password,
      })
    })
      .then((response) => {
        if (response.status === 400) {
          return response.json().then((data) => {
            alert(data.detail)
          })
        } else if (response.status === 200) {
          return response.json().then((data) => {
            localStorage.setItem("access_token", data.access_token);
            navigate('/statistics')
          })
        }
      })
  }
  console.log(fields);
  return(
    <div className="login">
      <p className="login-text">Войдите, чтобы получить доступ к сервису</p>
      <Form className="form" onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" >
          <Form.Label column sm="4">Логин</Form.Label>
          <Col sm="8">
            <Form.Control
              onChange={handleChange}
              name="username"
              type="text"
              placeholder="Логин"
              required
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="4">Пароль</Form.Label>
          <Col sm="8">
            <Form.Control
              onChange={handleChange}
              name="password"
              type="password"
              placeholder="Пароль"
              required/>
          </Col>
        </Form.Group>
        <Button
          variant="primary"
          type="Submit"
        >
          Войти
        </Button>
      </Form>
    </div>

  )
}