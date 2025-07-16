import {useEffect, useState} from 'react';
import {Button, Modal, Form, InputGroup} from 'react-bootstrap';
import {CuSettingDTO} from "../API/interfaces";
import {getCuSettingId, updateCuSettingId} from "../API/SettingsAPI";
import {useAuth} from "../API/AuthContext";


export function AddCuSettings({ cuNetworkId }: { cuNetworkId:number }) {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<CuSettingDTO>({
        updateTxPower: 0,
        networkId: cuNetworkId,
        gateway: undefined,
        bandwidth: 125,
        codingRate: 5,
        spreadingFactor: 7,
        updateInterval: 1000,
        mus: [],
    });
    const [dirty, setDirty] = useState(true)
    const [isCooldown, setIsCooldown] = useState(false);
    const {xsrfToken} = useAuth()

    useEffect(() => {
        const fetchSettings = async () => {
            if(dirty) {
                const cusetting = await getCuSettingId(cuNetworkId)
                setForm(cusetting)
                setDirty(false)
            }
        }
        fetchSettings()
    }, [dirty]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;    // name and value's "name" must be equal
        setForm(prev => ({ ...prev, [name]: Number(value) }));
    };

    const handleMusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const array = e.target.value
            .split(',')
            .map(v => parseInt(v.trim(), 10))
            .filter(n => !isNaN(n));
        setForm(prev => ({ ...prev, mus: array }));
    };

    const handleConfirm = () => {
        //onAdd(form);
        updateCuSettingId(form, xsrfToken!! ).then(() => {
                handleClose()
                setDirty(true)
                setIsCooldown(true); // Start cooldown
                setTimeout(() => {
                    setDirty(true)
                    setIsCooldown(false)
                }, 60 * 1000); // 1 minutes
            }
        )
            .catch((e) => console.log("Error not added ", e));

    };

    return (
        <>
            <Button variant="success" onClick={handleShow}>Set CU Settings</Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Control Unit Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Network ID</Form.Label>
                            <Form.Control
                                type="number"
                                name="networkId"
                                value={form.networkId}
                                //onChange={handleChange}
                                disabled={true}
                            />
                        </Form.Group>



                        <Form.Group>
                            <Form.Label>Bandwidth</Form.Label>
                            <InputGroup>
                            <Form.Control
                                type="number"
                                name="bandwidth"
                                value={form.bandwidth}
                                onChange={handleChange}
                            />
                                <InputGroup.Text>Hz</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Coding Rate</Form.Label>
                            <Form.Control
                                type="number"
                                name="codingRate"
                                value={form.codingRate}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Spreading Factor</Form.Label>
                            <Form.Control
                                type="number"
                                name="spreadingFactor"
                                value={form.spreadingFactor}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Update Interval (ms)</Form.Label>
                            <Form.Control
                                type="number"
                                name="updateInterval"
                                value={form.updateInterval}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Transmitting power dBm</Form.Label>
                            <Form.Control
                                type="number"
                                name="updateTxPower"
                                value={form.updateTxPower}
                                onChange={handleChange}
                            />
                        </Form.Group>


                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirm} disabled={isCooldown}>
                        {isCooldown ? "Wait 2 minutes..." : "Confirm Add"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
