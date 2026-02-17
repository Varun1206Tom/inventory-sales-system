import React, { useState, useEffect } from 'react'
import API from '../../services/axios';
import { Button, Table } from 'react-bootstrap';

const SalesReport = () => {

    const [sales, setSales] = useState([]);

    const loadSales = async () => {
        const res = await API.get('/sales');
        setSales(res.data);
    };

    useEffect(() => {
        loadSales();
    }, []);

    const exportExcel = () => {
        window.open('http://localhost:5000/api/sales/csv');
    };

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h4>Sales Report</h4>

                <Button onClick={exportExcel}>
                    Export Excel
                </Button>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {sales.map((s, i) => (
                        <tr key={i}>
                            <td>{s.productName}</td>
                            <td>{s.quantity}</td>
                            <td>₹{s.total}</td>
                            <td>{new Date(s.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default SalesReport