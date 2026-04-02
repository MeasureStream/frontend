import React, { useEffect, useState } from "react";
import { Table, Button, Form, Pagination, Container, Row, Col, InputGroup } from "react-bootstrap";
import { ControlUnitDTO } from "../API/interfaces";
import { getAllCu } from "../API/ControlUnitAPI";
import {DeleteControlUnitModal, RemoveCu} from "../components/CUsModal";

const ITEMS_PER_PAGE = 5;

const ControlUnitsPage: React.FC = () => {
    const [cus, setCus] = useState<ControlUnitDTO[]>([]);
    const [filteredCus, setFilteredCus] = useState<ControlUnitDTO[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [filterName, setFilterName] = useState("");
    const [filterNetworkId, setFilterNetworkId] = useState("");
    const [dirty, setDirty] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (dirty) {
                const page = currentPage - 1;
                const size = ITEMS_PER_PAGE;
                const data = await getAllCu(page, size);
                setCus(data);
                setFilteredCus(data);
                setCurrentPage(1);
                setDirty(false);
            }
        };

        fetchData();
    }, [dirty]);

    const applyFilters = (data: ControlUnitDTO[]) => {
        let filtered = data;
        if (filterName) {
            filtered = filtered.filter((cu) =>
                cu.name.toLowerCase().includes(filterName.toLowerCase())
            );
        }
        if (filterNetworkId) {
            filtered = filtered.filter((cu) =>
                cu.networkId.toString().includes(filterNetworkId)
            );
        }
        setFilteredCus(filtered);
        setCurrentPage(1);
    };

    const handleFilterChange = () => {
        applyFilters(cus);
    };

    const paginatedData = filteredCus.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(filteredCus.length / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <Container>
            <h2 className="mt-4">Control Units</h2>

            <Form onSubmit={(e) => { e.preventDefault(); handleFilterChange(); }}>
                <Row className="my-3">
                    <Col md={4}>
                        <InputGroup>
                            <InputGroup.Text>Name</InputGroup.Text>
                            <Form.Control
                                type="text"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
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
                                setFilterName("");
                                setFilterNetworkId("");
                                setFilteredCus(cus);
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
                    <th>Name</th>
                    <th>Battery (%)</th>
                    <th>RSSI</th>
                    <th>NodeId</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.map((cu) => (
                    <tr key={cu.id}>
                        <td>{cu.id}</td>
                        <td>{cu.networkId}</td>
                        <td>{cu.name}</td>
                        <td>{Math.round(cu.remainingBattery)}%</td>
                        <td>{Math.round(cu.rssi)}</td>
                        <td>{cu.nodeId ? cu.nodeId : "Not Associated"}</td>
                        <td>
                            {
                                cu.nodeId?
                                    <RemoveCu cu={ cu} setDirty={setDirty} />
                                    :
                                    <DeleteControlUnitModal cu={cu} setDirty={setDirty} />
                            }

                        </td>
                    </tr>
                ))}
                {paginatedData.length === 0 && (
                    <tr>
                        <td colSpan={7} className="text-center">
                            No Control Units found.
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

export default ControlUnitsPage;
