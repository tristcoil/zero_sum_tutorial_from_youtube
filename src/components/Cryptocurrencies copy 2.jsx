import React, { useEffect, useState } from 'react';
import millify from 'millify';
import { Link } from 'react-router-dom';
import { Table, Row, Col, Input } from 'antd';

import { useGetCryptosQuery } from '../services/cryptoApi';
import Loader from './Loader';

const Cryptocurrencies = ({ simplified }) => {
  const count = simplified ? 10 : 50;
  const { data: cryptosList, isFetching } = useGetCryptosQuery(count);
  const [cryptos, setCryptos] = useState();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setCryptos(cryptosList?.data?.coins);

    const filteredData = cryptosList?.data?.coins.filter((item) => item.name.toLowerCase().includes(searchTerm));

    setCryptos(filteredData);
  }, [cryptosList, searchTerm]);

  if (isFetching) return <Loader />;

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: 'Icon',
      dataIndex: 'iconUrl',
      key: 'iconUrl',
      render: (iconUrl) => <img src={iconUrl} alt="icon" style={{ width: '20px', height: '20px', marginLeft: '8px' }} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/crypto/${record.uuid}`}>{text}</Link>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `Price: ${millify(price)}`,
    },
    {
      title: 'Market Cap',
      dataIndex: 'marketCap',
      key: 'marketCap',
      render: (marketCap) => `Market Cap: ${millify(marketCap)}`,
    },
    {
      title: 'Daily Change',
      dataIndex: 'change',
      key: 'change',
      render: (change) => `Daily Change: ${change}%`,
    },
  ];

  return (
    <>
      {!simplified && (
        <div className="search-crypto">
          <Input
            placeholder="Search Cryptocurrency"
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
        </div>
      )}
      <Row>
        <Col span={24}>
          <Table
            dataSource={cryptos}
            columns={columns}
            rowKey={(record) => record.uuid}
            pagination={false}
          />
        </Col>
      </Row>
    </>
  );
};

export default Cryptocurrencies;
