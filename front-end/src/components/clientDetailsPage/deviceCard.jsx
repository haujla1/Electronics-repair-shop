import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import AddDevice from './addDevice.jsx'
import {Link} from 'react-router-dom';


import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography
  } from '@mui/material';


  function DeviceCard({device, clientId}){

    return(
        <Card className="card deviceCard"
          variant='outlined'
          sx={{
            height: 'auto',
            width: 250,
            border: '1px solid #29642b',
          }}
        >
            

              <CardContent>

                <Typography className="deviceName"
                sx={{
                    borderBottom: '1px solid #29642b',
                    fontWeight: 'bold'
                }}
                gutterBottom
                variant='h6'
                component='h3'
                >
                {device.manufacturer} {device.modelName}
                </Typography>

                <Typography className="modelNumber"
                  gutterBottom
                  component='div'
                >
                  <dl><dt>Model Number:</dt> <dd>{device.modelNumber}</dd></dl>
                </Typography>

                <Typography className="serialNumber"
                  gutterBottom
                  component='div'
                >
                 <dl><dt>Serial Number:</dt> <dd>{device.serialNumber}</dd></dl>
                </Typography>

                <Typography className="id"
                  gutterBottom
                  component='div'
                >
                  <dl><dt>Device ID:</dt> <dd>{device._id}</dd></dl>
                </Typography>
              </CardContent>
              <Link className="newRepairLink" to={`/newRepair/${clientId}/${device._id}`}>New Repair</Link>
        </Card>
    )
}

export default DeviceCard