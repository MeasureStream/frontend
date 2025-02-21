import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Schema di validazione per ControlUnit
const controlUnitSchema = yup.object().shape({
    networkId: yup.number().required("Network ID is required").positive(),
    name: yup.string().required("Name is required"),

    nodeId: yup.number().nullable().transform((_, val) => (val ? Number(val) : null)),
});



const ControlUnitForm = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(controlUnitSchema),
    });

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <h3>Create Control Unit</h3>
            <Form.Group>
                <Form.Label>Network ID</Form.Label>
                <Form.Control type="number" {...register("networkId")} isInvalid={!!errors.networkId} />
                <Form.Control.Feedback type="invalid">{errors.networkId?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" {...register("name")} isInvalid={!!errors.name} />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </Form.Group>


            <Form.Group>
                <Form.Label>Node ID (optional)</Form.Label>
                <Form.Control type="number" {...register("nodeId")} />
            </Form.Group>
            <br/>
            <Button type="submit">Create</Button>
        </Form>
    );
};




export default ControlUnitForm;
