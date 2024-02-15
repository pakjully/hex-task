import React, { useState} from 'react';
import './RegisterPage.scss';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
  repeatPassword: [validateRequireness, validateLength],
}

export function RegisterPage() {
  const [fields, setFields] = useState({
    username: '',
    password: '',
    repeatPassword: '',
  })
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    repeatPassword: '',
  })

  const [ isRequestSent, setIsRequestSent ] = useState(false);

  const navigate = useNavigate();

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

  function handleChange(event) {
    const { value, name } = event.target;
    setFields((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (fields.password !== fields.repeatPassword) {
      setErrors((prevState) => ({
        ...prevState,
        repeatPassword: "Пароли не совпадают",
      }))
      return;
    }
    setIsRequestSent(true);
    fetch(`https://front-test.hex.team/api/register?username=${fields.username}&password=${fields.password}`,{
      headers: {
        'accept': 'application/json',
      },
      method: 'POST',
    })
      .then((response) => {
        if (response.status === 400) {
          return response.json().then((data) => alert(data.detail))
        } else {
          navigate('/login');
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
    validateField(name)
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
              name="username"
              type="text"
              placeholder="Логин"
              onBlur={handleBlur}
              onFocus={handleFocus}
              isInvalid={errors.username}
              required
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
              onBlur={handleBlur}
              onFocus={handleFocus}
              isInvalid={errors.password}
              required/>
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
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
              isInvalid={errors.repeatPassword}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.repeatPassword}</Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Col sm="4"></Col>
          <Col sm="8" className="login-link">
            <Button
              variant="primary"
              type="Submit"
              disabled={fields.password.length < 6 || fields.repeatPassword.length < 6 || fields.username === '' || isRequestSent}
            >
          Зарегистрироваться
            </Button>
            <Link className ="link"  to='/login'>Войти</Link>
          </Col>
        </Form.Group>
      </Form>
    </div>
  )
}