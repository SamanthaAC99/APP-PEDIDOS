import PropTypes from 'prop-types';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
export default function CardProduct(props){
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
                  Productos
                </Typography>
                <Typography variant="h6">
                  {value}
                </Typography>
              </Stack>
              <Avatar
                sx={{
                  backgroundColor: 'success.main',
                  height: 56,
                  width: 56
                }}
              >
                <SvgIcon>
                  <ShoppingBagIcon />
                </SvgIcon>
              </Avatar>
            </Stack>
          </CardContent>
        </Card>
      );
    };
    
    CardProduct.propTypes = {
      value: PropTypes.string,
      sx: PropTypes.object
    };
