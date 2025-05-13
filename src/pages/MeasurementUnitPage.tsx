import React, { useEffect, useState } from "react";
import { Table, Button, Form, Pagination, Container, Row, Col, InputGroup } from "react-bootstrap";
import {MeasurementUnitDTO} from "../API/interfaces";
import {DeleteMu, getAllMu} from "../API/MeasurementUnitAPI";
import {DeleteMUModal, RemoveMU} from "../components/MUsModals";





const ITEMS_PER_PAGE = 10;

const MeasurementUnitsPage: React.FC = () => {
    const [mus, setMus] = useState<MeasurementUnitDTO[]>([]);
    const [filteredMus, setFilteredMus] = useState<MeasurementUnitDTO[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [filterType, setFilterType] = useState("");
    const [filterNetworkId, setFilterNetworkId] = useState("");
    const [dirty, setDirty] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            if(dirty){
                const page = currentPage - 1
                const size = ITEMS_PER_PAGE
                const data = await getAllMu(page, size );
                setMus(data);
                setFilteredMus(data);
                setCurrentPage(1);
                setDirty(false)
            }
        }


        fetchData();

    }, [dirty]);

    const handleDelete = (id: number) => {
        const updatedMus = mus.filter((mu) => mu.id !== id);
        setMus(updatedMus);
        applyFilters(updatedMus);
    };

    const applyFilters = (data: MeasurementUnitDTO[]) => {
        let filtered = data;
        if (filterType) {
            filtered = filtered.filter((mu) =>
                mu.type.toLowerCase().includes(filterType.toLowerCase())
            );
        }
        if (filterNetworkId) {
            filtered = filtered.filter((mu) =>
                mu.networkId.toString().includes(filterNetworkId)
            );
        }
        setFilteredMus(filtered);
        setCurrentPage(1);
    };

    const handleFilterChange = () => {
        applyFilters(mus);
    };

    const paginatedData = filteredMus.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(filteredMus.length / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <Container>
            <h2 className="mt-4">Measurement Units</h2>

            <Form onSubmit={(e) => { e.preventDefault(); handleFilterChange(); }}>
                <Row className="my-3">
                    <Col md={4}>
                        <InputGroup>
                            <InputGroup.Text>Type</InputGroup.Text>
                            <Form.Control
                                type="text"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={4}>
                        <InputGroup>
                            <InputGroup.Text>Network ID</InputGroup.Text>
                            <Form.Control
                                type="text"
                                value={filterNetworkId}
                                onChange={(e) => setFilterNetworkId(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md="auto" className="d-flex align-items-center gap-2">
                        <Button variant="primary" type="submit">
                            Filter
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setFilterType("");
                                setFilterNetworkId("");
                                setFilteredMus(mus);
                                setCurrentPage(1);
                            }}
                        >
                            Reset
                        </Button>
                    </Col>
                </Row>
            </Form>


            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Network ID</th>
                    <th>Type</th>
                    <th>Unit</th>
                    <th>NodeId</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.map((mu) => (
                    <tr key={mu.id}>
                        <td>{mu.id}</td>
                        <td>{mu.networkId}</td>
                        <td>{mu.type}</td>
                        <td>{mu.measuresUnit}</td>
                        <td>{mu.nodeId? mu.nodeId : "Not Associated"}</td>
                        <td>
                            {
                                mu.nodeId?
                                    <RemoveMU mu={mu}  setDirty={setDirty}/>
                                    :
                                    <DeleteMUModal mu={mu} setDirty={setDirty} />


                        }

                        </td>
                    </tr>
                ))}
                {paginatedData.length === 0 && (
                    <tr>
                        <td colSpan={5} className="text-center">
                            No Measurement Units found.
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <Pagination className="justify-content-center">
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            )}
        </Container>
    );
};

export default MeasurementUnitsPage;
