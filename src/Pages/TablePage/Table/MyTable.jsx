import React from 'react';
import { Table } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { sortObject } from '../SortObject';

export function MyTable(props) {
  const { sortTarget, setSortTarget, sortShort, setSortShort, sortCounter, setSortCounter, data } = props;
  return(
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th
            onClick={() => setSortTarget((prevState) => prevState === sortObject.target.desc ? sortObject.target.asc : sortObject.target.desc )}
          >Оригинальная ссылка
            {sortTarget === sortObject.target.desc  ?
              <FaArrowDown /> :
              <FaArrowUp />
            }
          </th>
          <th onClick={() => setSortShort((prevState) => prevState === sortObject.short.desc ? sortObject.short.asc : sortObject.short.desc)}
          >
            Короткая ссылка
            {sortShort === sortObject.short.desc ?
              <FaArrowDown /> :
              <FaArrowUp />
            }
          </th>
          <th onClick={() => setSortCounter((prevState) => prevState === sortObject.counter.desc ? sortObject.counter.asc : sortObject.counter.desc )}
          >
          Счетчик
            {sortCounter=== sortObject.counter.desc ?
              <FaArrowDown /> :
              <FaArrowUp />
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