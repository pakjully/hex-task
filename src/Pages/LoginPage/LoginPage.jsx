import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './LoginPage.scss';

function validateRequireness(value) {
  const error = value === '' ? 'Поле является обязательным' : '';
  return error;
}

function validateLength(value) {
  const error = value.length < 6 ? "Минимальная длина 6 символов" : '';
  return error;
}

const validators = {
  username: [validateRequireness],
  password: [validateRequireness, validateLength],
}

export function LoginPage() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  })
  const [ isRequestSent, setIsRequestSent ] = useState(false);

  function validateField(name) {
    const value = fields[name];
    const fieldValidators = validators[name] ?? [];
    const isFieldInvalid = fieldValidators.some((validator) => {
      const validationResult = validator(value);
      if (validationResult) {
        setErrors((prevData) => ({
          ...prevData,
          [name]: validationResult,
        }));
      }
      return Boolean(validationResult);
    });
    return isFieldInvalid;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsRequestSent(true);
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
            navigate('/');
          })
        }
      })
      .finally(() => {
        setIsRequestSent(false);
      })
  }

  function handleFocus(e){
    const { name } = e.target
    setErrors((prevState) => ({
      ...prevState,
      [name]: '',
    }))
  }

  function handleBlur(e) {
    const { name } = e.target;
    validateField(name);
  }
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              isInvalid={errors.username}
            />
            <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              isInvalid={errors.password}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Col sm="4"></Col>
          <Col sm="8" className="login-link">
            <Button
              variant="primary"
              type="Submit"
              disabled={fields.username === '' || fields.password.length < 6 || isRequestSent}
            >
          Войти
            </Button>
            <Link className ="link"  to='/auth'>Зарегистрироваться</Link>
          </Col>
        </Form.Group>
      </Form>
    </div>

  )
}