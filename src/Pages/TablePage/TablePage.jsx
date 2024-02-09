import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TablePage.scss';
import { sortObject } from './SortObject';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MyTable } from './Table/MyTable';


export function TablePage() {
  const userToken = localStorage.getItem("access_token");
  const [longLink, setLongLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [data, setData] = useState([]);
  const [sortShort, setSortShort] = useState(sortObject.short.desc);
  const [sortTarget, setSortTarget] = useState(sortObject.target.desc);
  const [sortCounter, setSortCounter] = useState(sortObject.counter.desc);
  const [currentPage, setCurrentPage] = useState(1)
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [totalEntries, setTotalEntries] = useState('')
  const navigate = useNavigate();

  const pages = [];
  for (let number=1; number<=Math.ceil(totalEntries / limit);number++ ) {
    pages.push(number);
  }

  const handleSortTarget = useCallback(() => setSortTarget((prevState) => prevState === sortObject.target.desc ? sortObject.target.asc : sortObject.target.desc ))
  const handleSortShort = useCallback(() => setSortShort((prevState) => prevState === sortObject.short.desc ? sortObject.short.asc : sortObject.short.desc))
  const handleSortCounter = useCallback(() => setSortCounter((prevState) => prevState === sortObject.counter.desc ? sortObject.counter.asc : sortObject.counter.desc ))

  React.useEffect(() => {
    const sortTargetString = sortTarget ? `order=${sortTarget}` : '';
    const sortShortString = sortShort ? `order=${sortShort}` : '';
    const sortCounterString = sortCounter ? `order=${sortCounter}` : '';
    const offsetString = Number.isInteger(offset) ? `offset=${offset}` : '';
    const limitString = Number.isInteger(limit) ? `limit=${limit}` : '';
    const queryString = [sortTargetString, sortShortString, sortCounterString,offsetString,limitString].filter(Boolean).join('&');
    fetch(`https://front-test.hex.team/api/statistics?${queryString}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${userToken}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          navigate('/login');
        } else if (response.status === 200) {
          const totalEntries = ([...response.headers.entries()][2][1]);
          setTotalEntries(totalEntries);
          return response.json().then((data) => setData(data))
        }
      })
  }, [sortTarget, sortCounter, sortShort, offset, limit])

  function handlePageClick(page) {
    setCurrentPage(page);
    const pageOffset = limit * (page - 1);
    setOffset(pageOffset);
  }

  function handleChange(e) {
    const { value } = e.target;
    setLongLink(value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    fetch(`https://front-test.hex.team/api/squeeze?link=${longLink}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${userToken}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          alert('Ошибка сервера')
        } else if(response.status === 200) {
          return response.json().then((data) => {
            setShortLink(data.short)
          })
        }
      })
  }
  return(
    <div>
      <Form className="form" onSubmit={handleSubmit}>
        <Form.Group as={Row} >
          <Col sm={2}>
            <Form.Label>Ссылка</Form.Label>
          </Col>
          <Col sm={7}>
            <Form.Control
              onChange={handleChange}
              type="text"
              placeholder="Ссылка"
            />
          </Col>
          <Col sm={3}>
            <Button
              variant="primary"
              type="Submit"
            >
          Преобразовать
            </Button>
          </Col>
        </Form.Group>
        <Row>
          <Col sm={2}>
            <p className="text-result">Результат</p>
          </Col>
          <Col sm={10}>
            {shortLink &&
        <p className="link-result">https://front-test.hex.team/s/{shortLink}</p>
            }
          </Col>
        </Row>
        <p>Статистика</p>
        <MyTable
          data={data}
          sortShort={sortShort}
          sortTarget={sortTarget}
          sortCounter={sortCounter}
          handleSortTarget={handleSortTarget}
          handleSortShort={handleSortShort}
          handleSortCounter={handleSortCounter}
        />
        <p>Всего записей: {totalEntries}</p>
        <Pagination className="table-pagination">
          {pages.map((page) => {
            return <Pagination.Item onClick={() => handlePageClick(page)} active={currentPage === page} key={page}>{page}</Pagination.Item>
          })}
        </Pagination>
      </Form>
    </div>

  )
}