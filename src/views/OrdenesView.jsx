import {useState,useEffect} from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

export default function OrdenesView(){

    const getData = () => {
        const q = query(collection(db, "productos"));
        onSnapshot(q, (querySnapshot) => {
            const products_aux = [];
            querySnapshot.forEach((doc) => {
                products_aux.push(doc.data());
            });
            setItems(products_aux);
            allItems.current = products_aux;
        });
    }

    useEffect(() => {
        getData();
    }, []);
    return(
        <>
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <h1>Proformas View</h1>
                    </Grid>
                    <Grid item xs={12}>
                        
                    </Grid>
                    <Grid item xs={12}>
                    
                    </Grid>
                    <Grid item xs={12}>
                    
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}