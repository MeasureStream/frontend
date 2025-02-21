import {Button} from "react-bootstrap";

const FloatingButton = () => {


    const handleButtonClick = () => {

    };

    return (
        <Button
            style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
            }}
            onClick={handleButtonClick}
            variant="primary"
        >
            <i className="bi bi-arrows-angle-contract"></i>
        </Button>
    );
};

export default FloatingButton;