import React from 'react';
import { Table } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { sortObject } from '../SortObject';

export function MyTable(props) {
  const {
    sortTarget,
    sortShort,
    sortCounter,
    data,
    handleSortTarget,
    handleSortShort,
    handleSortCounter
  } = props;
  return(
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th
            onClick={handleSortTarget}
          >Оригинальная ссылка
            {sortTarget === sortObject.target.desc
              ? <FaArrowDown />
              :<FaArrowUp />
            }
          </th>
          <th onClick={handleSortShort}
          >
            Короткая ссылка
            {sortShort === sortObject.short.desc
              ? <FaArrowDown />
              :<FaArrowUp />
            }
          </th>
          <th onClick={handleSortCounter}
          >
          Счетчик
            {sortCounter === sortObject.counter.desc
              ? <FaArrowDown />
              :<FaArrowUp />
            }
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item,i) => {
          return <tr key={i}>
            <td>{item.id}</td>
            <td>{item.target}</td>
            <td>{item.short}</td>
            <td>{item.counter}</td>
          </tr>
        })}
      </tbody>
    </Table>
  )
}