import React from 'react';
import './LoginPage.scss';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export function LoginPage() {
  const [fields, setFields] = React.useState({
    username: {
      value: '',
      error: ''
    },
    password: {
      value: '',
      error: ''
    },
    repeatPassword: {
      value: '',
      error: ''
    }
  })

  function handleChange(event) {
    const { value, name } = event.target;
    setFields((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value: value,
      },
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    let passwordMatch = false;
    if (fields.password.value !== fields.repeatPassword.value) {
      setFields((prevState) => ({
        ...prevState,
        repeatPassword: {
          ...prevState.repeatPassword,
          error: "Пароли не совпадают",
        }}))
    } else {
      passwordMatch = true;
    }
    if (passwordMatch) {
      fetch(`https://front-test.hex.team/api/register?username=${fields.username.value}&password=${fields.password.value}`,{
        headers: {
          'accept': 'application/json',
        },
        method: 'POST',
      })
        .then((response) => {
          if (response.status === 400) {
            return response.json().then((data) => alert(data.detail))
          } else {
            console.log("go to login page");
          }
        })
    }
  }

  function handleFocus(){
    setFields((prevState) => ({
      ...prevState,
      repeatPassword: {
        ...prevState.repeatPassword,
        error: ''
      },
    }))
  }
  return(
    <div className="login">
      <p className="login-text">Зарегистрируйтесь, чтобы получить доступ к сервису</p>
      <Form className="form" onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" >
          <Form.Label column sm="4">Логин</Form.Label>
          <Col sm="8">
            <Form.Control
              onChange={handleChange}
              name="username" type="text"
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
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="4">Повторите пароль</Form.Label>
          <Col sm="8">
            <Form.Control
              onChange={handleChange}
              name="repeatPassword"
              type="password"
              placeholder="Повторите пароль"
              isInvalid={fields.repeatPassword.error}
              onFocus={handleFocus}
              required
            />
            <Form.Control.Feedback type="invalid">{fields.repeatPassword.error}</Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Button
          variant="primary"
          type="Submit"
        >
          Зарегистрироваться
        </Button>
      </Form>
    </div>
  )
}