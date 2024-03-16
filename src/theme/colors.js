import { alpha } from '@mui/material/styles';

const withAlphas = (color) => {
  return {
    ...color,
    alpha4: alpha(color.main, 0.04),
    alpha8: alpha(color.main, 0.08),
    alpha12: alpha(color.main, 0.12),
    alpha30: alpha(color.main, 0.30),
    alpha50: alpha(color.main, 0.50)
  };
};

export const neutral = {
  50: '#F8F9FA',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D2D6DB',
  400: '#9DA4AE',
  500: '#6C737F',
  600: '#4D5761',
  700: '#2F3746',
  800: '#1C2536',
  900: '#111927'
};

export const indigo = withAlphas({
  lightest: '#F5F7FF',
  light: '#EBEEFE',
  main: '#6366F1',
  dark: '#4338CA',
  darkest: '#312E81',
  contrastText: '#FFFFFF'
});

export const success = withAlphas({
  lightest: '#F0FDF9',
  light: '#3FC79A',
  main: '#10B981',
  dark: '#0B815A',
  darkest: '#134E48',
  contrastText: '#FFFFFF'
});

export const info = withAlphas({
  lightest: '#ECFDFF',
  light: '#CFF9FE',
  main: '#06AED4',
  dark: '#0E7090',
  darkest: '#164C63',
  contrastText: '#FFFFFF'
});

export const warning = withAlphas({
  lightest: '#FFFAEB',
  light: '#FEF0C7',
  main: '#F79009',
  dark: '#B54708',
  darkest: '#7A2E0E',
  contrastText: '#FFFFFF'
});

export const error = withAlphas({
  lightest: '#FEF3F2',
  light: '#FEE4E2',
  main: '#F04438',
  dark: '#B42318',
  darkest: '#7A271A',
  contrastText: '#FFFFFF'
});

export const verde2 = withAlphas( {
  main: '#2ECC71',
  contrastText: '#fff',
  dark: '#27AE60',

})
export const oscuro = withAlphas({
  main: '#2E4053',
  contrastText: '#fff',
  darker: '#053e85',

})
export const anaranjado1=withAlphas({
  main: '#EB984E',
  contrastText: '#fff',
  dark: '#CA6F1E',
})
export const morado1 = withAlphas({
  main: '#A569BD',
  contrastText: '#fff',
  dark: '#0E6251',

})
export const seleccion = withAlphas({
  main:'#34495E ',
  contrastText: '#fff',
  dark: '#0E6251',

})
export const crema =  ({
  main: '#F0B27A',
  contrastText: '#fff',
})
export const advertencia=withAlphas({
  main: '#F5B041',
  contrastText: '#fff',
  dark: '#0E6251',

})
export const rojo=withAlphas({
  main: '#CD5C5C',
  contrastText: '#fff',
  dark: '#CB4335',
  lightest: '#FEF3F2',
  light: '#FEE4E2',
  darkest: '#7A271A',


})
export const verde = withAlphas({
  main: '#27AE60',
  contrastText: '#fff', 
  dark: '#27AE60',
})
export const destello= withAlphas({
  main: '#85C1E9',
  contrastText: '#fff',
  dark: '#0E6251',

})
export const apagado= withAlphas({
  main: '#212F3D',
  contrastText: '#fff',
  dark: '#0E6251',
})
export const azulm=withAlphas({
  main: '#2471A3',
  contrastText: '#fff',
  dark: '#1A5276',
  
})
export const verde123=withAlphas({
  main: '#616A6B',
  contrastText: '#fff',
  dark:'#28B463',
})

export const amarillo =withAlphas({
  main: '#F1C40F',
  contrastText: '#fff',
  dark: '#f1c33a',
})
export const gris=withAlphas({
  main: '#616A6B',
  contrastText: '#fff',
  dark: '#707B7C',
})


