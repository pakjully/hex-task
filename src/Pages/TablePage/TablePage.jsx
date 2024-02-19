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

const queryParams = window.location.search.replace('?', '').split('&').map((query) => query.split('='));
const initialValues = queryParams.reduce((result, currentParam) => {
  const [ key, value ] = currentParam;
  return {
    ...result,
    [key]: value,
  }
}, {
  sortShort: sortObject.short.desc,
  sortTarget: sortObject.target.desc,
  sortCounter: sortObject.counter.desc,
  currentPage: 1,
})
const limit = 1;
export function TablePage() {
  const userToken = localStorage.getItem("access_token");
  const [longLink, setLongLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [data, setData] = useState([]);
  const [sortShort, setSortShort] = useState(initialValues.sortShort);
  const [sortTarget, setSortTarget] = useState(initialValues.sortTarget);
  const [sortCounter, setSortCounter] = useState(initialValues.sortCounter);
  const [currentPage, setCurrentPage] = useState(Number(initialValues.currentPage));
  const [offset, setOffset] = useState((Number(initialValues.currentPage)- 1) * limit);
  const [totalEntries, setTotalEntries] = useState('')
  const [ isRequestSent, setIsRequestSent ] = useState(false);
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
          const sortTargetString = sortTarget ? `sortTarget=${sortTarget}` : '';
          const sortShortString = sortShort ? `sortShort=${sortShort}` : '';
          const sortCounterString = sortCounter ? `sortCounter=${sortCounter}` : '';
          const currentPageString = currentPage ? `currentPage=${currentPage}` : '';
          const queryString = [sortTargetString, sortShortString, sortCounterString, currentPageString].filter(Boolean).join('&');
          window.history.pushState('newState', '', `${window.location.pathname}?${queryString}`);
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
    setIsRequestSent(true)
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
      .finally(() => {
        setIsRequestSent(false);
      })
  }

  function handleResultClick() {
    navigator.clipboard.writeText(`https://front-test.hex.team/s/${shortLink}`)
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
              disabled={isRequestSent}
            >
          Преобразовать
            </Button>
          </Col>
        </Form.Group>
        <Row>
          <Col sm={2}>
            <p className="text-result">Результат</p>
          </Col>
          <Col sm={7}>
            {shortLink &&
        <p className="link-result">https://front-test.hex.team/s/{shortLink}</p>
            }
          </Col>
          <Col sm={3}>
            {shortLink &&
             <Button className="copy-result"
               variant="secondary"
               onClick={handleResultClick}
             >
              Копировать
             </Button>
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