import { useState, useEffect, useRef } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { collection, query, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { db } from "../firebase/firebase-config";
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
export default function TablasFacturasView() {
    const [facturas, setFacturas] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalVisualizar, setModalVisualizar] = useState(false);
    const [currentFactura,setCurrentFactura] = useState({products:[]})
    const allFacturas = useRef([{}]);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const abrirModalVisualizar = (_data) => {
        setCurrentFactura(_data);
        setModalVisualizar(true);
    }
    const getData = () => {
        const q = query(collection(db, "facturas"));
        onSnapshot(q, (querySnapshot) => {
            const facturas_aux = [];
            querySnapshot.forEach((doc) => {
                facturas_aux.push(doc.data());
            });
            setFacturas(facturas_aux);
            allFacturas.current = facturas_aux;
        });
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <Container maxWidth="xl">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className="proforma-container">
                            <div>
                                <p className="proforma-titulo" style={{ margin: 0 }}> <strong>TABLAS DE FACTURAS</strong></p>
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
                                        <TableCell sx={{ width: 100 }} align={'left'}>
                                            Emisión
                                        </TableCell>
                                        <TableCell sx={{ width: 160 }} align={'left'}>
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
                                    {facturas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                                        
                                                            <IconButton aria-label="delete" color="gris"  >
                                                                <SettingsIcon />
                                                            </IconButton>
                                                            <IconButton aria-label="delete" color="success" onClick={() => { abrirModalVisualizar(row) }} >
                                                                <RemoveRedEyeIcon />
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
                            count={facturas.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>
                </Grid>
            </Container>
                <Modal isOpen={modalVisualizar} size="lg" >
                    <ModalHeader>Previsualizacion de la Factura</ModalHeader>
                    <ModalBody>
                                <div className="factura-container">
                                    <div className="factura-detalles">
                                        <img width={100} height={100} src="https://firebasestorage.googleapis.com/v0/b/facturero-app.appspot.com/o/profiles%2FLogo%20transparente.png?alt=media&token=47c7abf9-70c4-4724-ba81-6ada0781c40f" ></img>
                                        <div >
                                            <Stack spacing={2} direction={"column"}>
                                                <p className="texto_factura" >JOAN DAVID ENCARNACION DIAZ</p>
                                                <p className="texto_factura" >Matriz: Av Turuhuayco y Juan Estrobel</p>
                                                <p className="texto_factura" >Sucursal: Av Turuhuayco y Juan Estrobel</p>
                                                <p className="texto_factura" >Contribuyente Especial Nro: 120231</p>
                                                <p className="texto_factura" >OBLIGADO LLEVAR CONTABILIDAD: no</p>
                                            </Stack>
                                        </div>
                                    </div>
                                <div className="factura-datos">
                                    <Stack spacing={2} direction={"column"}>
                                        <p className="texto_factura" ><strong>RUC:</strong> 1104595671001</p>
                                        <p className="texto_factura" ><strong>PROFORMA No:</strong> 001-001-000000002</p>
                                        <p className="texto_factura" ><strong>Matriz:</strong> Av Turuhuayco y Juan Estrobel</p>
                                        <p className="texto_factura" ><strong>Sucursal:</strong> Av Turuhuayco y Juan Estrobel</p>
                                        <p className="texto_factura" ><strong>Contribuyente Especial:</strong>--</p>
                                        <p className="texto_factura" ><strong>OBLIGADO A LLEVAR CONTABILIDAD:</strong>NO</p>
                                    </Stack>
                                </div>
                            </div>
                   
              
                        <div style={{borderRadius: 10, border: "2px solid black", padding: 18, margin:8}}>
                            <p className="texto_factura"><strong>Razon Social / Nombres y Apellidos:</strong> CONSUMIDOR FINAL</p>
                            <p className="texto_factura"><strong>RUC/CI:</strong> 9999999999999 <strong>Fecha Emisión:</strong> 27/11/2023</p> 
                        </div>
                        <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="right">Codigo</TableCell>
                                <TableCell align="right">Cant.</TableCell>
                                <TableCell align="right">Descripción</TableCell>
                                <TableCell align="right">Precio Unitario</TableCell>
                                <TableCell align="right">Descuento</TableCell>
                                <TableCell align="right">Precio Total</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {currentFactura.products.map((row,index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="right">{row.codigo}</TableCell>
                                    <TableCell align="right">{row.cantidad}</TableCell>
                                    <TableCell align="right">{row.descripcion}</TableCell>
                                    <TableCell align="right">{row.precio_unitario}</TableCell>
                                    <TableCell align="right">{row.descuento}</TableCell>
                                    <TableCell align="right">{row.precio_total}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                </ModalBody>
                <ModalFooter>
                    <Stack spacing={2} direction={"row"}>
                        <Button color="rojo" variant="contained">GENERAR PDF</Button>
                        <Button color="primary" variant="contained" onClick={() => { setModalVisualizar(false) }}>SALIR</Button>
                    </Stack>
                </ModalFooter>
            </Modal>

        </>
        //tambien 
    );
}