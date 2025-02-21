import { Form, Button} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const measurementUnitSchema = yup.object().shape({
    type: yup.string().required("Type is required"),
    measuresUnit: yup.string().required("Measure unit is required"),
    networkId: yup.number().required("Network ID is required").positive(),
    idDcc: yup.number().required("ID DCC is required").positive(),
    nodeId: yup.number().nullable().transform((_, val) => (val ? Number(val) : null)),
});

const MeasurementUnitForm = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(measurementUnitSchema),
    });

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <h3>Create Measurement Unit</h3>
            <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Control type="text" {...register("type")} isInvalid={!!errors.type}/>
                <Form.Control.Feedback type="invalid">{errors.type?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Form.Label>Measure Unit</Form.Label>
                <Form.Control type="text" {...register("measuresUnit")} isInvalid={!!errors.measuresUnit}/>
                <Form.Control.Feedback type="invalid">{errors.measuresUnit?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Form.Label>Network ID</Form.Label>
                <Form.Control type="number" {...register("networkId")} isInvalid={!!errors.networkId}/>
                <Form.Control.Feedback type="invalid">{errors.networkId?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Form.Label>ID DCC</Form.Label>
                <Form.Control type="number" {...register("idDcc")} isInvalid={!!errors.idDcc}/>
                <Form.Control.Feedback type="invalid">{errors.idDcc?.message}</Form.Control.Feedback>
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

export default MeasurementUnitForm