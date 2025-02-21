import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Schema di validazione per Node
const nodeSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    standard: yup.boolean(),
    latitude: yup.number().required("Latitude is required").min(-90).max(90),
    longitude: yup.number().required("Longitude is required").min(-180).max(180),
});

const NodeForm = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(nodeSchema),
    });

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <h3>Create Node</h3>

            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" {...register("name")} isInvalid={!!errors.name}/>
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Form.Check type="checkbox" label="Standard" {...register("standard")} />
            </Form.Group>

            <Form.Group>
                <Form.Label>Latitude</Form.Label>
                <Form.Control type="number" step="0.0001" {...register("latitude")} isInvalid={!!errors.latitude}/>
                <Form.Control.Feedback type="invalid">{errors.latitude?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Form.Label>Longitude</Form.Label>
                <Form.Control type="number" step="0.0001" {...register("longitude")} isInvalid={!!errors.longitude}/>
                <Form.Control.Feedback type="invalid">{errors.longitude?.message}</Form.Control.Feedback>
            </Form.Group>
            <br/>
            <Button type="submit">Create</Button>
        </Form>
    );
};



export default NodeForm;
