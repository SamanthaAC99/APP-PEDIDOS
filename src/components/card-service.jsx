import PropTypes from 'prop-types';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
export default function CardService(props){
    const { value, sx } = props;
    return (
        <Card sx={sx}>
          <CardContent>
            <Stack
              alignItems="flex-start"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              <Stack spacing={1}>
                <Typography
                  color="text.secondary"
                  variant="overline"
                >
                  Servicios
                </Typography>
                <Typography variant="h6">
                  {value}
                </Typography>
              </Stack>
              <Avatar
                sx={{
                  backgroundColor: '#5DADE2',
                  height: 56,
                  width: 56
                }}
              >
                <SvgIcon>
                  <DesignServicesIcon />
                </SvgIcon>
              </Avatar>
            </Stack>
          </CardContent>
        </Card>
      );
    };
    
    CardService.propTypes = {
      value: PropTypes.string,
      sx: PropTypes.object
    };
