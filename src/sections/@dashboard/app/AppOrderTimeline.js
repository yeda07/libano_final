// AppOrderTimeline.js

import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';

export default function AppOrderTimeline({ title, list }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <List>
          {list.map((item) => (
            <ListItem key={item.id}>
              <ListItemAvatar>
                <Avatar alt={`Imagen de ${item.type}`} src={item.image} />
              </ListItemAvatar>
              <ListItemText
                primary={item.title}
                secondary={item.time.toLocaleDateString()}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
