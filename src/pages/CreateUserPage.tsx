import React, { useState } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';

const CreateUserPage: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        repeatPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
        repeatPassword: '',
        username: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = (): boolean => {
        let isValid = true;
        const errors: any = {};

        // Check if any field is empty
        Object.keys(formData).forEach((key) => {
            if (!formData[key as keyof typeof formData]) {
                errors[key] = `${key} cannot be empty`;
                isValid = false;
            }
        });

        // Validate email
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA0-9]{2,6}$/;
        if (!emailPattern.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Validate password complexity
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/; // At least 8 characters, 1 lowercase, 1 uppercase, 1 number
        if (!passwordPattern.test(formData.password)) {
            errors.password = 'Password must be at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number';
            isValid = false;
        }

        // Validate repeat password
        if (formData.password !== formData.repeatPassword) {
            errors.repeatPassword = 'Passwords do not match';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error while creating user');
            }

            setSuccess('User successfully created.');
            setFormData({
                username: '',
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                repeatPassword: '',
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '500px' }}>
            <h2 className="mb-4">Create New User</h2>

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        isInvalid={!!formErrors.username}
                        required
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.username}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!formErrors.email}
                        required
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="firstName" className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        isInvalid={!!formErrors.firstName}
                        required
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.firstName}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="lastName" className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        isInvalid={!!formErrors.lastName}
                        required
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.lastName}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!formErrors.password}
                        required
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="repeatPassword" className="mb-4">
                    <Form.Label>Repeat Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="repeatPassword"
                        value={formData.repeatPassword}
                        onChange={handleChange}
                        isInvalid={!!formErrors.repeatPassword}
                        required
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.repeatPassword}</Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" disabled={loading} className="w-100">
                    {loading ? (
                        <>
                            <Spinner size="sm" animation="border" /> Creating...
                        </>
                    ) : (
                        'Create User'
                    )}
                </Button>
            </Form>

            {success && <Alert variant="success" className="mt-3">{success}</Alert>}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Container>
    );
};

export default CreateUserPage;
