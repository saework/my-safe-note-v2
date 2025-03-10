import React from 'react';
import Typography from '@mui/material/Typography';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Сервис «Мои заметки» © '}
      {new Date().getFullYear()}
      .
    </Typography>
  );
}

export default Copyright;