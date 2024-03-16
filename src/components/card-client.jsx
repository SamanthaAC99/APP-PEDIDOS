import PropTypes from 'prop-types';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import HailIcon from '@mui/icons-material/Hail';
export default function CardClient(props){
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
                  Clientes
                </Typography>
                <Typography variant="h6">
                  {value}
                </Typography>
              </Stack>
              <Avatar
                sx={{
                  backgroundColor: '#F1C40F',
                  height: 56,
                  width: 56
                }}
              >
                <SvgIcon>
                  <HailIcon />
                </SvgIcon>
              </Avatar>
            </Stack>
          </CardContent>
        </Card>
      );
    };
    
    CardClient.propTypes = {
      value: PropTypes.string,
      sx: PropTypes.object
    };
