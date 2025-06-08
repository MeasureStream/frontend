import {useEffect, useState} from "react";
import {CuSettingDTO, MuSettingDTO} from "../API/interfaces";
import {useAuth} from "../API/AuthContext";
import {getCuSettingId, getMuSettingId, updateCuSettingId, updateMuSettingId} from "../API/SettingsAPI";
import {Button, Form, Modal} from "react-bootstrap";

export function AddMuSettings({ muNetworkId }: { muNetworkId:number }) {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<MuSettingDTO>({
        networkId: muNetworkId,
        gateway: undefined,
        cu: undefined,
       samplingFrequency: 0
    });
    const [dirty, setDirty] = useState(true)
    const [isCooldown, setIsCooldown] = useState(false);
    const {xsrfToken} = useAuth()

    useEffect(() => {
        const fetchSettings = async () => {
            if(dirty) {
                const musetting = await getMuSettingId(muNetworkId)
                setForm(musetting)
                setDirty(false)
            }
        }
        fetchSettings()
    }, [dirty]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
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
        updateMuSettingId(form, xsrfToken!! ).then(() => {
            handleClose()
            setDirty(true)
            setIsCooldown(true); // Start cooldown
            setTimeout(() => {
                setIsCooldown(false)
                setDirty(true)
            },  60 * 1000); // 2 minutes

            }
        )

    };

    return (
        <>
            <Button variant="success" onClick={handleShow}>Set MU Settings</Button>
            { form.gateway == undefined ?
                "  WARNING THIS MU IS OFFLINE  🔴"
                :
                "  ONLINE  🟢"
            }
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Measurement Unit Settings</Modal.Title>
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
                            <Form.Label>Gateway</Form.Label>
                            <Form.Control
                                type="number"
                                name="gateway"
                                value={form.gateway}
                                onChange={handleChange}
                                disabled={false}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>CU</Form.Label>
                            <Form.Control
                                type="number"
                                name="CU"
                                value={form.cu}
                                //onChange={handleChange}
                                disabled={true}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Sampling Frequency</Form.Label>
                            <Form.Control
                                type="number"
                                name="samplingFrequency"
                                value={form.samplingFrequency}
                                onChange={handleChange}
                            />
                        </Form.Group>




                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}  disabled={isCooldown} >
                        {isCooldown ? "Wait 2 minutes..." : "Confirm Add"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
