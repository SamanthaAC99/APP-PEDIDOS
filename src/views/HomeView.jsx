import React from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
export default function HomeView(){

    return(
        <>
            <Container maxWidth="xl">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className="header-dash">
                            Panel de Administracion
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}