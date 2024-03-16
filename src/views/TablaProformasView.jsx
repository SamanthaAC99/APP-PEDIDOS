import { useState, useEffect, useRef } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { collection, query, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { db } from "../firebase/firebase-config";
import FilledInput from '@mui/material/FilledInput';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
export default function TablaProformasView(){
    const [proformas,setProformas] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalProforma,setModalProforma] = useState(false);
    const allProformas = useRef([{}]);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const getData = () => {
        const q = query(collection(db, "proformas"));
        onSnapshot(q, (querySnapshot) => {
            const proformas_aux = [];
            querySnapshot.forEach((doc) => {
                proformas_aux.push(doc.data());
            });
            setProformas(proformas_aux);
            allProformas.current = proformas_aux;
        });

      
       
      
    }

    useEffect(() => {
        getData();
    }, []);

    return(
        <>
                <Container maxWidth="xl">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div className="proforma-container">
                                <div>
                                    <p className="proforma-titulo" style={{ margin: 0 }}> <strong>TABLAS DE PROFORMAS</strong></p>
                                </div>
                                <div>
                                    <p style={{ margin: 0 }} className="proforma-datos">Joan David Encarnacion Diaz <strong>1104595671 .- MECDEVS SAS</strong> </p>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{width:100}} align={'left'}>
                                                    Emisión
                                                </TableCell>
                                                <TableCell  sx={{width:160}} align={'left'}>
                                                    Número
                                                </TableCell>
                                                <TableCell align={'left'}>
                                                    Valor
                                                </TableCell>
                                                <TableCell align={'left'}>
                                                    NID Cliente
                                                </TableCell>
                                                <TableCell align={'left'}>
                                                    Cliente
                                                </TableCell>
                                                <TableCell align={'left'}>
                                                    Estado
                                                </TableCell>
                                                <TableCell align={'left'}>
    
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {proformas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => {
                                                    return (
                                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                            <TableCell align={"center"}>
                                                                {row.fecha}
                                                            </TableCell>
                                                            <TableCell align={"center"}>
                                                               {row.numero_proforma}
                                                            </TableCell>
                                                            <TableCell align={"center"}>
                                                                {row.total}
                                                            </TableCell>
                                                            <TableCell align={"center"}>
                                                                {row.ci}
                                                            </TableCell>
                                                            <TableCell align={"center"}>
                                                                {row.nombre}
                                                            </TableCell>
                                                            <TableCell align={"center"}>
                                                                {row.estado}
                                                            </TableCell>
                                                            <TableCell align={"center"}>
                                                                <Stack direction="row" spacing={1}>
                                                                    <IconButton aria-label="delete" color="rojo"  >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                    <IconButton aria-label="delete" color="gris"  >
                                                                        <SettingsIcon />
                                                                    </IconButton>
                                                                </Stack>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={proformas.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                        </Grid>
                    </Grid>
                    </Container>
                    <Modal isOpen={modalProforma} >
                        <ModalHeader>Registrar Nuevo Cliente</ModalHeader>
                            <ModalBody>
                                
                            </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                    </Modal>
                   
        </>
    );
}