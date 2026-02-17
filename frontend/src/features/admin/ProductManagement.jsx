import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Badge, Modal } from 'react-bootstrap';
import API from '../../services/axios';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [form, setForm] = useState({ name: '', price: '', stock: '' });
    const [editForm, setEditForm] = useState({ name: '', price: '', stock: '' });
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const loadProducts = async () => {
        const res = await API.get('/products');
        setProducts(res.data);
    };

    const loadLowStock = async () => {
        const res = await API.get('/products/low-stock');
        setLowStock(res.data);
    };

    useEffect(() => {
        loadProducts();
        loadLowStock();
    }, []);

    const addProduct = async (e) => {
        e.preventDefault();
        try {
            await API.post('/products', form);
            setForm({ name: '', price: '', stock: '' });
            loadProducts();
            loadLowStock();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setEditForm({
            name: product.name,
            price: product.price,
            stock: product.stock,
        });
        setShowModal(true);
    };

    const updateProduct = async () => {
        try {
            await API.put(`/products/${editingProduct._id}`, editForm);
            setShowModal(false);
            setEditingProduct(null);
            loadProducts();
            loadLowStock();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteProduct = async (id) => {
        await API.delete(`/products/${id}`);
        loadProducts();
        loadLowStock();
    };

    const styles = {
        container: {
            padding: '16px',
            maxWidth: '1000px',
            margin: '0 auto',
            backgroundColor: '#f8f9fa',
            minHeight: '100vh',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        header: {
            marginBottom: '20px',
            borderBottom: '1px solid #e9ecef',
            paddingBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        title: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#2c3e50',
            margin: 0
        },
        alertBadge: {
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            marginLeft: '8px'
        },
        alertContainer: {
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeeba',
            borderRadius: '6px',
            padding: '10px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        alertIcon: {
            fontSize: '18px'
        },
        alertText: {
            fontSize: '13px',
            fontWeight: '500',
            color: '#856404',
            margin: 0,
            flex: 1
        },
        subtitle: {
            fontSize: '15px',
            fontWeight: '500',
            color: '#34495e',
            marginBottom: '12px'
        },
        formCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        },
        formRow: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '10px',
            marginBottom: '12px'
        },
        formControl: {
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '13px',
            transition: 'border-color 0.2s',
            outline: 'none',
            height: '36px'
        },
        addButton: {
            backgroundColor: '#28a745',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '500',
            color: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            height: '36px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
        },
        tableContainer: {
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            overflowX: 'auto'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px'
        },
        tableHeader: {
            backgroundColor: '#f8f9fa',
            padding: '10px 12px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#495057',
            textAlign: 'left',
            borderBottom: '1px solid #dee2e6',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
        },
        tableCell: {
            padding: '10px 12px',
            fontSize: '13px',
            color: '#2c3e50',
            borderBottom: '1px solid #e9ecef',
            verticalAlign: 'middle'
        },
        stockBadge: {
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '500',
            display: 'inline-block'
        },
        dangerBadge: {
            backgroundColor: '#dc3545',
            color: 'white'
        },
        normalStock: {
            color: '#28a745',
            fontWeight: '500'
        },
        buttonGroup: {
            display: 'flex',
            gap: '6px'
        },
        editButton: {
            backgroundColor: '#ffc107',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: '500',
            color: '#212529',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            height: '26px'
        },
        deleteButton: {
            backgroundColor: '#dc3545',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: '500',
            color: 'white',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            height: '26px'
        },
        modalHeader: {
            borderBottom: '1px solid #e9ecef',
            padding: '12px 16px'
        },
        modalTitle: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#2c3e50'
        },
        modalBody: {
            padding: '16px'
        },
        modalFooter: {
            borderTop: '1px solid #e9ecef',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px'
        },
        modalButton: {
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            border: 'none',
            transition: 'opacity 0.2s',
            height: '32px'
        },
        cancelButton: {
            backgroundColor: '#6c757d',
            color: 'white'
        },
        saveButton: {
            backgroundColor: '#28a745',
            color: 'white'
        },
        formLabel: {
            fontSize: '12px',
            fontWeight: '500',
            color: '#495057',
            marginBottom: '4px',
            display: 'block'
        },
        modalInput: {
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '13px',
            outline: 'none',
            width: '100%',
            height: '34px'
        },
        emptyState: {
            textAlign: 'center',
            padding: '32px',
            color: '#6c757d',
            fontSize: '13px'
        },
        priceCell: {
            fontWeight: '500',
            color: '#2c3e50'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Product Management</h1>
                {lowStock.length > 0 && (
                    <span style={styles.alertBadge}>
                        {lowStock.length} low stock
                    </span>
                )}
            </div>

            {/* Low Stock Alert */}
            {lowStock.length > 0 && (
                <div style={styles.alertContainer}>
                    <span style={styles.alertIcon}>⚠️</span>
                    <p style={styles.alertText}>
                        {lowStock.length} product{lowStock.length > 1 ? 's are' : ' is'} running low on stock
                    </p>
                    <Badge bg="danger" style={{ fontSize: '11px' }}>
                        {lowStock.length}
                    </Badge>
                </div>
            )}

            {/* Add Product Form */}
            <div style={styles.formCard}>
                <h3 style={styles.subtitle}>Add New Product</h3>
                <Form onSubmit={addProduct}>
                    <div style={styles.formRow}>
                        <Form.Control
                            placeholder="Product name"
                            value={form.name}
                            style={styles.formControl}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <Form.Control
                            placeholder="Price (₹)"
                            type="number"
                            value={form.price}
                            style={styles.formControl}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            required
                        />
                        <Form.Control
                            placeholder="Stock quantity"
                            type="number"
                            value={form.stock}
                            style={styles.formControl}
                            onChange={(e) => setForm({ ...form, stock: e.target.value })}
                            required
                        />
                    </div>
                    <Button style={styles.addButton} type="submit">
                        + Add Product
                    </Button>
                </Form>
            </div>

            {/* Products Table */}
            <div style={styles.tableContainer}>
                <h3 style={{...styles.subtitle, marginTop: 0}}>Product Inventory</h3>
                <Table bordered={false} style={styles.table} size="sm">
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Product Name</th>
                            <th style={styles.tableHeader}>Price</th>
                            <th style={styles.tableHeader}>Stock</th>
                            <th style={styles.tableHeader}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p._id}>
                                <td style={styles.tableCell}>{p.name}</td>
                                <td style={{...styles.tableCell, ...styles.priceCell}}>
                                    ₹{Number(p.price).toLocaleString()}
                                </td>
                                <td style={styles.tableCell}>
                                    {p.stock <= 5 ? (
                                        <span style={{...styles.stockBadge, ...styles.dangerBadge}}>
                                            {p.stock}
                                        </span>
                                    ) : (
                                        <span style={styles.normalStock}>{p.stock}</span>
                                    )}
                                </td>
                                <td style={styles.tableCell}>
                                    <div style={styles.buttonGroup}>
                                        <button 
                                            style={styles.editButton}
                                            onClick={() => handleEditClick(p)}
                                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.85'}
                                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            style={styles.deleteButton}
                                            onClick={() => deleteProduct(p._id)}
                                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.85'}
                                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                
                {products.length === 0 && (
                    <div style={styles.emptyState}>
                        No products found. Add your first product above.
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Modal 
                show={showModal} 
                onHide={() => setShowModal(false)} 
                centered
                size="sm"
            >
                <Modal.Header style={styles.modalHeader} closeButton>
                    <Modal.Title style={styles.modalTitle}>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body style={styles.modalBody}>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label style={styles.formLabel}>Product Name</Form.Label>
                            <input
                                type="text"
                                value={editForm.name}
                                style={styles.modalInput}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label style={styles.formLabel}>Price (₹)</Form.Label>
                            <input
                                type="number"
                                value={editForm.price}
                                style={styles.modalInput}
                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={styles.formLabel}>Stock Quantity</Form.Label>
                            <input
                                type="number"
                                value={editForm.stock}
                                style={styles.modalInput}
                                onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={styles.modalFooter}>
                    <button 
                        style={{...styles.modalButton, ...styles.cancelButton}}
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </button>
                    <button 
                        style={{...styles.modalButton, ...styles.saveButton}}
                        onClick={updateProduct}
                    >
                        Save Changes
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductManagement;