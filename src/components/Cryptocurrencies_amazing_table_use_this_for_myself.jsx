import React, { useEffect, useState } from 'react';
import millify from 'millify';
import { Link } from 'react-router-dom';
import { Table, Row, Col, Input } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

    {
      title: 'Sparkline',
      dataIndex: 'sparkline',
      key: 'sparkline',
      render: (sparkline) => {
        const data = sparkline.map((price, index) => ({ index, price }));
        return (
          <div style={{ width: '150px' }}>
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <Line type="linear" dataKey="price" stroke="#8884d8" dot={false} strokeWidth={2} />
                <XAxis dataKey="index" hide={true} />
                <YAxis domain={['dataMin', 'dataMax']} hide={true} />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      },
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
