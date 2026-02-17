import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import API from '../../services/axios';

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [editingStaff, setEditingStaff] = useState(null);

    const loadStaff = async () => {
        const res = await API.get('/staff');
        setStaff(res.data);
    };

    useEffect(() => { loadStaff(); }, []);

    const createStaff = async (e) => {
        e.preventDefault();
        try {
            await API.post('/staff', form);
            loadStaff();
            setForm({ name:'', email:'', password:'' });
        } catch (err) { console.log(err); }
    };

    const toggleAccess = async (id) => {
        try {
            await API.patch(`/staff/toggle/${id}`);
            loadStaff();
        } catch (error) {
            console.log("Error in Denying Access :", error);
        }
    };

    const startEdit = (staff) => setEditingStaff(staff);

    const saveEdit = async () => {
        try {
            const { _id, name, email, password } = editingStaff;
            await API.put(`/staff/${_id}`, { name, email, password });
            setEditingStaff(null);
            loadStaff();
        } catch (error) {
            console.log("Error in edit", error);
        }
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
            paddingBottom: '10px'
        },
        title: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#2c3e50',
            margin: 0
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
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
        createButton: {
            backgroundColor: '#3498db',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '500',
            color: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            height: '36px'
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
            borderBottom: '1px solid #e9ecef'
        },
        statusBadge: {
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '500',
            display: 'inline-block'
        },
        activeBadge: {
            backgroundColor: '#d4edda',
            color: '#155724'
        },
        disabledBadge: {
            backgroundColor: '#f8d7da',
            color: '#721c24'
        },
        buttonGroup: {
            display: 'flex',
            gap: '6px',
            justifyContent: 'flex-start'
        },
        editButton: {
            backgroundColor: 'transparent',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: '500',
            color: '#856404',
            cursor: 'pointer',
            transition: 'all 0.2s',
            height: '26px'
        },
        toggleButton: (isActive) => ({
            backgroundColor: isActive ? '#dc3545' : '#28a745',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: '500',
            color: 'white',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            height: '26px'
        }),
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
            backgroundColor: '#3498db',
            color: 'white'
        },
        emptyState: {
            textAlign: 'center',
            padding: '24px',
            color: '#6c757d',
            fontSize: '13px'
        },
        modalInput: {
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '13px',
            outline: 'none',
            width: '100%',
            marginBottom: '12px',
            height: '34px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Staff Management</h1>
            </div>

            {/* Create Staff Form */}
            <div style={styles.formCard}>
                <h3 style={styles.subtitle}>Add New Staff</h3>
                <Form onSubmit={createStaff}>
                    <div style={styles.formRow}>
                        <Form.Control 
                            placeholder="Full name" 
                            value={form.name}
                            style={styles.formControl}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                        <Form.Control 
                            placeholder="Email address" 
                            type="email"
                            value={form.email}
                            style={styles.formControl}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                        <Form.Control 
                            placeholder="Password" 
                            type="password"
                            value={form.password}
                            style={styles.formControl}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                        />
                    </div>
                    <Button style={styles.createButton} type="submit">
                        + Create
                    </Button>
                </Form>
            </div>

            {/* Staff List Table */}
            <div style={styles.tableContainer}>
                <h3 style={{...styles.subtitle, marginTop: 0}}>Staff Members</h3>
                <Table bordered={false} style={styles.table} size="sm">
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Name</th>
                            <th style={styles.tableHeader}>Email</th>
                            <th style={styles.tableHeader}>Status</th>
                            <th style={styles.tableHeader}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(s => (
                            <tr key={s._id}>
                                <td style={styles.tableCell}>{s.name}</td>
                                <td style={styles.tableCell}>{s.email}</td>
                                <td style={styles.tableCell}>
                                    <span style={{
                                        ...styles.statusBadge,
                                        ...(s.isActive ? styles.activeBadge : styles.disabledBadge)
                                    }}>
                                        {s.isActive ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td style={styles.tableCell}>
                                    <div style={styles.buttonGroup}>
                                        <button 
                                            style={styles.editButton}
                                            onClick={() => startEdit(s)}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fff3cd'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            style={styles.toggleButton(s.isActive)}
                                            onClick={() => toggleAccess(s._id)}
                                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.85'}
                                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                        >
                                            {s.isActive ? 'Disable' : 'Enable'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                
                {staff.length === 0 && (
                    <div style={styles.emptyState}>
                        No staff members found
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Modal 
                show={!!editingStaff} 
                onHide={() => setEditingStaff(null)}
                centered
                size="sm"
            >
                <Modal.Header style={styles.modalHeader} closeButton>
                    <Modal.Title style={styles.modalTitle}>Edit Staff</Modal.Title>
                </Modal.Header>
                <Modal.Body style={styles.modalBody}>
                    <Form>
                        <input 
                            placeholder="Full name" 
                            value={editingStaff?.name || ''}
                            style={styles.modalInput}
                            onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })}
                        />
                        <input 
                            placeholder="Email address" 
                            type="email"
                            value={editingStaff?.email || ''}
                            style={styles.modalInput}
                            onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })}
                        />
                        <input 
                            placeholder="New password (optional)" 
                            type="password"
                            style={styles.modalInput}
                            onChange={e => setEditingStaff({ ...editingStaff, password: e.target.value })}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer style={styles.modalFooter}>
                    <button 
                        style={{...styles.modalButton, ...styles.cancelButton}}
                        onClick={() => setEditingStaff(null)}
                    >
                        Cancel
                    </button>
                    <button 
                        style={{...styles.modalButton, ...styles.saveButton}}
                        onClick={saveEdit}
                    >
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StaffManagement;