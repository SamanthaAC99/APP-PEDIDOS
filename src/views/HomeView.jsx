import React from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material";
import Carousel from 'react-material-ui-carousel';
import Image1 from "../assets/conorque1.jpeg"
import Image2 from "../assets/conorque2.jpeg"
import Image3 from "../assets/conorque3.jpeg"

export default function HomeView() {
    const images = [Image1, Image2, Image3]; // Array de imágenes

    const WelcomeMessage = (
        <Typography variant="h4" align="center" style={{ marginTop: 20 }}>
            BIENVENIDOS APP PARA PEDIDOS DE CONORQUE
        </Typography>
    );

    const ImageCarousel = () => (
        <Carousel
            autoPlay={true} // Activar reproducción automática
            animation="slide" // Tipo de animación
            indicators={true} // Muestra los indicadores de navegación
            navButtonsAlwaysVisible={true} // Botones de navegación siempre visibles
            timeout={2000} // Tiempo de transición entre imágenes (2 segundos)
            cycleNavigation={true} // Navegación en bucle
            navButtonsProps={{ // Estilo de los botones de navegación
                style: {
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 0,
                }
            }}
            indicatorContainerProps={{ // Estilo del contenedor de indicadores
                style: {
                    marginTop: 20,
                }
            }}
            style={{ height: '100%' }} // Ajustar la altura para que ocupe el 100% del contenedor
        >
            {images.map((image, index) => (
                <img key={index} src={image} alt={`Image ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ))}
        </Carousel>
    );

    return (
        <>
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {WelcomeMessage}
                    </Grid>
                    <Grid item xs={12}>
                        {ImageCarousel()}
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
